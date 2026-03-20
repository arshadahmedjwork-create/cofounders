import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { Testimonial } from "@/data/profiles";

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Arjun Mehta",
    company: "Finova · Series A",
    quote: "Found my technical co-founder within 3 weeks. The PsycheMap™ assessment was eerily accurate — we've barely had a single major disagreement in 18 months.",
    raised: "₹4.2Cr",
    rating: 5,
    avatarColor: "hsl(262, 75%, 55%)",
  },
  {
    id: "2",
    name: "Priya Sundaram",
    company: "GreenLoop · Seed",
    quote: "As a solo founder, I was skeptical. But the matching algorithm matched my risk profile and vision perfectly. We launched in 6 months and already have 200+ B2B clients.",
    raised: "₹1.8Cr",
    rating: 5,
    avatarColor: "hsl(174, 52%, 42%)",
  },
  {
    id: "3",
    name: "Karan Bhatia",
    company: "EduStack · Pre-Seed",
    quote: "The 3-week sprint before committing was game-changing. We worked on a real problem together and knew we were aligned before signing anything. Can't imagine building without this.",
    raised: undefined,
    rating: 5,
    avatarColor: "hsl(42, 85%, 50%)",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTestimonials(FALLBACK_TESTIMONIALS);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!paused && testimonials.length > 0) {
      intervalRef.current = setInterval(() => {
        setDirection(1);
        setCurrent((c) => (c + 1) % testimonials.length);
      }, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [paused, testimonials.length]);

  const prev = () => { setDirection(-1); setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length); };
  const next = () => { setDirection(1); setCurrent((c) => (c + 1) % testimonials.length); };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <section id="testimonials" className="py-28 relative overflow-hidden">
      {/* Orb */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] atmo-orb atmo-orb-purple opacity-[0.07]" style={{ transform: "translateY(-50%)" }} />

      <div className="section-rule opacity-30" />

      <div className="container mx-auto px-4 relative z-10 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="section-label justify-center mb-3">Success Stories</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold"
            style={{ color: "hsl(218, 22%, 94%)" }}>
            Built Together,{" "}
            <span className="font-accent italic" style={{ color: "hsl(262, 75%, 72%)" }}>
              Thriving Together
            </span>
          </h2>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[320px]">
            <div className="w-9 h-9 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="flex justify-center items-center min-h-[320px]"
            style={{ color: "hsl(218, 14%, 48%)" }}>
            No testimonials yet.
          </div>
        ) : (
          <div
            className="relative max-w-3xl mx-auto"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Nav buttons */}
            {[{ fn: prev, Icon: ChevronLeft, side: "left" }, { fn: next, Icon: ChevronRight, side: "right" }].map(({ fn, Icon, side }) => (
              <motion.button
                key={side}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={fn}
                className="absolute top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full transition-all"
                style={{
                  [side]: 0,
                  transform: `translateY(-50%) translateX(${side === "left" ? "-120%" : "120%"})`,
                  background: "hsl(222, 28%, 12%)",
                  border: "1px solid hsl(222, 22%, 20%)",
                  color: "hsl(218, 14%, 62%)",
                }}
              >
                <Icon size={18} />
              </motion.button>
            ))}

            {/* Card */}
            <div className="overflow-hidden min-h-[340px] flex items-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="w-full rounded-2xl p-10 text-center relative"
                  style={{
                    background: "hsl(222, 28%, 10%)",
                    border: "1px solid hsl(222, 22%, 18%)",
                  }}
                >
                  {/* Quote icon */}
                  <div className="absolute top-8 left-10 opacity-60">
                    <Quote size={40} style={{ color: "hsl(262, 75%, 72%)" }} />
                  </div>

                  {/* Avatar */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center text-lg font-bold shadow-xl"
                    style={{ backgroundColor: testimonials[current].avatarColor, color: "#fff" }}
                  >
                    {testimonials[current].name.split(" ")[0][0]}
                  </motion.div>

                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-6">
                    {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.05 }}>
                        <Star size={15} className="fill-amber-400 text-amber-400" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg md:text-xl font-accent italic leading-relaxed mb-6"
                    style={{ color: "hsl(218, 18%, 82%)" }}>
                    "{testimonials[current].quote}"
                  </blockquote>

                  <p className="font-semibold text-sm" style={{ color: "hsl(218, 22%, 90%)" }}>
                    {testimonials[current].name}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "hsl(218, 14%, 50%)" }}>
                    {testimonials[current].company}
                    {testimonials[current].raised && (
                      <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: "hsl(42, 85%, 60%, 0.15)", color: "hsl(42, 85%, 68%)", border: "1px solid hsl(42, 85%, 40%, 0.4)" }}>
                        {testimonials[current].raised} raised
                      </span>
                    )}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  animate={{ width: i === current ? 24 : 8, opacity: i === current ? 1 : 0.35 }}
                  className="h-2 rounded-full transition-colors"
                  style={{ background: "hsl(262, 75%, 68%)" }}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
