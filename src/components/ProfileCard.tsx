import { Heart, MapPin, ArrowRight, Clock, GraduationCap, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Profile } from "@/data/profiles";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { sendConnectionRequest, checkExistingConnection, ConnectionStatus } from "@/services/connectionService";
import { useEffect } from "react";

function getMatchColor(percent: number) {
  return "text-green-600 border-green-500 bg-green-50 dark:bg-green-950 dark:text-green-400";
}

export default function ProfileCard({ 
  profile, 
  index = 0, 
  onConnect 
}: { 
  profile: Profile; 
  index?: number; 
  onConnect?: () => void;
}) {
  const [saved, setSaved] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const checkStatus = async () => {
      if (user && profile.id) {
        const status = await checkExistingConnection(user.id, profile.id);
        setConnectionStatus(status);
      }
    };
    checkStatus();
  }, [user, profile.id]);

  const handleConnect = async () => {
    if (isConnecting) return;
    if (!user) {
      toast.error("Please log in to connect with founders.");
      return;
    }

    setIsConnecting(true);
    
    // In a full implementation, we map receiverId correctly.
    // Using profile.id as a fallback for both receiver and post for now.
    const res = await sendConnectionRequest(
      user.id,
      profile.id, 
      null, // Allow connection without a specific post context
      user.email || 'Anonymous Founder', 
      profile.name, 
      `${profile.name.split(" ")[0].toLowerCase()}@example.com`, // mock email
      profile.lookingFor,
      `Looking for ${profile.role}`
    );
    
    setIsConnecting(false);

    if (res.success) {
      toast.success(`Connection request sent to ${profile.name.split(" ")[0]}! ✓`);
      setConnectionStatus("pending");
    } else {
      toast.error(res.error || "Failed to send connection request.");
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    toast(saved ? "Removed from shortlist" : `${profile.name.split(" ")[0]} saved to shortlist ♥`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ y: -10, transition: { duration: 0.25 } }}
      onClick={onConnect}
      className="glass-card rounded-2xl p-5 relative group cursor-pointer"
    >
      {/* Shimmer on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer pointer-events-none" />

      {/* Match badge */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 + index * 0.08, type: "spring", stiffness: 200 }}
        className={`absolute top-4 right-4 w-12 h-12 rounded-full border-2 flex items-center justify-center text-xs font-bold ${getMatchColor(profile.matchPercent)}`}
      >
        {profile.matchPercent}%
      </motion.div>

      <div className="flex items-center gap-3 mb-3">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden text-lg font-bold text-primary-foreground shrink-0 shadow-lg"
          style={{ backgroundColor: profile.avatarColor }}
        >
          {profile.avatarUrl ? (
            <img 
              src={profile.avatarUrl} 
              alt={profile.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            profile.name.split(" ").map((n) => n[0]).join("")
          )}
        </motion.div>
        <div>
          <h3 className="font-semibold text-foreground text-sm">{profile.name}</h3>
          <p className="text-[10px] font-bold text-primary/80 uppercase tracking-tight line-clamp-1">{profile.work}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <MapPin size={10} /> {profile.location}
            </p>
            <div className="w-1 h-1 rounded-full bg-border" />
            <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
              <Clock size={10} /> {profile.timeCommitment}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-1.5 gap-y-2 mb-4">
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
          {profile.domain}
        </span>
        {profile.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="text-xs text-foreground/80 leading-relaxed mb-2 line-clamp-3">
        {profile.bio}
      </p>

      <p className="text-[10px] text-primary font-medium mb-3">
        🔍 Looking for: {profile.lookingFor}
      </p>

      {/* Structured Background Section */}
      {(profile.educationHistory?.length || 0) > 0 || (profile.experienceHistory?.length || 0) > 0 ? (
        <div className="space-y-2 mb-4 pt-3 border-t border-border/40">
          {(profile.experienceHistory || []).slice(0, 1).map((exp, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-md bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                <Briefcase size={10} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-foreground line-clamp-1">{exp.role} @ {exp.company}</p>
                <p className="text-[9px] text-muted-foreground">{exp.year}</p>
              </div>
            </div>
          ))}
          {(profile.educationHistory || []).slice(0, 1).map((edu, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-md bg-secondary/5 flex items-center justify-center shrink-0 border border-secondary/10">
                <GraduationCap size={10} className="text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-foreground line-clamp-1">{edu.degree}</p>
                <p className="text-[9px] text-muted-foreground">{edu.school} • {edu.year}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <motion.button
          onClick={handleConnect}
          disabled={isConnecting || !!connectionStatus}
          whileHover={!connectionStatus ? { scale: 1.02 } : {}}
          whileTap={!connectionStatus ? { scale: 0.97 } : {}}
          className={`flex-1 text-xs font-semibold py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1 shadow-md ${
            connectionStatus 
              ? "bg-muted text-muted-foreground cursor-default border border-border" 
              : "bg-primary text-primary-foreground hover:opacity-90 shadow-primary/20"
          }`}
        >
          {connectionStatus === "pending" ? (
            "Request Sent"
          ) : connectionStatus === "accepted" ? (
            "Connected ✓"
          ) : connectionStatus === "rejected" ? (
            "Request Declined"
          ) : (
            <>Connect <ArrowRight size={12} /></>
          )}
        </motion.button>
        {profile.linkedin && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              window.open(profile.linkedin, '_blank');
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-lg border border-border text-muted-foreground hover:border-[#0077b5] hover:text-[#0077b5] transition-all"
            title="View LinkedIn Profile"
          >
            <Linkedin size={14} />
          </motion.button>
        )}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            handleSave();
          }}
          whileTap={{ scale: 1.3 }}
          transition={{ type: "spring", stiffness: 400 }}
          className={`p-2.5 rounded-lg border transition-all ${
            saved
              ? "bg-primary/10 border-primary text-primary"
              : "border-border text-muted-foreground hover:border-primary hover:text-primary"
          }`}
          aria-label="Save profile"
        >
          <Heart size={14} fill={saved ? "currentColor" : "none"} />
        </motion.button>
      </div>
    </motion.div>
  );
}
