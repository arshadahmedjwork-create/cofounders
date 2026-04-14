import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Building, 
  Rocket, 
  Target, 
  ArrowRight, 
  Linkedin, 
  Package, 
  Layers, 
  Clock, 
  ShieldCheck,
  Megaphone
} from "lucide-react";
import { FounderPost } from "@/types/post";

interface OpportunityModalProps {
  post: FounderPost | null;
  onClose: () => void;
  onConnect: (post: FounderPost) => void;
}

export default function OpportunityModal({ post, onClose, onConnect }: OpportunityModalProps) {
  if (!post) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/90 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="relative w-full max-w-3xl bg-card border border-border shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] rounded-[3rem] overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Visual Header */}
          <div className="relative h-56 shrink-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background to-background" />
            
            {/* Animated Background Elements */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 blur-[100px] rounded-full" 
            />
            
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 p-3 rounded-2xl bg-black/20 hover:bg-black/40 text-white backdrop-blur-xl border border-white/10 transition-all z-20"
            >
              <X size={20} />
            </button>

            <div className="absolute bottom-0 left-0 w-full p-10 flex items-end justify-between bg-gradient-to-t from-card to-transparent">
              <div className="flex gap-6 items-center">
                <div className="w-24 h-24 rounded-3xl bg-secondary/20 border border-border backdrop-blur-xl flex items-center justify-center p-4 shadow-2xl relative group">
                   <div className="absolute inset-0 bg-primary/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                   {post.companyLogo ? (
                     <img src={post.companyLogo} className="w-full h-full object-contain" />
                   ) : (
                     <Building className="text-primary w-10 h-10" />
                   )}
                </div>
                <div>
                   <div className="flex items-center gap-2 mb-2">
                     <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 flex items-center gap-2">
                        <Megaphone size={12} /> Live Broadcast
                     </span>
                     <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full">
                        {post.companyName}
                     </span>
                   </div>
                   <h2 className="text-3xl font-display font-bold text-foreground leading-tight">{post.title}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-10 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              
              {/* Main Content */}
              <div className="md:col-span-8 space-y-12">
                
                {/* Vision Section */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-primary rounded-full" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Target size={14} className="text-primary" /> The Opportunity Vision
                    </h3>
                  </div>
                  <div className="text-base leading-relaxed text-foreground/80 bg-muted/20 p-8 rounded-[2rem] border border-border/50 whitespace-pre-wrap">
                    {post.description}
                  </div>
                </section>

                {/* Specific Roles Grid */}
                <section className="space-y-6">
                   <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Layers size={14} className="text-primary" /> Roles Required
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.isArray(post.roles) && post.roles.map(role => (
                      <div key={role} className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border group hover:border-primary/40 transition-all">
                        <div className="p-3 rounded-xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                          <Rocket size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">{role}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Verified Opening</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar Info */}
              <div className="md:col-span-4 space-y-8">
                 
                 {/* Connect Actions */}
                 <div className="space-y-4 pt-4">
                    <button 
                      onClick={() => onConnect(post)}
                      className="w-full flex items-center justify-center gap-3 py-5 bg-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-[0_20px_50px_-10px_rgba(139,92,246,0.5)] hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                    >
                      Connect with Founder <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                    </button>
                    
                    <p className="text-[10px] text-center text-muted-foreground px-4">
                      Connecting will share your identity profile with the founder for professional review.
                    </p>
                 </div>

                 {/* Key Stats Card */}
                 <div className="p-6 rounded-3xl bg-muted/40 border border-border space-y-6">
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                         <Package size={12} className="text-primary" /> Compensation / Package
                       </label>
                       <p className="text-base font-bold text-foreground">{post.package || 'Review in Chat'}</p>
                    </div>

                    <div className="space-y-1.5 pt-4 border-t border-border/50">
                       <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                         <Linkedin size={12} className="text-primary" /> Professional Identity
                       </label>
                       <div className="flex items-center justify-between">
                         <span className="text-sm font-bold opacity-80">{post.companyName}</span>
                         {post.companyLinkedin && (
                           <a 
                             href={post.companyLinkedin} 
                             target="_blank" 
                             className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                           >
                             <Linkedin size={14} />
                           </a>
                         )}
                       </div>
                    </div>

                    <div className="space-y-1.5 pt-4 border-t border-border/50">
                       <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                         <Clock size={12} className="text-primary" /> Broadcasted On
                       </label>
                       <p className="text-xs font-bold text-foreground/70">{new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                    </div>

                    <div className="pt-2">
                       <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                          <ShieldCheck size={14} />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Verified Opportunity</span>
                       </div>
                    </div>
                 </div>

                 <div className="p-6 rounded-3xl border border-dashed border-border flex items-center gap-4 group cursor-pointer hover:border-primary/40 transition-all">
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                       {post.userAvatar ? (
                         <img src={post.userAvatar} className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center font-bold text-xs">{post.userName?.[0]}</div>
                       )}
                    </div>
                    <div>
                       <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-0.5">Posted By</p>
                       <p className="text-sm font-bold text-foreground">{post.userName}</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
