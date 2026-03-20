import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const stats = [
  { value: 2400, suffix: "+", label: "Founders Matched", prefix: "" },
  { value: 180, prefix: "₹", suffix: "Cr+", label: "Raised by Teams" },
  { value: 94, suffix: "%", label: "Report Culture Fit", prefix: "" },
  { value: 18, suffix: "+", label: "Indian Cities", prefix: "" },
];

function AnimatedCounter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1600;
          const steps = 50;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(current));
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref}
      className="text-4xl md:text-5xl font-display font-bold"
      style={{ color: "hsl(218, 22%, 96%)" }}>
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-6 relative overflow-hidden">
      {/* Thin rule top */}
      <div className="section-rule opacity-30" />

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0"
          style={{ borderColor: "hsl(222, 22%, 16%)" }}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.04 }}
              className="text-center py-8 px-4 cursor-default group"
            >
              <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              <p className="text-xs font-semibold tracking-wide uppercase mt-2 group-hover:text-primary transition-colors duration-300"
                style={{ color: "hsl(218, 14%, 48%)" }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Thin rule bottom */}
      <div className="section-rule opacity-30" />
    </section>
  );
}
