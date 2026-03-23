import { supabase } from "../lib/supabase";

export interface Message {
  id: string;
  connection_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

/**
 * Sends a message to a specific connection.
 */
export const sendMessage = async (connectionId: string, senderId: string, content: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from("messages")
      .insert([{ 
        connection_id: connectionId, 
        sender_id: senderId, 
        content 
      }]);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error sending message:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Fetches all messages for a specific connection.
 */
export const getMessages = async (connectionId: string): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("connection_id", connectionId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data as Message[];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

/**
 * Subscribes to real-time messages for a specific connection.
 */
export const subscribeToMessages = (connectionId: string, callback: (message: Message) => void) => {
  return supabase
    .channel(`messages:${connectionId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `connection_id=eq.${connectionId}`,
      },
      (payload) => {
        callback(payload.new as Message);
      }
    )
    .subscribe();
};
