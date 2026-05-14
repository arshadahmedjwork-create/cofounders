import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, User, Zap, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
      >
        <source src="/hero_final.mp4" type="video/mp4" />
      </video>

      {/* Overlay: dark at very top/bottom edges, mostly transparent in the middle */}
      <div className="absolute inset-0 z-[1]" style={{
        background: [
          "linear-gradient(180deg,",
          "  hsl(232, 62%, 12%) 0%,",
          "  hsl(232, 62%, 12%, 0.4) 15%,",
          "  hsl(232, 62%, 12%, 0.2) 30%,",
          "  hsl(232, 62%, 12%, 0.2) 70%,",
          "  hsl(232, 62%, 12%, 0.7) 85%,",
          "  hsl(232, 62%, 12%) 100%)"
        ].join("")
      }} />

      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-[2] opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8 mx-auto">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-primary">Live Matching Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.05] mb-8 tracking-tight text-white">
              Don’t Just Find a <br />
              <span className="text-primary italic font-accent">Co-Founder.</span> <br />
              Find Your Other Half.
            </h1>

            <p className="text-lg md:text-xl max-w-2xl mb-12 text-slate-300 leading-relaxed mx-auto">
              Startups survive on trust, resilience, and shared vision. 
              Find people who complement your strengths and stay through the highs and lows.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/onboarding">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 0 40px hsl(252 100% 68% / 0.5)" }}
                  whileTap={{ scale: 0.96 }}
                  className="group relative h-16 px-10 rounded-full font-bold flex items-center gap-3 overflow-hidden text-base shadow-2xl bg-primary text-white"
                >
                  Find Your Match
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>

              <Link to="/vision">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="h-16 px-10 rounded-full font-bold flex items-center gap-3 text-base transition-all bg-white/5 border border-white/10 text-white hover:bg-white/10"
                >
                  Share Your Vision
                </motion.button>
              </Link>
            </div>

            <div className="mt-16 flex flex-col items-center gap-6 border-t border-white/5 pt-12">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-background bg-slate-800 overflow-hidden shadow-xl">
                    <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="Founder" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-2 border-background bg-primary flex items-center justify-center text-xs font-bold text-white shadow-xl">
                  +12k
                </div>
              </div>
              <p className="text-sm text-slate-400 font-medium italic tracking-wide">
                “One strong partnership can change everything.”
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

