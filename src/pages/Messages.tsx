import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getMessages, sendMessage, subscribeToMessages, Message } from "@/services/messageService";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, Loader2, User } from "lucide-react";
import { toast } from "sonner";

export default function Messages() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const connectionId = params.get("connectionId");
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [peerName, setPeerName] = useState("Founder");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!connectionId || !user) {
      if (!connectionId) navigate("/requests");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      // Fetch messages
      const msgs = await getMessages(connectionId);
      setMessages(msgs);
      
      // Fetch peer info
      const { data: conn } = await supabase
        .from("connection_requests")
        .select(`
          sender_id,
          receiver_id,
          sender_profile:user_profiles!sender_id(first_name, last_name),
          receiver_profile:user_profiles!receiver_id(first_name, last_name)
        `)
        .eq("id", connectionId)
        .single();
      
      if (conn) {
        const isSender = conn.sender_id === user.id;
        // In case Supabase returns profiles as single-item arrays
        const rawPeer = isSender ? conn.receiver_profile : conn.sender_profile;
        const peer = Array.isArray(rawPeer) ? rawPeer[0] : rawPeer;
        setPeerName(`${peer?.first_name || "Co-founder"} ${peer?.last_name || ""}`);
      }
      
      setLoading(false);
    };

    loadData();

    // Subscribe to new messages
    const subscription = subscribeToMessages(connectionId, (msg) => {
      setMessages((prev) => {
        if (prev.find(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [connectionId, user, navigate]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !connectionId) return;

    const content = newMessage;
    setNewMessage(""); // Clear immediate for UX
    
    const res = await sendMessage(connectionId, user.id, content);
    if (!res.success) {
      toast.error("Failed to send message.");
      setNewMessage(content); // Restore if failed
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 pt-28 pb-8 max-w-4xl flex flex-col h-[calc(100vh-2rem)]">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 pt-2">
          <button 
            onClick={() => navigate("/requests?tab=selections")}
            className="p-2.5 rounded-xl bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors border border-border/50"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
              <User size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">{peerName}</h1>
              <p className="text-[10px] text-green-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Online Now
              </p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 glass-card rounded-2xl border border-border/50 overflow-hidden flex flex-col relative max-h-[70vh]">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-primary" size={32} />
              <p className="text-muted-foreground text-sm font-medium">Loading conversation...</p>
            </div>
          ) : (
            <>
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-primary/20"
              >
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-8">
                    <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                      <Send size={24} className="text-muted-foreground/50" />
                    </div>
                    <h3 className="text-white font-bold mb-1">Start the conversation!</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px]">
                      Introduce yourself and share your vision for the partnership.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                          msg.sender_id === user?.id 
                            ? "bg-primary text-primary-foreground rounded-tr-none shadow-primary/20" 
                            : "bg-secondary text-secondary-foreground rounded-tl-none border border-border/30"
                        }`}
                      >
                        {msg.content}
                        <div className={`text-[9px] mt-1 opacity-60 text-right`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm">
                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-muted/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-white placeholder:text-muted-foreground/50"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:hover:opacity-50 transition-all shadow-lg shadow-primary/20"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
        
        <p className="text-center text-[10px] text-muted-foreground mt-4">
          Protected by Cofounder Matrimony • Keep professional and respectful
        </p>
      </div>
    </div>
  );
}
