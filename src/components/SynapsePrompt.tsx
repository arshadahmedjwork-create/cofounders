import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BrainCircuit, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getLastAssessment } from "@/services/assessmentService";

const DISMISS_KEY = "synapse_prompt_dismissed_at";
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

export default function SynapsePrompt() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVisibility = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      // 1. Check if they already took the test
      const assessment = await getLastAssessment(user.email);
      if (assessment) {
        setIsVisible(false);
        setLoading(false);
        return;
      }

      // 2. Check if they skipped it recently
      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      if (dismissedAt) {
        const timeSince = Date.now() - parseInt(dismissedAt);
        if (timeSince < COOLDOWN_MS) {
          setIsVisible(false);
          setLoading(false);
          return;
        }
      }

      setIsVisible(true);
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Immersive Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleDismiss} // Allow clicking backdrop to dismiss
          className="absolute inset-0 bg-background/80 backdrop-blur-2xl cursor-pointer"
        />
        
        {/* Atmospheric Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Crystal Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Top Decorative bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50" />

          <div className="p-8 md:p-12 flex flex-col items-center text-center">
            {/* The Core Icon Section */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative mb-8"
            >
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-b from-primary/30 to-background flex items-center justify-center border border-primary/40 shadow-[0_0_50px_rgba(var(--primary),0.2)]">
                <BrainCircuit className="text-primary animate-pulse" size={40} />
              </div>

              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-background shadow-lg">
                <ShieldCheck size={14} />
              </div>
            </motion.div>

            {/* Content Tiered Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-display font-bold text-foreground mb-4 leading-tight">
                Refine Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Co-founder Match</span>
              </h2>
              
              <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-8 font-medium leading-relaxed opacity-80">
                Running the SYNAPSE™ protocol allows our engine to surface founders with perfect mechanical synergy.
              </p>
            </motion.div>

            {/* Action Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full flex flex-col gap-4"
            >
              <Link
                to="/assessment"
                className="group relative w-full h-14 rounded-2xl bg-primary text-white font-black text-sm shadow-[0_15px_40px_-10px_rgba(var(--primary),0.5)] hover:shadow-primary/40 transition-all flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95 overflow-hidden"
              >
                Run Protocol <ArrowRight size={18} />
              </Link>
              
              <button
                onClick={handleDismiss}
                className="w-full py-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary transition-colors"
              >
                Skip for now
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
