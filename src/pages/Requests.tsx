import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { getIncomingRequestsRaw, getOutgoingRequestsRaw, updateRequestStatus, ConnectionRequest } from "@/services/connectionService";
import { getProfiles } from "@/services/profileService";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ArrowRight, Inbox, Send, Star, Users, Briefcase, MessageSquare, ShieldCheck, Sparkles, UserCircle } from "lucide-react";
import Footer from "@/components/landing/Footer";
import ProfileModal from "@/components/ProfileModal";
import { Profile } from "@/data/profiles";

export default function Requests() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const activeTab = params.get("tab") || "incoming";

  const [incoming, setIncoming] = useState<ConnectionRequest[]>([]);
  const [outgoing, setOutgoing] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      const [incRaw, outRaw, allProfiles, { data: allPosts }] = await Promise.all([
        getIncomingRequestsRaw(user.id),
        getOutgoingRequestsRaw(user.id),
        getProfiles(),
        supabase.from("cofounder_posts").select("id, title, roles")
      ]);

      const profileMap = new Map(allProfiles.map(p => [p.id, p]));
      const postMap = new Map((allPosts || []).map(p => [p.id, p]));

      const mapRequest = (req: any) => {
        const mapped = {
          ...req,
          sender_profile: profileMap.get(req.sender_id),
          receiver_profile: profileMap.get(req.receiver_id),
          post_details: postMap.get(req.post_id)
        };
        return mapped;
      };

      setIncoming(incRaw.map(mapRequest));
      setOutgoing(outRaw.map(mapRequest));
    } catch (err) {
      console.error("Error fetching connection data:", err);
      toast.error("Failed to load connection data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleStatus = async (id: string, status: "accepted" | "rejected") => {
    const res = await updateRequestStatus(id, status);
    if (res.success) {
      toast.success(`Request ${status}!`);
      fetchData();
    } else {
      toast.error("Failed to update status.");
    }
  };

  const tabs = [
    { id: "incoming", label: "Incoming", icon: Inbox },
    { id: "sent", label: "My Requests", icon: Send },
    { id: "selections", label: "Selections", icon: Star }
  ];

  const selections = Array.from(
    new Map(
      [...incoming.filter(r => r.status === "accepted"), ...outgoing.filter(r => r.status === "accepted")]
        .map(r => [r.id, r])
    ).values()
  );

  const pendingIncoming = incoming.filter(r => r.status === "pending");

  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col overflow-hidden">
      <Navbar />
      
      {/* High-Fidelity Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10 opacity-40">
        <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[15%] left-[5%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <div className="flex-grow container mx-auto px-4 pt-32 md:pt-40 pb-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between items-start gap-10 md:gap-8 mb-10 md:mb-12"
          >
            <div className="w-full md:w-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary uppercase text-[9px] md:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.25em] flex items-center gap-2">
                  <Sparkles size={14} className="animate-pulse" /> Synergy Protocol Enabled
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight leading-tight">
                Connection <span className="text-primary italic font-accent">Network</span>
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-2 font-medium max-w-md">Orchestrate your startup journey. Track inquiries and manage your verified matches.</p>
            </div>

            {/* Premium Tab Bar */}
            <div className="flex flex-wrap md:flex-nowrap p-1.5 bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl md:rounded-3xl shadow-2xl relative w-full md:w-auto overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setParams({ tab: tab.id })}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-xl text-[10px] md:text-xs font-bold transition-all relative z-10 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon size={14} className="md:w-4 md:h-4" />
                  {tab.label}
                  {tab.id === "incoming" && pendingIncoming.length > 0 && (
                    <span className="flex h-4 w-4 md:h-5 md:min-w-[20px] items-center justify-center rounded-full bg-red-500 text-[8px] md:text-[10px] text-white font-bold animate-pulse border-2 border-background">
                      {pendingIncoming.length}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTabGlow" 
                      className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-[0_10px_30px_rgba(139,92,246,0.3)]" 
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} 
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Main Context Area */}
          <div className="relative min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 md:py-32 space-y-4">
                <div className="animate-spin w-10 h-10 md:w-12 md:h-12 border-4 border-primary border-t-transparent rounded-full shadow-lg shadow-primary/20" />
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Syncing Connection Ledger...</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {activeTab === "incoming" && (
                  <motion.div 
                    key="incoming" 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                       <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 md:gap-3">
                         <Inbox className="text-primary" size={22} /> Incoming Invitations
                       </h2>
                       <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-ping" />
                          <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Live
                          </span>
                       </div>
                    </div>

                    {pendingIncoming.length === 0 ? (
                      <EmptyState 
                        icon={Inbox} 
                        title="Your Grid is Silent" 
                        description="New co-founder requests will manifest here." 
                      />
                    ) : (
                      <div className="grid grid-cols-1 gap-4 md:gap-5">
                        {pendingIncoming.map((req, i) => (
                          <HolographicCard 
                            key={`inc-${req.id}`} 
                            request={req} 
                            type="incoming"
                            index={i} 
                            onAction={handleStatus} 
                            onViewProfile={(p) => setSelectedProfile(p)}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "sent" && (
                  <motion.div 
                    key="sent" 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                      <Send className="text-primary" size={22} /> My Active Requests
                    </h2>
                    {outgoing.length === 0 ? (
                      <EmptyState 
                        icon={Send} 
                        title="No Signals Sent" 
                        description="Explore the network and start building synergies." 
                        actionText="Explore Network"
                        actionHref="/browse"
                      />
                    ) : (
                      <div className="grid grid-cols-1 gap-4 md:gap-5">
                        {outgoing.map((req, i) => (
                          <HolographicCard 
                            key={`out-${req.id}`} 
                            request={req} 
                            type="sent" 
                            index={i}
                            onViewProfile={(p) => setSelectedProfile(p)}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "selections" && (
                  <motion.div 
                    key="selections" 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                      <Star className="text-primary" size={22} /> Verified Matches
                    </h2>
                    {selections.length === 0 ? (
                      <EmptyState 
                        icon={Star} 
                        title="No Established Synergies" 
                        description="Your successful co-founder matches will be featured here." 
                      />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {selections.map((req, i) => (
                          <SelectionCard 
                            key={`sel-${req.id}`} 
                            request={req} 
                            currentUserId={user?.id || ""} 
                            index={i}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
      <Footer />
      
      <ProfileModal 
        profile={selectedProfile}
        onClose={() => setSelectedProfile(null)}
        onConnect={() => {
          setSelectedProfile(null);
          toast.info("Connection request was already pending.");
        }}
      />
    </div>
  );
}

function HolographicCard({ request, type, onAction, onViewProfile, index }: { 
  request: ConnectionRequest; 
  type: 'incoming' | 'sent';
  onAction?: (id: string, status: 'accepted' | 'rejected') => void;
  onViewProfile?: (profile: Profile) => void;
  index: number;
}) {
  const profile = type === 'incoming' ? request.sender_profile : request.receiver_profile;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-card/60 backdrop-blur-xl border border-border/50 shadow-2xl relative overflow-hidden group hover:border-primary/40 transition-all hover:bg-card/80"
    >
      <div className="absolute top-0 right-0 w-32 md:w-48 h-32 md:h-48 bg-primary/5 blur-[60px] rounded-full group-hover:bg-primary/10 transition-all -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center justify-between relative z-10">
        <div className="flex gap-4 md:gap-6 items-center w-full">
          <div className="relative shrink-0">
             <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-[#0a0a0f] border border-border shadow-2xl p-1 overflow-hidden group-hover:border-primary/50 transition-colors">
               {profile?.avatarUrl ? (
                 <img src={profile.avatarUrl} className="w-full h-full object-cover rounded-[1rem] md:rounded-[1.25rem]" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-2xl md:text-3xl font-bold bg-primary/10 text-primary rounded-[1rem] md:rounded-[1.25rem]">
                   {(profile?.name?.[0] || 'A').toUpperCase()}
                 </div>
               )}
             </div>
             <div className={`absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full border-[3px] border-card ${request.status === 'pending' ? 'bg-primary animate-pulse' : request.status === 'accepted' ? 'bg-emerald-500' : 'bg-red-500'}`} />
          </div>

          <div className="overflow-hidden">
             <div className="flex flex-wrap items-center gap-2 mb-2">
                {request.post_details ? (
                  <span className="text-primary flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full border border-primary/20 text-[8px] md:text-[9px] font-bold tracking-wider">
                    <Sparkles size={10} className="text-primary" /> Broadcast Interest
                  </span>
                ) : (
                  <span className="text-muted-foreground flex items-center gap-1.5 bg-muted/40 px-3 py-1 rounded-full border border-border/50 text-[8px] md:text-[9px] font-bold tracking-wider">
                    <Users size={10} /> Synergy Discovery
                  </span>
                )}
                {type === 'sent' && (
                  <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground border border-secondary/20 text-[8px] md:text-[9px] font-black uppercase tracking-wider">
                    Sent
                  </span>
                )}
             </div>
             <h3 className="text-xl md:text-2xl font-display font-bold text-foreground truncate max-w-full">
               {profile?.name || "Anonymous Member"}
             </h3>
             <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-2 mt-1 truncate max-w-full">
               {request.post_details ? (
                 <span className="truncate">Inquiry for: <span className="font-bold text-primary">{request.post_details.title}</span></span>
               ) : (
                 <span className="opacity-70 italic font-medium truncate">Interested in connecting for synergy</span>
               )}
             </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
          {type === 'incoming' && request.status === 'pending' ? (
            <>
              <button 
                onClick={() => onAction?.(request.id, "accepted")} 
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-2xl text-xs md:text-sm font-bold shadow-lg transition-all active:scale-95"
              >
                <Check size={16} /> Accept
              </button>
              <button 
                onClick={() => onAction?.(request.id, "rejected")} 
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-card border border-border text-muted-foreground hover:bg-red-500/10 hover:text-red-500 rounded-2xl text-xs md:text-sm font-bold transition-all active:scale-95"
              >
                <X size={16}/> Decline
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-secondary/5 border border-white/5 w-full justify-between sm:justify-start">
               <div className="flex flex-col items-center sm:items-end sm:pr-4 sm:border-r border-border">
                  <span className="text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Status</span>
                  <span className={`text-[10px] md:text-xs font-black uppercase tracking-tight ${request.status === 'accepted' ? 'text-emerald-500' : request.status === 'rejected' ? 'text-red-500' : 'text-primary'}`}>
                     {request.status}
                  </span>
               </div>
               <div className="flex flex-col items-center sm:items-start">
                  <span className="text-[8px] md:text-[9px] text-muted-foreground uppercase font-bold tracking-widest opacity-60">Date</span>
                  <span className="text-[10px] md:text-xs font-bold text-white/80">{new Date(request.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
               </div>
               <button 
                onClick={() => profile && onViewProfile?.(profile)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all ml-auto"
                title="View Profile"
              >
                <UserCircle size={20}/>
               </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SelectionCard({ request, currentUserId, index }: { request: ConnectionRequest; currentUserId: string; index: number }) {
  const isSender = request.sender_id === currentUserId;
  const peer = isSender ? request.receiver_profile : request.sender_profile;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-card via-card to-background border border-primary/30 shadow-2xl relative overflow-hidden group cursor-pointer"
    >
      <div className="absolute -top-10 -right-10 w-40 md:w-56 h-40 md:h-56 bg-primary/10 blur-[60px] rounded-full group-hover:bg-primary/20 transition-all duration-500" />
      
      <div className="flex justify-between items-start mb-6 md:mb-8">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-[#0a0a0f] border-2 md:border-4 border-card shadow-2xl p-1 overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
          {peer?.avatarUrl ? (
            <img src={peer.avatarUrl} className="w-full h-full object-cover rounded-xl md:rounded-[1.5rem]" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl md:text-3xl font-bold bg-primary/10 text-primary">
              {(peer?.name?.[0] || '?').toUpperCase()}
            </div>
          )}
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 md:border-[3px] border-[#0a0a0f] rounded-full shadow-lg" />
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 shadow-sm">
           <ShieldCheck size={14} className="text-emerald-500 animate-pulse" />
           <span className="text-[8px] md:text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Verified Match</span>
        </div>
      </div>

      <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 group-hover:text-primary transition-colors truncate">{peer?.name || "Matched Founder"}</h3>
      <p className="text-xs md:text-sm text-muted-foreground font-medium mb-6 md:mb-8 leading-relaxed opacity-80 line-clamp-2">
        {isSender ? "Accepted your interest listing." : "You accepted their synergy request."}
      </p>

      <div className="flex items-center gap-3 md:gap-4 p-4 rounded-2xl bg-secondary/5 border border-white/5 mb-8 group-hover:border-primary/20 transition-all overflow-hidden text-left">
         <div className="p-2.5 rounded-xl bg-primary/10 text-primary shadow-inner shrink-0">
           <Briefcase size={20} />
         </div>
         <div className="overflow-hidden">
            <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest opacity-60 truncate">Engagement</p>
            <p className="text-xs md:text-sm font-bold text-white group-hover:text-primary transition-colors truncate">{request.post_details?.title || "Direct Connection"}</p>
         </div>
      </div>

      <Link 
        to={`/messages?connectionId=${request.id}`}
        className="w-full inline-flex items-center justify-center gap-3 py-4 md:py-5 rounded-2xl md:rounded-[1.5rem] bg-primary text-primary-foreground text-[10px] md:text-sm font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all group/btn"
      >
        Open Secure Synergy Channel <MessageSquare size={18} className="group-hover/btn:rotate-12 transition-transform" />
      </Link>
    </motion.div>
  );
}

function EmptyState({ icon: Icon, title, description, actionText, actionHref }: { 
  icon: any; 
  title: string; 
  description: string;
  actionText?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center glass-card rounded-[4rem] border-dashed border-2 border-border p-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 -z-10" />
      <div className="w-24 h-24 rounded-full bg-muted/20 flex items-center justify-center mb-8 relative">
        <Icon size={40} className="text-muted-foreground opacity-30" />
        <div className="absolute inset-0 bg-primary/5 blur-[50px] rounded-full animate-pulse" />
      </div>
      <h3 className="text-2xl font-bold mb-3 text-foreground/90">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-10 font-medium">
        {description}
      </p>
      {actionText && actionHref && (
        <Link to={actionHref} className="px-10 py-4 bg-primary text-primary-foreground rounded-[1.5rem] font-bold shadow-[0_15px_40px_-10px_rgba(139,92,246,0.4)] hover:scale-[1.05] transition-all flex items-center gap-3">
          {actionText} <ArrowRight size={18} />
        </Link>
      )}
    </div>
  );
}
