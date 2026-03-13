import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/data/profiles";

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(() => {
        setDirection(1);
        setCurrent((c) => (c + 1) % testimonials.length);
      }, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [paused]);

  const prev = () => { setDirection(-1); setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length); };
  const next = () => { setDirection(1); setCurrent((c) => (c + 1) % testimonials.length); };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0, scale: 0.9 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0, scale: 0.9 }),
  };

  return (
    <section id="testimonials" className="py-20 bg-background overflow-hidden">
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
          <div className="overflow-hidden min-h-[280px] flex items-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="glass-card rounded-2xl p-8 text-center w-full"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center text-lg font-bold text-primary-foreground shadow-lg"
                  style={{ backgroundColor: testimonials[current].avatarColor }}
                >
                  {testimonials[current].name.split(" ")[0][0]}
                </motion.div>
                <div className="flex justify-center gap-0.5 mb-4">
                  {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      <Star size={16} className="fill-accent text-accent" />
                    </motion.div>
                  ))}
                </div>
                <blockquote className="text-foreground text-lg font-accent italic leading-relaxed mb-4">
                  "{testimonials[current].quote}"
                </blockquote>
                <p className="text-sm font-semibold text-foreground">{testimonials[current].name}</p>
                <p className="text-xs text-muted-foreground">{testimonials[current].company} · {testimonials[current].raised}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-12 p-2.5 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/5 transition-all shadow-md"
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-12 p-2.5 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/5 transition-all shadow-md"
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </motion.button>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                animate={{ width: i === current ? 24 : 8 }}
                className={`h-2 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-muted-foreground/30"}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
