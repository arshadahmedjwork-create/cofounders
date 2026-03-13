import { Heart, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Profile } from "@/data/profiles";
import { toast } from "sonner";

function getMatchColor(percent: number) {
  if (percent >= 90) return "text-green-600 border-green-500 bg-green-50 dark:bg-green-950";
  if (percent >= 75) return "text-orange border-orange bg-orange/10";
  if (percent >= 60) return "text-teal border-teal bg-teal/10";
  return "text-muted-foreground border-muted bg-muted";
}

export default function ProfileCard({ profile, index = 0 }: { profile: Profile; index?: number }) {
  const [saved, setSaved] = useState(false);

  const handleConnect = () => {
    toast.success(`Connection request sent to ${profile.name.split(" ")[0]}! ✓`);
  };

  const handleSave = () => {
    setSaved(!saved);
    toast(saved ? "Removed from shortlist" : `${profile.name.split(" ")[0]} saved to shortlist ♥`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-card rounded-xl p-5 relative group cursor-pointer transition-shadow hover:shadow-xl"
    >
      {/* Match badge */}
      <div className={`absolute top-4 right-4 w-12 h-12 rounded-full border-2 flex items-center justify-center text-xs font-bold ${getMatchColor(profile.matchPercent)}`}>
        {profile.matchPercent}%
      </div>

      {/* Avatar + info */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-primary-foreground shrink-0"
          style={{ backgroundColor: profile.avatarColor }}
        >
          {profile.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm">{profile.name}</h3>
          <p className="text-xs text-muted-foreground">{profile.role}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin size={10} /> {profile.location}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
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

      {/* Bio */}
      <p className="text-xs text-foreground/80 leading-relaxed mb-2 line-clamp-3">
        {profile.bio}
      </p>

      {/* Looking for */}
      <p className="text-[10px] text-primary font-medium mb-4">
        🔍 Looking for: {profile.lookingFor}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleConnect}
          className="flex-1 bg-primary text-primary-foreground text-xs font-semibold py-2 px-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
        >
          Connect <ArrowRight size={12} />
        </button>
        <button
          onClick={handleSave}
          className={`p-2 rounded-lg border transition-all ${
            saved
              ? "bg-primary/10 border-primary text-primary"
              : "border-border text-muted-foreground hover:border-primary hover:text-primary"
          }`}
          aria-label="Save profile"
        >
          <Heart size={14} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
    </motion.div>
  );
}
