import { motion } from "framer-motion";
import { 
  Building, 
  Package, 
  Layers, 
  MapPin, 
  ArrowRight,
  Sparkles,
  Search
} from "lucide-react";
import { FounderPost } from "@/types/post";

export default function OpportunityCard({ 
  post, 
  onView,
  index = 0 
}: { 
  post: FounderPost; 
  onView: () => void;
  index?: number 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      onClick={onView}
      className="glass-card rounded-[2rem] p-6 relative group cursor-pointer overflow-hidden border-primary/10 hover:border-primary/40 transition-all"
    >
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-2xl bg-secondary/30 border border-border flex items-center justify-center p-2 shadow-inner group-hover:border-primary/20 transition-all overflow-hidden bg-white/5">
            {post.companyLogo ? (
              <img src={post.companyLogo} className="w-full h-full object-contain" />
            ) : (
              <Building className="text-muted-foreground w-6 h-6" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-foreground leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-xs font-bold text-primary/80 flex items-center gap-1.5 uppercase tracking-wide">
              {post.companyName}
            </p>
          </div>
        </div>
        
        <div className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 flex flex-col items-end shadow-sm">
          <span className="text-[9px] font-bold text-primary uppercase tracking-tighter opacity-70">Offering</span>
          <span className="text-xs font-bold text-primary">{post.package || 'TBD'}</span>
        </div>
      </div>

      {/* Tags / Roles */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Array.isArray(post.roles) && post.roles.map((role) => (
          <span key={role} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-card border border-border text-[9px] font-bold uppercase tracking-widest text-muted-foreground group-hover:border-primary/20 transition-all">
            <Layers size={10} className="text-primary/70" /> {role}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-6 font-medium">
        {post.description}
      </p>

      {/* Footer / Meta */}
      <div className="flex items-center justify-between pt-5 border-t border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border border-border overflow-hidden bg-muted flex items-center justify-center">
            {post.userAvatar ? (
               <img src={post.userAvatar} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] font-bold">{post.userName?.[0]}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-foreground">{post.userName}</span>
            <span className="text-[9px] text-muted-foreground">Founder</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
          View Detail <ArrowRight size={12} />
        </div>
      </div>

      {/* Hover Highlight Glow */}
      <div className="absolute bottom-0 left-0 w-full h-[4px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
    </motion.div>
  );
}
