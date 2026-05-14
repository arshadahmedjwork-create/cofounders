import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getLastAssessment } from "@/services/assessmentService";

const DISMISS_KEY = "psychometric_prompt_dismissed_at";
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

export default function PsychometricPrompt() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVisibility = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      const assessment = await getLastAssessment(user.email);
      if (assessment) {
        setIsVisible(false);
        setLoading(false);
        return;
      }

      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      if (dismissedAt) {
        const timeSince = Date.now() - parseInt(dismissedAt);
        if (timeSince < COOLDOWN_MS) {
          setIsVisible(false);
          setLoading(false);
          return;
        }
      }

      // Add a slight delay for "creative" entry
      setTimeout(() => setIsVisible(true), 1500);
      setLoading(false);
    };

    checkVisibility();
  }, [user]);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setIsVisible(false);
  };

  if (loading || !isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-8 right-8 z-[100] w-full max-w-[380px] pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="pointer-events-auto relative"
        >
          {/* Holographic Diagnostic Card */}
          <div className="relative overflow-hidden p-6 rounded-[2rem] bg-slate-900/40 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
            
            {/* Scanning Line Animation */}
            <motion.div 
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent z-20 pointer-events-none"
            />

            {/* Content Container */}
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 relative overflow-hidden">
                    <BrainCircuit className="animate-pulse" size={28} />
                    {/* Inner spinning ring */}
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full scale-150"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full border-2 border-slate-900 animate-ping" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white tracking-tight">DNA DIAGNOSTIC</h4>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] animate-pulse">Sync Required</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <span className="text-white font-bold italic">“Resumes tell you what they’ve done. We tell you how they think.”</span>
                  </p>
                </div>
                
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Match Optimization</span>
                  <span className="text-[10px] font-bold text-slate-500">28% Efficiency</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '28%' }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  to="/assessment"
                  className="w-full h-12 rounded-xl bg-primary text-white font-bold text-xs shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95"
                >
                  <Zap size={14} /> Boost Match Clarity
                </Link>
                <button
                  onClick={handleDismiss}
                  className="w-full py-3 text-[10px] font-bold text-slate-500 hover:text-white transition-colors"
                >
                  Dismiss for 24h
                </button>
              </div>
            </div>

            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 blur-[40px] rounded-full pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
