import emailjs from "@emailjs/browser";
import { supabase } from "../lib/supabase";

export type ConnectionStatus = "pending" | "accepted" | "rejected";

export interface ConnectionRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  post_id?: string | null;
  status: ConnectionStatus;
  created_at: string;
  // joined fields
  sender_profile?: any;
  receiver_profile?: any;
  post_details?: {
      title: string;
      role_required?: string;
  } | null;
}

/**
 * Creates a new connection request if one doesn't already exist.
 */
export const sendConnectionRequest = async (
  senderId: string,
  receiverId: string,
  postId: string | null,
  senderName: string,
  receiverName: string,
  receiverEmail: string,
  roleApplied: string,
  postTitle: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Attempt to insert the connection request
    const { error: dbError } = await supabase
      .from("connection_requests")
      .insert([
        {
          sender_id: senderId,
          receiver_id: receiverId,
          post_id: postId,
          status: "pending",
        },
      ]);

    if (dbError) {
      if (dbError.code === "23505") { // unique violation
        return { success: false, error: "You have already sent a request for this post." };
      }
      throw dbError;
    }

    // Attempt to send email notification
    await sendEmailNotification({
      sender_name: senderName,
      receiver_name: receiverName,
      receiver_email: receiverEmail,
      role_applied_for: roleApplied,
      post_title: postTitle,
      sender_id: senderId,
      app_url: window.location.origin,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Failed to send connection request:", error);
    return { success: false, error: error.message || "An error occurred." };
  }
};

/**
 * Fetches requests sent TO the completely logged in user.
 */
export const getIncomingRequests = async (userId: string): Promise<ConnectionRequest[]> => {
  const { data, error } = await supabase
    .from("connection_requests")
    .select(`
      *,
      sender_profile:user_profiles!sender_id(first_name, last_name, email, role, city),
      post_details:cofounder_posts!post_id(title, role_required)
    `)
    .eq("receiver_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching incoming requests:", error);
    return [];
  }
  return data as ConnectionRequest[];
};

/**
 * Fetches RAW incoming requests WITHOUT joins (fallback for schema issues).
 */
export const getIncomingRequestsRaw = async (userId: string): Promise<ConnectionRequest[]> => {
  const { data, error } = await supabase
    .from("connection_requests")
    .select("*")
    .eq("receiver_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching incoming requests raw:", error);
    return [];
  }
  return data as ConnectionRequest[];
};

/**
 * Fetches requests sent BY the logged in user.
 */
export const getOutgoingRequests = async (userId: string): Promise<ConnectionRequest[]> => {
  const { data, error } = await supabase
    .from("connection_requests")
    .select(`
      *,
      receiver_profile:user_profiles!receiver_id(first_name, last_name, role),
      post_details:cofounder_posts!post_id(title)
    `)
    .eq("sender_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching outgoing requests:", error);
    return [];
  }
  return data as ConnectionRequest[];
};

/**
 * Fetches RAW outgoing requests WITHOUT joins (fallback for schema issues).
 */
export const getOutgoingRequestsRaw = async (userId: string): Promise<ConnectionRequest[]> => {
  const { data, error } = await supabase
    .from("connection_requests")
    .select("*")
    .eq("sender_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching outgoing requests raw:", error);
    return [];
  }
  return data as ConnectionRequest[];
};

/**
 * Checks if a connection request already exists between two users.
 * Returns the status if it exists, otherwise null.
 */
export const checkExistingConnection = async (
  senderId: string,
  receiverId: string
): Promise<ConnectionStatus | null> => {
  // Guard against non-UUID IDs if the column is UUID (to avoid 400 errors)
  const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  
  // If we know the table expects UUIDs but we have a numeric ID (like '5' from mock data), 
  // skip the DB check to avoid 400 errors.
  // Note: We only check if the DB explicitly errors with 400.
  
  try {
    const { data, error } = await supabase
      .from("connection_requests")
      .select("status")
      .or(`and(sender_id.eq."${senderId}",receiver_id.eq."${receiverId}"),and(sender_id.eq."${receiverId}",receiver_id.eq."${senderId}")`)
      .maybeSingle();

    if (error) {
      if (error.code === '22P02') return null; // Invalid UUID input syntax
      console.error("Error checking existing connection:", error);
      return null;
    }
    
    return data?.status || null;
  } catch (err) {
    return null;
  }
};

/**
 * Updates a connection request status (e.g. accept or reject).
 */
export const updateRequestStatus = async (
  requestId: string,
  status: "accepted" | "rejected"
): Promise<{ success: boolean }> => {
  const { error } = await supabase
    .from("connection_requests")
    .update({ status })
    .eq("id", requestId);

  if (error) {
    console.error("Error updating connection status:", error);
    return { success: false };
  }
  return { success: true };
};

/**
 * Sends an email via EmailJS integration
 */
export const sendEmailNotification = async (params: {
  sender_name: string;
  receiver_name: string;
  receiver_email: string;
  role_applied_for: string;
  post_title: string;
  sender_id: string;
  app_url: string;
}) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn("EmailJS credentials not found in .env. Skipping email notification.");
    return false;
  }

  try {
    await emailjs.send(serviceId, templateId, {
      ...params,
      to_email: params.receiver_email,
    }, publicKey);
    return true;
  } catch (err) {
    console.error("Failed to send EmailJS notification:", err);
    return false;
  }
};
