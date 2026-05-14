import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Brain, CheckCircle2, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const ACCENT = "hsl(252, 100%, 72%)";

const dimensions = [
  { label: "Vision Alignment", value: 92, insight: "High Synergy" },
  { label: "Execution Style", value: 87, insight: "Complementary" },
  { label: "Conflict Resilience", value: 78, insight: "Strong" },
  { label: "Communication", value: 85, insight: "Fast Cadence" },
];

function DimensionChip({ label, value, insight, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-primary/40 transition-all"
    >
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</span>
        <span className="text-xs font-bold text-white">{insight}</span>
      </div>
      <div className="text-right">
        <span className="text-xl font-display font-bold text-primary">{value}%</span>
      </div>
    </motion.div>
  );
}

export default function PsychometricTeaser() {
  return (
    <section className="py-32 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
          {/* Left: Product Preview */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="p-1 rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-transparent border border-white/10 overflow-hidden shadow-2xl bg-slate-900">
              <div className="p-8">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                      <Brain size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Founder Personality DNA</h4>
                      <p className="text-[10px] text-slate-500">Analysis complete ✓</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold uppercase tracking-widest">
                    High Compatibility
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {dimensions.map((d, i) => (
                    <DimensionChip key={d.label} {...d} index={i} />
                  ))}
                </div>

                <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0 mt-1">
                      <Zap size={14} />
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      <span className="font-bold text-white">Match Insight:</span> You both prefer fast execution over long planning cycles. This leads to 2.4x higher prototype velocity.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating indicator */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-6 -right-6 p-4 rounded-2xl bg-slate-800 border border-white/10 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-teal-400" />
                <span className="text-xs font-bold text-white">Risk Tolerance Match: 84%</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <span className="text-[10px] font-bold tracking-widest uppercase text-primary">Science of Teams</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8">
              Beyond Skills — <br />
              <span className="text-primary italic">Personality Fit.</span>
            </h2>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed">
              Resumes tell you what they’ve done. We tell you how they think. 
              Find a partner who respects your individuality while building a shared mission.
            </p>

            <div className="space-y-4">
              {[
                "Shared Risk Appetite",
                "Complementary Execution Styles",
                "Communication Frequency Match",
                "Conflict Resolution Synergy",
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">
                    <CheckCircle2 size={12} />
                  </div>
                  <span className="text-sm text-slate-300">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Link to="/assessment">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-8 py-4 rounded-full bg-primary text-white font-bold text-sm shadow-xl shadow-primary/20"
                >
                  Understand Your DNA
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

