import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const dimensions = [
  { label: "Vision Alignment", value: 92, color: "hsl(350, 80%, 60%)" },
  { label: "Work Style Compatibility", value: 87, color: "hsl(42, 90%, 55%)" },
  { label: "Risk Tolerance Match", value: 78, color: "hsl(174, 60%, 40%)" },
  { label: "Communication Cadence", value: 85, color: "hsl(230, 45%, 45%)" },
  { label: "Domain Expertise Overlap", value: 71, color: "hsl(350, 60%, 70%)" },
];

function AnimatedBar({ label, value, color, index }: { label: string; value: number; color: string; index: number }) {
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
    >
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-foreground font-medium">{label}</span>
        <span className="font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1.2, delay: index * 0.15, ease: "easeOut" }}
          className="h-3 rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}aa)` }}
        />
      </div>
    </motion.div>
  );
}

export default function PsycheMapTeaser() {
  return (
    <section className="py-20 bg-secondary text-secondary-foreground grain-overlay relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-accent/10 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-bold tracking-widest uppercase text-primary mb-2 block">PsycheMap™</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Beyond Skills — We Match{" "}
              <span className="font-accent italic text-primary">Founder Psyches</span>
            </h2>
            <p className="text-secondary-foreground/70 leading-relaxed mb-6">
              Our proprietary 5-dimension assessment goes deeper than résumés. We analyze how you think, decide, communicate, and handle risk to find co-founders who truly complement you.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            >
              Take the Free Assessment →
            </motion.button>
          </motion.div>

          <div className="space-y-5">
            {dimensions.map((d, i) => (
              <AnimatedBar key={d.label} label={d.label} value={d.value} color={d.color} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
