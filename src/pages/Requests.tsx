import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { getIncomingRequests, getOutgoingRequests, updateRequestStatus, ConnectionRequest } from "@/services/connectionService";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

export default function Requests() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const activeTab = params.get("tab") || "incoming";

  const [incoming, setIncoming] = useState<ConnectionRequest[]>([]);
  const [outgoing, setOutgoing] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    const [inc, out] = await Promise.all([
      getIncomingRequests(user.id),
      getOutgoingRequests(user.id)
    ]);
    setIncoming(inc);
    setOutgoing(out);
    setLoading(false);
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
    { id: "incoming", label: "Incoming Requests" },
    { id: "sent", label: "My Requests (Sent)" },
    { id: "selections", label: "My Selections" }
  ];

  const selections = [
    ...incoming.filter(r => r.status === "accepted"),
    ...outgoing.filter(r => r.status === "accepted")
  ];

  const pendingIncoming = incoming.filter(r => r.status === "pending");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
        <h1 className="text-4xl font-display font-bold mb-8">Connection Network</h1>
        
        {/* Tab Nav */}
        <div className="flex max-w-full overflow-x-auto gap-2 p-1 rounded-xl bg-[hsl(222,28%,10%)] border border-[hsl(222,22%,16%)] mb-8 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setParams({ tab: tab.id })}
              className={`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-[hsl(222,26%,16%)] text-white shadow-sm"
                  : "text-[hsl(218,14%,52%)] hover:text-white"
              }`}
            >
              {tab.label}
              {tab.id === "incoming" && pendingIncoming.length > 0 && (
                <span className="ml-2 bg-primary text-white text-[10px] px-1.5 rounded-full">{pendingIncoming.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="glass-card rounded-2xl p-6 min-h-[400px]">
          {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === "incoming" && (
                <motion.div key="incoming" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-xl font-bold mb-6 text-white">Pending Invitations</h2>
                  {pendingIncoming.length === 0 ? <p className="text-[hsl(218,14%,56%)]">You have no new requests.</p> : (
                    <div className="space-y-4">
                      {pendingIncoming.map(req => (
                        <div key={req.id} className="p-5 rounded-xl bg-[hsl(222,28%,12%)] border border-[hsl(222,22%,20%)] flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                          <div>
                            <p className="text-sm text-[hsl(218,14%,56%)] mb-1">
                              {req.post_details ? (
                                <>Request for your post: <span className="font-bold text-white">{req.post_details.title}</span></>
                              ) : (
                                "General Synergy Request"
                              )}
                            </p>
                            <p className="text-white font-semibold flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                                {(req.sender_profile?.first_name?.[0] || 'A').toUpperCase()}
                              </span>
                              {req.sender_profile?.first_name || "Anonymous"} {req.sender_profile?.last_name || "User"}
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <button onClick={() => handleStatus(req.id, "accepted")} className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg text-sm font-bold transition-colors"><Check size={16}/> Accept</button>
                            <button onClick={() => handleStatus(req.id, "rejected")} className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-sm font-bold transition-colors"><X size={16}/> Reject</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "sent" && (
                <motion.div key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-xl font-bold mb-6 text-white">Requests Sent by You</h2>
                  {outgoing.length === 0 ? <p className="text-[hsl(218,14%,56%)]">You haven't sent any requests.</p> : (
                    <div className="space-y-4">
                      {outgoing.map(req => (
                        <div key={req.id} className="p-5 rounded-xl bg-[hsl(222,28%,12%)] border border-[hsl(222,22%,20%)] flex justify-between items-center">
                          <div>
                            <p className="text-sm text-white font-semibold mb-1">Applied for: {req.post_details?.title || "Unknown Post"}</p>
                            <p className="text-xs text-[hsl(218,14%,56%)]">Date: {new Date(req.created_at).toLocaleDateString()}</p>
                          </div>
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${req.status === 'accepted' ? 'bg-green-500/10 text-green-400' : req.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-primary/20 text-primary'}`}>
                            {req.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "selections" && (
                <motion.div key="selections" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-xl font-bold mb-6 text-white">My Selections (Matched Founders)</h2>
                  {selections.length === 0 ? <p className="text-[hsl(218,14%,56%)]">No selections yet. Send or accept requests to build your network.</p> : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {selections.map(req => {
                        const isSender = req.sender_id === user.id;
                        const peerName = isSender 
                          ? `${req.receiver_profile?.first_name || "Unknown"} (Host)`
                          : `${req.sender_profile?.first_name || "Unknown"} (Applicant)`;
                        return (
                          <div key={req.id} className="p-5 rounded-xl bg-gradient-to-br from-[hsl(222,28%,14%)] to-[hsl(222,28%,10%)] border border-primary/20 hover:border-primary/50 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mb-4 shadow-inner">
                              {peerName[0].toUpperCase()}
                            </div>
                            <h3 className="font-bold text-white text-lg mb-1">{peerName}</h3>
                            <p className="text-sm text-[hsl(218,14%,66%)] mb-3">
                              Connected via: <span className="text-white">{req.post_details?.title || "General Synergy"}</span>
                            </p>
                            <button className="text-xs text-primary font-bold hover:underline py-1">Send Message / Schedule Call &rarr;</button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
