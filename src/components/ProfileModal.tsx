import { motion, AnimatePresence } from "framer-motion";
import { X, GraduationCap, Briefcase, Linkedin, Building, Rocket, Target, MapPin, ArrowRight } from "lucide-react";
import { Profile } from "@/data/profiles";
import { PROFILE_BACKGROUNDS } from "@/data/backgrounds";

interface ProfileModalProps {
  profile: Profile | null;
  onClose: () => void;
  onConnect: (profile: Profile) => void;
}

export default function ProfileModal({ profile, onClose, onConnect }: ProfileModalProps) {
  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/90 backdrop-blur-md"
      />
      
      <motion.div
        key={profile.id} // Fixed overlap glitch by keying by ID
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="relative w-full max-w-3xl bg-card border border-border shadow-2xl rounded-[2rem] overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Background Layer */}
        {profile.profileBackground && (
          <div 
            className={`absolute top-0 left-0 w-full h-[300px] ${PROFILE_BACKGROUNDS.find(bg => bg.id === profile.profileBackground)?.class} opacity-10`} 
            style={{ background: PROFILE_BACKGROUNDS.find(bg => bg.id === profile.profileBackground)?.preview }}
          />
        )}
        
        {/* Header Section */}
        <div className="p-8 pb-0 flex flex-col md:flex-row gap-8 items-start relative z-10">
          <div 
            className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden shadow-xl shrink-0 border-4 border-card"
          >
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} className="w-full h-full object-cover" />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center text-4xl font-bold text-white"
                style={{ backgroundColor: profile.avatarColor }}
              >
                {profile.name[0]}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground leading-tight tracking-tight">
                  {profile.name}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    {profile.userType || 'Professional'}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-bold uppercase tracking-widest">
                    <MapPin size={14} className="text-primary" /> {profile.location || 'India'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {profile.linkedin && (
                  <button 
                    onClick={() => window.open(profile.linkedin, '_blank')}
                    className="p-3.5 rounded-2xl bg-secondary/20 hover:bg-secondary/30 text-white border border-border transition-all group"
                  >
                    <Linkedin size={20} className="group-hover:text-[#0077b5] transition-colors" />
                  </button>
                )}
                <button 
                  onClick={() => onConnect(profile)}
                  className="px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 group"
                >
                  Connect <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <p className="text-lg md:text-xl font-medium text-foreground/90 max-w-xl">
              {profile.work}
            </p>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-8 space-y-10">
              {/* About */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary border-b border-primary/10 pb-2">About</h3>
                <p className="text-base leading-relaxed text-foreground/80 whitespace-pre-wrap font-medium">
                  {profile.fullBio || profile.bio}
                </p>
              </section>

              {/* Work History */}
              <section className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary border-b border-primary/10 pb-2">Experience</h3>
                <div className="space-y-8">
                  {profile.experienceHistory?.map((exp, i) => (
                    <div key={i} className="flex gap-6 relative">
                      <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center shrink-0 border border-border">
                        <Briefcase size={20} className="text-primary/60" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-lg text-foreground">{exp.role}</h4>
                        <p className="text-sm text-primary font-semibold">{exp.company}</p>
                        <p className="text-xs text-muted-foreground font-medium">{exp.year}</p>
                      </div>
                    </div>
                  ))}
                  {!profile.experienceHistory?.length && (
                    <p className="text-sm text-muted-foreground italic">No work history provided.</p>
                  )}
                </div>
              </section>

              {/* Education */}
              <section className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary border-b border-primary/10 pb-2">Education</h3>
                <div className="space-y-8">
                  {profile.educationHistory?.map((edu, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center shrink-0 border border-border">
                        <GraduationCap size={20} className="text-primary/60" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-lg text-foreground">{edu.degree}</h4>
                        <p className="text-sm text-primary font-semibold">{edu.school}</p>
                        <p className="text-xs text-muted-foreground font-medium">{edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-4 space-y-10">
              <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.tags.map(tag => (
                    <span key={tag} className="px-3 py-1.5 rounded-xl bg-secondary/30 border border-border text-[10px] font-bold text-foreground hover:border-primary transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>

              <section className="p-6 bg-primary/5 rounded-3xl border border-primary/10 space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary">Compatibility</h3>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-display font-bold text-primary">{profile.matchPercent}%</div>
                  <p className="text-[10px] text-muted-foreground leading-snug font-medium uppercase tracking-tight">
                    Strong psychographic alignment based on DNA
                  </p>
                </div>
              </section>

              {profile.companyName && (
                <section className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Startup</h3>
                  <div className="p-5 rounded-3xl bg-card border border-border space-y-4 group">
                    <div className="flex items-center gap-4">
                      {profile.companyLogo ? (
                        <img src={profile.companyLogo} className="w-12 h-12 rounded-xl object-contain bg-white/5 border border-border p-2" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                          <Building size={20} />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-foreground leading-tight">{profile.companyName}</h4>
                        <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{profile.companyStage}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground italic leading-relaxed pl-3 border-l-2 border-primary/30">
                      "{profile.companyDescription}"
                    </p>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

