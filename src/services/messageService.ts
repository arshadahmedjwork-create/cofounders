import { supabase } from "../lib/supabase";

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

/**
 * Sends a message between two users.
 */
export const sendMessage = async (senderId: string, receiverId: string, content: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from("messages")
      .insert([{ 
        sender_id: senderId, 
        receiver_id: receiverId, 
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
 * Fetches all messages between two users (the conversation history).
 */
export const getMessages = async (userIdA: string, userIdB: string): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${userIdA},receiver_id.eq.${userIdB}),and(sender_id.eq.${userIdB},receiver_id.eq.${userIdA})`)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data as Message[];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

/**
 * Subscribes to real-time messages for a conversation between two users.
 */
export const subscribeToMessages = (userIdA: string, userIdB: string, callback: (message: Message) => void) => {
  return supabase
    .channel(`chat:${userIdA}:${userIdB}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
      },
      (payload) => {
        const msg = payload.new as Message;
        // Only trigger callback if message belongs to this conversation
        const isMaching = 
          (msg.sender_id === userIdA && msg.receiver_id === userIdB) ||
          (msg.sender_id === userIdB && msg.receiver_id === userIdA);
        
        if (isMaching) {
          callback(msg);
        }
      }
    )
    .subscribe();
};
