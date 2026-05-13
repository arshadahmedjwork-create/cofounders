import { motion, useMotionValue, useTransform } from "framer-motion";
import { 
  MapPin, 
  Target, 
  Sparkles, 
  Briefcase, 
  Users, 
  CheckCircle2, 
  Rocket, 
  Zap, 
  TrendingUp, 
  MessageSquare, 
  Layers 
} from "lucide-react";
import { Profile } from "@/data/profiles";
import { PROFILE_BACKGROUNDS } from "@/data/backgrounds";

const CircularProgress = ({ value, label, color }: { value: number; label: string; color: string }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center gap-1.5 cursor-help group"
    >
      <div className="relative w-[64px] h-[64px] flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-white/10"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke={color}
            strokeWidth="4.5"
            fill="transparent"
            strokeDasharray={circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,0,0,0.8)]"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-[10px] font-black text-white group-hover:text-primary transition-colors">{value}%</span>
        </div>
      </div>
      <span className="text-[8px] text-white/40 font-black uppercase tracking-tighter text-center leading-none whitespace-nowrap group-hover:text-white/80 transition-colors">{label}</span>
    </motion.div>
  );
};

const DNAStat = ({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: any }) => (
  <motion.div 
    whileHover={{ x: 5 }}
    className="flex items-center gap-2.5 group cursor-default"
  >
    <div className={`w-6 h-6 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 shrink-0 group-hover:border-primary/30 transition-colors`}>
      <Icon size={12} className={`${color} group-hover:scale-110 transition-transform`} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between text-[8px] font-black uppercase tracking-widest mb-1.5">
        <span className="text-white/40 group-hover:text-white/80 transition-colors truncate mr-2">{label}</span>
        <span className={`${color} opacity-60 group-hover:opacity-100 transition-opacity`}>{value > 85 ? 'High' : value > 60 ? 'Med' : 'Low'}</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full rounded-full ${color.replace('text-', 'bg-')} shadow-[0_0_8px_rgba(0,0,0,0.3)]`} 
        />
      </div>
    </div>
  </motion.div>
);

export const MatchingCard = ({ 
  profile, 
  onSwipe, 
  active = true,
  isPreview = false
}: { 
  profile: Profile; 
  onSwipe?: (direction: 'left' | 'right') => void;
  active?: boolean;
  isPreview?: boolean;
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const colorRight = useTransform(x, [50, 150], ["rgba(34, 197, 94, 0)", "rgba(34, 197, 94, 0.2)"]);
  const colorLeft = useTransform(x, [-50, -150], ["rgba(239, 68, 68, 0)", "rgba(239, 68, 68, 0.2)"]);

  const background = PROFILE_BACKGROUNDS.find(bg => bg.id === profile.profileBackground) || PROFILE_BACKGROUNDS[0];

  const handleDragEnd = (_: any, info: any) => {
    if (isPreview || !onSwipe) return;
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      style={{ x: isPreview ? 0 : x, rotate: isPreview ? 0 : rotate, opacity: isPreview ? 1 : opacity, zIndex: active ? 10 : 0 }}
      drag={(!isPreview && active) ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className={`absolute inset-0 ${isPreview ? 'relative' : 'cursor-grab active:cursor-grabbing'}`}
    >
      <div className="relative w-full h-full bg-[#0a0c10] rounded-[2.5rem] border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col p-5 font-sans text-white">
        {/* Background Layer */}
        <div className={`absolute inset-0 w-full h-full ${background.class} opacity-10`} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0c10]/40 to-[#0a0c10]" />

        {/* Indicators (only if not preview) */}
        {!isPreview && (
          <>
            <motion.div style={{ backgroundColor: colorRight }} className="absolute inset-0 pointer-events-none z-50 rounded-[2.5rem]" />
            <motion.div style={{ backgroundColor: colorLeft }} className="absolute inset-0 pointer-events-none z-50 rounded-[2.5rem]" />
          </>
        )}

        {/* Header Section */}
        <div className="flex justify-between items-start mb-4 z-10 relative pt-2">
          <div className="flex gap-3">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/10 shrink-0 shadow-2xl">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                  {profile.name[0]}
                </div>
              )}
              <div className={`absolute bottom-1.5 left-1.5 right-1.5 py-1 ${profile.intent === 'joining' ? 'bg-blue-500/90' : 'bg-green-500/90'} backdrop-blur-md rounded-md flex items-center justify-center gap-1 shadow-lg`}>
                 <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                 <span className="text-[7px] font-black uppercase tracking-tighter text-white">{profile.intent === 'joining' ? 'Aspirant' : 'Building'}</span>
              </div>
            </div>
            <div className="space-y-0.5 pt-0.5 text-left">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xl font-bold tracking-tight line-clamp-1 max-w-[120px] sm:max-w-[180px]">{profile.name}</h2>
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 size={10} className="text-white" strokeWidth={3} />
                </div>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-[10px] font-semibold">
                <MapPin size={10} className="text-primary" /> <span className="text-white/80">{profile.location}</span>
              </div>
              <div className="flex gap-1.5 mt-2">
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[8px] font-black uppercase tracking-widest border border-primary/20 whitespace-nowrap">{profile.role}</span>
                <span className="px-2 py-0.5 bg-white/5 text-white/60 rounded-md text-[8px] font-black uppercase tracking-widest border border-white/5 whitespace-nowrap">{profile.domain}</span>
              </div>
            </div>
          </div>
          <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-xl p-2.5 flex flex-col items-center min-w-[70px] shadow-xl">
            <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-0.5">Match</span>
            <div className="flex items-center gap-1">
              <span className="text-xl font-black text-primary">{profile.matchPercent}%</span>
              <Sparkles size={12} className="text-primary fill-primary/20" />
            </div>
          </div>
        </div>

        {/* Pitch / Quote */}
        <div className="mb-4 z-10 px-1 text-left">
           <h3 className="text-lg font-medium leading-tight italic text-white line-clamp-2">
             "{profile.bio?.split('.')[0] || "Innovation is our middle name"}."
           </h3>
           <p className="text-[10px] text-white/70 mt-2 font-medium leading-snug line-clamp-3">
             {profile.lookingFor}
           </p>
        </div>

        {/* Compatibility Breakdown */}
        <motion.div 
          whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          className="bg-white/[0.03] border border-white/5 rounded-3xl p-4 mb-4 z-10 transition-colors"
        >
          <div className="flex justify-between items-center mb-4 px-1">
            <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-white">Compatibility Breakdown</h4>
            <div className="flex items-center gap-1 bg-primary/10 px-1.5 py-0.5 rounded-full border border-primary/20">
               <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
               <span className="text-[6px] font-black text-primary uppercase tracking-tighter">Dynamic Match</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
             <CircularProgress value={profile.compSkill || 96} label="Skill" color="#ff4d4d" />
             <CircularProgress value={profile.compVision || 92} label="Vision" color="#8b5cf6" />
             <CircularProgress value={profile.compWorkStyle || 90} label="Style" color="#3b82f6" />
             <CircularProgress value={profile.compAmbition || 94} label="Ambition" color="#10b981" />
          </div>
        </motion.div>

        {/* DNA & Journey Grid */}
        <div className="grid grid-cols-2 gap-5 mb-4 z-10 flex-grow text-left">
          <motion.div 
            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            className="space-y-4 p-2 rounded-2xl transition-colors text-left"
          >
             <div className="flex justify-between items-center px-1">
               <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                 <Target size={10} /> DNA
               </h4>
               <Sparkles size={8} className="text-primary/40" />
             </div>
             <div className="space-y-3">
                <DNAStat label="Risk" value={profile.dnaRisk || 85} color="text-pink-500" icon={TrendingUp} />
                <DNAStat label="Speed" value={profile.dnaSpeed || 92} color="text-purple-500" icon={Zap} />
                <DNAStat label="Leadership" value={profile.dnaLeadership || 78} color="text-blue-500" icon={Users} />
                <DNAStat label="Comm" value={profile.dnaCommunication || 88} color="text-teal-500" icon={MessageSquare} />
             </div>
          </motion.div>
          {profile.intent === 'building' || !profile.intent ? (
            <div className="space-y-4 text-left">
               <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2 px-1">
                 <Rocket size={10} /> Journey
               </h4>
               <div className="relative pt-1 px-1">
                  <div className="absolute top-[22px] left-3 right-3 h-[1px] bg-white/5" />
                  <div className="flex justify-between items-center relative z-10">
                     {['Idea', 'MVP', 'Tract', 'Scale'].map((label, i) => {
                       const isPast = ['Idea', 'MVP', 'Traction', 'Scale'].indexOf(profile.journeyStage || 'Idea') >= i;
                       const isCurrent = (profile.journeyStage || 'Idea') === (label === 'Tract' ? 'Traction' : label);
                       
                       return (
                         <div key={label} className="flex flex-col items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                              isCurrent ? 'bg-primary border-primary scale-110 shadow-[0_0_15px_rgba(139,92,246,0.6)]' :
                              isPast ? 'bg-white/10 border-white/20' : 'bg-[#0a0c10] border-white/5'
                            }`}>
                               {isPast && !isCurrent ? <CheckCircle2 size={12} className="text-primary" /> : 
                                isCurrent ? <Layers size={12} className="text-white" /> : null}
                            </div>
                            <span className={`text-[7px] font-black uppercase tracking-widest ${isPast ? 'text-white' : 'text-white/20'}`}>{label}</span>
                         </div>
                       );
                     })}
                  </div>
                  {/* Traction Card */}
                  <div className="mt-4 p-3 bg-white/[0.03] border border-white/5 rounded-2xl space-y-2 shadow-inner min-h-[90px]">
                     <div className="flex justify-between items-center">
                       <span className="text-[8px] font-black text-primary uppercase tracking-widest">{profile.journeyStage || 'Stage'}</span>
                       <TrendingUp size={10} className="text-primary" />
                     </div>
                      <ul className="text-[8px] text-white/60 space-y-1 font-medium leading-tight max-h-[80px] overflow-hidden">
                         {(profile.tractionDetails && profile.tractionDetails.length > 0 && profile.tractionDetails[0]) ? profile.tractionDetails.slice(0, 3).map((detail, idx) => (
                           detail && <li key={idx} className="flex items-start gap-1 text-white/80 line-clamp-1">• <span>{detail}</span></li>
                         )) : (
                           <>
                             <li className="flex items-start gap-1 text-white/80">• <span>Early feedback positive</span></li>
                             <li className="flex items-start gap-1 text-white/80">• <span>MVP in development</span></li>
                           </>
                         )}
                      </ul>
                  </div>
               </div>
            </div>
          ) : (
            <div className="space-y-4 text-left">
               <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2 px-1">
                 <Zap size={10} /> Core Expertise
               </h4>
               <div className="space-y-3 px-1">
                  {profile.tags.slice(0, 3).map((tag, i) => (
                    <div key={tag} className="space-y-1.5">
                      <div className="flex justify-between text-[7px] font-black uppercase tracking-widest">
                        <span className="text-white/60">{tag}</span>
                        <span className="text-primary">Mastery</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${95 - i * 5}%` }}
                          className="h-full bg-primary/40 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 p-3 bg-white/[0.03] border border-white/5 rounded-2xl space-y-2 shadow-inner min-h-[90px]">
                    <div className="flex justify-between items-center">
                       <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Professional History</span>
                       <Briefcase size={10} className="text-blue-400" />
                    </div>
                    <p className="text-[8px] text-white/60 font-medium leading-relaxed line-clamp-4 italic">
                      {profile.work || "Proven track record in high-growth environments, bringing specialized knowledge to the co-founding team."}
                    </p>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="grid grid-cols-2 gap-6 z-10 pt-4 border-t border-white/10 text-left">
           <div className="space-y-3">
              <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                <Briefcase size={10} /> Expertise
              </h4>
              <div className="flex flex-wrap gap-1.5">
                 {profile.tags.slice(0, 3).map(t => (
                   <span key={t} className="text-[8px] font-bold bg-white/[0.04] text-white/80 px-2 py-1 rounded-lg border border-white/5">{t}</span>
                 ))}
              </div>
           </div>
           <div className="space-y-3">
              <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                <Users size={10} /> Looking For
              </h4>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-primary line-clamp-1">{profile.lookingFor}</p>
                <div className="flex flex-wrap gap-1.5 opacity-60">
                   {['#Equity', '#Vision'].map(h => (
                     <span key={h} className="text-[7px] text-white/50 font-black tracking-widest uppercase">{h}</span>
                   ))}
                </div>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};
