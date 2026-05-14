import { motion } from "framer-motion";
import { AlertCircle, Clock, ShieldCheck } from "lucide-react";

const realityChecks = [
  {
    icon: AlertCircle,
    value: "65%",
    label: "Team Conflict",
    desc: "Startups fail due to co-founder friction more than bad ideas.",
    color: "hsl(0, 84%, 60%)",
  },
  {
    icon: Clock,
    value: "Years",
    label: "Relationship",
    desc: "A co-founder relationship lasts longer than most modern marriages.",
    color: "hsl(252, 100%, 72%)",
  },
  {
    icon: ShieldCheck,
    value: "Trust",
    label: "Equity = Vow",
    desc: "Equity is trust — choose your partner carefully, not quickly.",
    color: "hsl(174, 52%, 52%)",
  },
];

export default function StatsSection() {
  return (
    <section className="py-32 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary text-[10px] font-bold tracking-[0.4em] uppercase mb-4"
          >
            Reality Check
          </motion.p>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Conflict kills more startups <br />
            <span className="text-primary italic">than bad ideas.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {realityChecks.map((check, i) => (
            <motion.div
              key={check.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-8 rounded-[2.5rem] bg-slate-900 border border-white/5 overflow-hidden group"
            >
              <div className="relative z-10">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: `${check.color}15`, border: `1px solid ${check.color}30` }}
                >
                  <check.icon size={18} style={{ color: check.color }} />
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-display font-bold text-white">{check.value}</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{check.label}</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {check.desc}
                </p>
              </div>

              {/* Decorative Background Value */}
              <span className="absolute -bottom-6 -right-4 text-8xl font-display font-black opacity-[0.02] select-none pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                {check.value}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-8 rounded-3xl bg-white/5 border border-white/10 text-center max-w-3xl mx-auto"
        >
          <p className="text-sm text-slate-400 italic">
            “Equity is trust — choose carefully.”
          </p>
        </motion.div>
      </div>
    </section>
  );
}
