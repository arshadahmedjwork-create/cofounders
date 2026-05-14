import { motion } from "framer-motion";
import { Users, Zap, Shield, Sparkles } from "lucide-react";

const pillars = [
  {
    title: "Complementary Strengths",
    desc: "Builders need sellers. Visionaries need operators. The best teams complete each other.",
    icon: Zap,
    signals: ["Tech + Sales", "Product + Growth", "Idea + Execution"],
    color: "hsl(252, 100%, 72%)",
  },
  {
    title: "Built for Tough Days",
    desc: "When things break, the right partner helps fix them — not blame you.",
    icon: Shield,
    signals: ["Zero-Blame", "Resilience", "High-Trust"],
    color: "hsl(174, 52%, 52%)",
  },
  {
    title: "Different, Yet Aligned",
    desc: "Strong partnerships respect individuality while building one shared mission.",
    icon: Sparkles,
    signals: ["Shared Vision", "Unique Style", "One Mission"],
    color: "hsl(330, 81%, 60%)",
  },
];

export default function CorePhilosophy() {
  return (
    <section className="py-32 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-6"
          >
            <Users size={12} className="text-primary" />
            The Partnership Mindset
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 text-white">
            Great startups are built like <br />
            <span className="text-primary italic">great partnerships.</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            “The best startups are never built alone.”
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-1 rounded-[2rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10 group hover:border-primary/30 transition-all"
            >
              <div className="p-8 h-full flex flex-col">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                  style={{ background: `${pillar.color}15`, border: `1px solid ${pillar.color}30` }}
                >
                  <pillar.icon size={20} style={{ color: pillar.color }} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">{pillar.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
                  {pillar.desc}
                </p>
                
                <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                  {pillar.signals.map(signal => (
                    <span key={signal} className="px-2 py-1 rounded-md bg-white/5 text-[9px] font-bold uppercase tracking-tight text-slate-500 border border-white/5">
                      {signal}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
