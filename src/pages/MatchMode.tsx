import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { getProfiles, getProfileById } from "@/services/profileService";
import { useQuery } from "@tanstack/react-query";
import { X, Heart, Undo2, Star, Menu, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { MatchingCard } from "@/components/MatchingCard";

export default function MatchMode() {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);

  const { data: myProfile, isLoading: loadingProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfileById(user!.id),
    enabled: !!user
  });

  const { data: profiles = [], isLoading: loadingProfiles } = useQuery({
    queryKey: ["profiles"],
    queryFn: getProfiles,
  });

  const filteredProfiles = useMemo(() => {
    // Only show profiles that have completed their Synapse test
    return profiles.filter(p => p.id !== user?.id && p.hasTakenSynapse);
  }, [profiles, user?.id]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      toast.success(`Sent interest to ${filteredProfiles[currentIndex].name}! 🚀`);
    }
    setHistory(prev => [...prev, currentIndex]);
    setCurrentIndex(prev => prev + 1);
  };

  const undo = () => {
    if (history.length > 0) {
      const lastIndex = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentIndex(lastIndex);
    }
  };

  if (loadingProfile || loadingProfiles) {
    return (
      <div className="min-h-screen bg-[#0B0F2F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
          </div>
          <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs animate-pulse">Scanning Matches...</p>
        </div>
      </div>
    );
  }

  const isProfileIncomplete = !myProfile || !myProfile.hasTakenSynapse;

  if (isProfileIncomplete) {
    return (
      <div className="min-h-screen bg-[#0B0F2F] text-white flex flex-col items-center justify-center p-8 text-center">
        <Navbar />
        <div className="max-w-md space-y-8">
           <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl">
              <Sparkles size={48} className="text-primary" />
           </div>
           <div className="space-y-4">
              <h2 className="text-3xl font-display font-black">Synapse Test Required</h2>
              <p className="text-muted-foreground leading-relaxed">
                To ensure 100% accurate matchmaking, you must complete your profile and take the <strong>Founder DNA (Synapse)</strong> test first.
              </p>
           </div>
           <div className="flex flex-col gap-4">
              <button 
                onClick={() => window.location.href = '/assessment'}
                className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
              >
                Take Synapse Test
              </button>
              <button 
                onClick={() => window.location.href = '/profile'}
                className="w-full py-4 bg-white/5 text-white rounded-2xl font-bold border border-white/10 hover:bg-white/10 transition-all"
              >
                Complete Profile
              </button>
           </div>
        </div>
      </div>
    );
  }

  const isOutOfCards = currentIndex >= filteredProfiles.length;

  return (
    <div className="min-h-screen bg-[#0B0F2F] text-foreground overflow-hidden flex flex-col">
      {/* Custom Match Header */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-3">
           <img src="/new_logo.png" alt="Logo" className="w-8 h-8 object-contain" />
           <span className="font-accent text-lg font-bold text-white/90">Cofounder Matrimony</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer">
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border border-black animate-pulse" />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
           </div>
           <div className="p-1 rounded-full border border-white/10 bg-white/5">
              <Menu className="text-white/70" size={20} />
           </div>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center pt-24 pb-12 px-4 overflow-hidden">
        <div className="relative w-full max-w-[440px] h-[780px]">
          <AnimatePresence>
            {isOutOfCards ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key="out-of-cards"
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-card rounded-[2.5rem] border border-border shadow-xl"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Sparkles size={40} className="text-primary" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-2">That's everyone!</h2>
                <p className="text-muted-foreground text-sm mb-8">You've seen all potential co-founders for now. Check back later for new talent.</p>
                <div className="flex flex-col gap-3 w-full">
                  <button 
                    onClick={() => {
                      setCurrentIndex(0);
                      setHistory([]);
                      toast.success("Profiles reset! Start swiping again. 🔄");
                    }}
                    className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                  >
                    Repeat Profiles
                  </button>
                  <button 
                    onClick={() => window.location.href = '/browse'}
                    className="w-full py-4 bg-white/5 text-white/60 rounded-2xl font-bold border border-white/10 hover:bg-white/10 transition-all"
                  >
                    Return to Browse
                  </button>
                </div>
              </motion.div>
            ) : (
              filteredProfiles.slice(currentIndex, currentIndex + 3).reverse().map((profile, i, arr) => {
                const index = currentIndex + (arr.length - 1 - i);
                const isActive = index === currentIndex;
                
                return (
                  <MatchingCard 
                    key={profile.id}
                    profile={profile}
                    active={isActive}
                    onSwipe={handleSwipe}
                  />
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Control Bar */}
      {!isOutOfCards && (
        <div className="pb-12 flex flex-col items-center gap-6">
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <button 
                onClick={() => handleSwipe('left')}
                className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-red-500 shadow-xl hover:bg-red-500/10 transition-all active:scale-90"
              >
                <X size={32} />
              </button>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pass</span>
            </div>

            <div className="flex flex-col items-center gap-2 -mt-4">
              <button 
                onClick={() => {
                  toast.info("Exploring profile details...");
                }}
                className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:scale-110 transition-all active:scale-95"
              >
                <Star size={40} fill="currentColor" />
              </button>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Explore More</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <button 
                onClick={() => handleSwipe('right')}
                className="w-16 h-16 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center text-[#10b981] shadow-xl hover:bg-[#10b981]/20 transition-all active:scale-90"
              >
                <Heart size={32} fill="currentColor" />
              </button>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#10b981]">Interested</span>
            </div>
          </div>
          
          <button 
            onClick={undo}
            disabled={history.length === 0}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 hover:text-primary transition-colors disabled:opacity-0"
          >
            <Undo2 size={14} /> Undo Swipe
          </button>
        </div>
      )}
    </div>
  );
}
