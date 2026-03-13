import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const dimensions = [
  { label: "Vision Alignment", value: 92 },
  { label: "Work Style Compatibility", value: 87 },
  { label: "Risk Tolerance Match", value: 78 },
  { label: "Communication Cadence", value: 85 },
  { label: "Domain Expertise Overlap", value: 71 },
];

function AnimatedBar({ label, value }: { label: string; value: number }) {
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
    <div ref={ref}>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-foreground">{label}</span>
        <span className="text-primary font-semibold">{value}%</span>
      </div>
      <div className="w-full bg-muted/30 rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function PsycheMapTeaser() {
  return (
    <section className="py-20 bg-foreground text-background grain-overlay relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-bold tracking-widest uppercase text-primary mb-2 block">PsycheMap™</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Beyond Skills — We Match{" "}
              <span className="font-accent italic text-primary">Founder Psyches</span>
            </h2>
            <p className="text-background/70 leading-relaxed mb-6">
              Our proprietary 5-dimension assessment goes deeper than résumés. We analyze how you think, decide, communicate, and handle risk to find co-founders who truly complement you.
            </p>
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
              Take the Free Assessment →
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {dimensions.map((d) => (
              <AnimatedBar key={d.label} label={d.label} value={d.value} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
