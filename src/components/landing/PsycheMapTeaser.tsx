import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Brain } from "lucide-react";

const ACCENT = "hsl(262, 78%, 72%)";

const dimensions = [
  { label: "Vision Alignment", value: 92, color: ACCENT },
  { label: "Work Style Compatibility", value: 87, color: ACCENT },
  { label: "Risk Tolerance Match", value: 78, color: ACCENT },
  { label: "Communication Cadence", value: 85, color: ACCENT },
  { label: "Domain Expertise Overlap", value: 71, color: ACCENT },
];

function AnimatedBar({
  label,
  value,
  color,
  index,
}: {
  label: string;
  value: number;
  color: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setWidth(value);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group"
    >
      <div className="flex justify-between text-sm mb-2">
        <span className="text-slate-300 font-medium group-hover:text-white transition-colors duration-300">
          {label}
        </span>
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.5 }}
          className="font-bold tabular-nums"
          style={{ color }}
        >
          {value}%
        </motion.span>
      </div>
      <div className="w-full bg-white/[0.06] rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1.4, delay: index * 0.15, ease: "easeOut" }}
          className="h-2 rounded-full relative overflow-hidden"
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
        >
          {/* shimmer */}
          <span
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
              animation: "shimmer-bar 2.5s ease-in-out infinite",
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function PsycheMapTeaser() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(228, 32%, 9%) 0%, hsl(248, 30%, 12%) 50%, hsl(228, 32%, 9%) 100%)" }}>
      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-[80px]" style={{ background: "radial-gradient(circle, hsl(262, 78%, 67%) 0%, transparent 70%)" }} />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-15 blur-[60px]" style={{ background: "radial-gradient(circle, hsl(174, 50%, 52%) 0%, transparent 70%)" }} />
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(hsl(220,20%,80%) 1px, transparent 1px), linear-gradient(90deg, hsl(220,20%,80%) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <style>{`
        @keyframes shimmer-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 border border-primary/30">
                <Brain size={16} className="text-primary" />
              </span>
              <span className="text-xs font-bold tracking-widest uppercase text-primary">
                PsycheMap™
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-5 leading-tight" style={{ color: "hsl(220, 18%, 95%)" }}>
              Beyond Skills —{" "}
              <br />
              <span className="font-accent italic" style={{ color: "hsl(262, 78%, 72%)" }}>
                We Match Founder Psyches
              </span>
            </h2>
            <p className="leading-relaxed mb-8 text-base" style={{ color: "hsl(220, 12%, 64%)" }}>
              Our proprietary 5-dimension assessment goes deeper than résumés.
              We analyze how you think, decide, communicate, and handle risk to
              find co-founders who truly complement you.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 32px hsl(262 78% 67% / 0.35)" }}
                whileTap={{ scale: 0.97 }}
                className="bg-primary text-primary-foreground px-7 py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/25 flex items-center gap-2 w-fit"
              >
                Take the Free Assessment
                <span className="text-base">→</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-3.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 w-fit"
                style={{ border: "1px solid hsl(220, 20%, 30%)", color: "hsl(220, 12%, 64%)" }}
              >
                See Sample Report
              </motion.button>
            </div>

            {/* Mini trust line */}
            <p className="mt-5 text-xs" style={{ color: "hsl(220, 12%, 46%)" }}>
              ✦ &nbsp;Taken by 4,200+ founders across India
            </p>
          </motion.div>

          {/* Right: bars */}
          <motion.div
            className="space-y-6 p-7 rounded-2xl"
            style={{ background: "hsl(228, 28%, 12%)", border: "1px solid hsl(228, 22%, 22%)" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-semibold" style={{ color: "hsl(220, 18%, 88%)" }}>
                Match Score Breakdown
              </p>
              <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ background: "hsl(42, 80%, 58%, 0.15)", color: "hsl(42, 80%, 65%)", border: "1px solid hsl(42, 80%, 40%)" }}>
                LIVE DEMO
              </span>
            </div>
            {dimensions.map((d, i) => (
              <AnimatedBar
                key={d.label}
                label={d.label}
                value={d.value}
                color={d.color}
                index={i}
              />
            ))}
            <div className="pt-4 border-t" style={{ borderColor: "hsl(228, 22%, 22%)" }}>
              <p className="text-center text-xs font-medium" style={{ color: "hsl(262, 60%, 70%)" }}>
                Overall Compatibility Score:{" "}
                <span className="font-bold text-sm" style={{ color: "hsl(262, 78%, 75%)" }}>
                  84%
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
