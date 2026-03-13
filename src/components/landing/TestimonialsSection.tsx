import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/data/profiles";

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(() => {
        setCurrent((c) => (c + 1) % testimonials.length);
      }, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [paused]);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-primary mb-2 block">Success Stories</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            Built Together, <span className="font-accent italic text-primary">Thriving Together</span>
          </h2>
        </motion.div>

        <div
          className="relative max-w-3xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="overflow-hidden">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <div
                className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center text-lg font-bold text-primary-foreground"
                style={{ backgroundColor: testimonials[current].avatarColor }}
              >
                {testimonials[current].name.split(" ")[0][0]}
              </div>
              <div className="flex justify-center gap-0.5 mb-4">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="text-foreground text-lg font-accent italic leading-relaxed mb-4">
                "{testimonials[current].quote}"
              </blockquote>
              <p className="text-sm font-semibold text-foreground">{testimonials[current].name}</p>
              <p className="text-xs text-muted-foreground">{testimonials[current].company} · {testimonials[current].raised}</p>
            </motion.div>
          </div>

          {/* Navigation */}
          <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-2 rounded-full bg-card border border-border hover:border-primary transition-colors" aria-label="Previous">
            <ChevronLeft size={18} />
          </button>
          <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-2 rounded-full bg-card border border-border hover:border-primary transition-colors" aria-label="Next">
            <ChevronRight size={18} />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-primary w-6" : "bg-muted-foreground/30"}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
