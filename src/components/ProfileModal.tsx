import { motion, AnimatePresence } from "framer-motion";
import { X, GraduationCap, Briefcase, Linkedin, Calendar, Building, Rocket, Target, MapPin, ArrowRight } from "lucide-react";
import { Profile } from "@/data/profiles";

interface ProfileModalProps {
  profile: Profile | null;
  onClose: () => void;
  onConnect: (profile: Profile) => void;
}

export default function ProfileModal({ profile, onClose, onConnect }: ProfileModalProps) {
  if (!profile) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-3xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Identity Header */}
          <div className="relative">
            {/* Atmospheric Background Banner */}
            <div className="h-44 bg-gradient-to-br from-[#1a1c2e] via-[#2d1b4e] to-[#121218] relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-card" />
              
              {/* Floating Orbs */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full" />
              
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2.5 rounded-2xl bg-black/40 backdrop-blur-xl text-white hover:bg-black/60 transition-all border border-white/10 z-30"
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile Header Info (Floating Over Banner) */}
            <div className="px-8 -mt-20 relative z-20 pb-8 border-b border-border/50">
              <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                <div className="flex items-end gap-6">
                  <div 
                    className="w-36 h-36 rounded-[2.5rem] border-[8px] border-card p-1.5 shadow-2xl bg-[#0a0a0f] overflow-hidden"
                  >
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} className="w-full h-full object-cover rounded-[1.8rem]" />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center text-5xl font-bold text-white rounded-[1.8rem]"
                        style={{ backgroundColor: profile.avatarColor }}
                      >
                        {profile.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="pb-4">
                    <h2 className="text-4xl font-display font-bold text-white leading-tight tracking-tight drop-shadow-lg">{profile.name}</h2>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary bg-primary/20 border border-primary/30 px-4 py-1.5 rounded-full backdrop-blur-md">
                        {profile.userType || 'Professional'}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-bold uppercase tracking-widest opacity-90">
                        <MapPin size={14} className="text-primary" /> {profile.location || 'Unknown Location'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  {profile.linkedin && (
                    <button 
                      onClick={() => window.open(profile.linkedin, '_blank')}
                      className="px-6 py-4 rounded-2xl bg-secondary/10 hover:bg-secondary/20 text-white border border-white/10 backdrop-blur-md transition-all flex items-center gap-2 group"
                    >
                      <Linkedin size={20} className="group-hover:text-[#0077b5] transition-colors" />
                      <span className="text-xs font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">View LinkedIn</span>
                    </button>
                  )}
                  <button 
                    onClick={() => onConnect(profile)}
                    className="px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-[0_15px_40px_-10px_rgba(139,92,246,0.6)] hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center gap-3 group"
                  >
                    Connect Now <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-10 overflow-y-auto custom-scrollbar flex-1 bg-card">

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                {/* BIO */}
                <section className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Target size={14} className="text-primary" /> The Story
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
                    {profile.fullBio || profile.bio}
                  </p>
                </section>

                {/* COMPANY (IF APPLICABLE) */}
                {profile.companyName && (
                  <section className="relative p-6 bg-primary/5 border border-primary/10 rounded-[2rem] overflow-hidden group">
                    {/* Atmospheric Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors" />
                    
                    <div className="relative flex items-start gap-6">
                      {profile.companyLogo ? (
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 p-2 flex items-center justify-center shrink-0 shadow-xl overflow-hidden">
                          <img src={profile.companyLogo} alt={profile.companyName} className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
                          <Building size={24} />
                        </div>
                      )}
                      
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <h4 className="font-display font-bold text-lg text-foreground leading-none">{profile.companyName}</h4>
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{profile.companyStage}</span>
                          </div>
                          <Rocket size={20} className="text-primary animate-pulse opacity-40" />
                        </div>
                        <p className="text-xs text-muted-foreground italic leading-relaxed mt-3 border-l-2 border-primary/20 pl-4">
                          "{profile.companyDescription}"
                        </p>
                      </div>
                    </div>
                  </section>
                )}

                {/* EXPERIENCE */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Briefcase size={14} className="text-primary" /> Work History
                  </h3>
                  <div className="space-y-4">
                    {profile.experienceHistory?.map((exp, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="mt-1 w-2 h-2 rounded-full bg-primary/30 shrink-0" />
                        <div>
                          <div className="font-bold text-sm">{exp.role}</div>
                          <div className="text-xs text-muted-foreground">{exp.company} • {exp.year}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* EDUCATION */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <GraduationCap size={14} className="text-primary" /> Academic Pedigree
                  </h3>
                  <div className="space-y-4">
                    {profile.educationHistory?.map((edu, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="mt-1 w-2 h-2 rounded-full bg-secondary/30 shrink-0" />
                        <div>
                          <div className="font-bold text-sm">{edu.degree}</div>
                          <div className="text-xs text-muted-foreground">{edu.school} • {edu.year}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                 <section className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Skill Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.tags.map(tag => (
                      <span key={tag} className="px-3 py-1.5 rounded-xl bg-card border border-border text-[10px] font-bold text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="p-4 bg-muted/30 rounded-2xl space-y-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Matching Status</h3>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-primary">{profile.matchPercent}%</div>
                    <div className="text-[10px] text-muted-foreground leading-tight">High-fidelity compatibility with your goal profile</div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
