import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const previewCards = [
  { name: "Ananya K.", role: "Startup Founder", tags: ["Product", "Vision", "AI"], match: 94, color: "#C62828", rotate: -6, delay: 0 },
  { name: "Vikram S.", role: "Freelance Eng.", tags: ["Backend", "APIs", "FinTech"], match: 91, color: "#2E7D32", rotate: 0, delay: 0.15 },
  { name: "Deepa N.", role: "Serial Founder", tags: ["Sales", "GTM", "Health"], match: 88, color: "#F57F17", rotate: 6, delay: 0.3 },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-mesh">
      {/* Spinning rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="spin-slow w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full border border-primary/10 absolute" />
        <div className="spin-reverse w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full border border-accent/15 absolute" />
        <div className="spin-slow w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full border border-secondary/10 absolute" />
        {/* Floating dots */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold text-primary">India's #1 Co-Founder Matching Platform</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight mb-6"
          >
            Find Your Co-Founder.{" "}
            <br />
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Build Something{" "}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 150 }}
              className="font-accent italic text-primary"
            >
              Legendary.
            </motion.span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Where visionary founders, brilliant freelancers, and seasoned operators connect to build the next great company.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/browse"
                className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/25 inline-block animate-pulse-glow"
              >
                Find My Co-Founder →
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/browse"
                className="border border-foreground/20 text-foreground px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-muted transition-all inline-block"
              >
                Browse Profiles
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-3 text-sm text-muted-foreground"
          >
            <div className="flex -space-x-2">
              {["#C62828", "#2E7D32", "#F57F17", "#4527A0", "#00838F", "#558B2F"].map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.06, type: "spring" }}
                  className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary-foreground shadow-sm"
                  style={{ backgroundColor: c }}
                >
                  {["AK", "VS", "DN", "KR", "MP", "SB"][i]}
                </motion.div>
              ))}
            </div>
            <span>2,400+ founders matched across 18 cities</span>
          </motion.div>
        </div>

        {/* Floating preview cards */}
        <div className="hidden md:flex justify-center items-end gap-4 mt-12 relative">
          {previewCards.map((card, i) => (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 60, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: card.rotate }}
              transition={{ delay: 0.8 + card.delay, duration: 0.6, type: "spring" }}
              whileHover={{ y: -12, rotate: 0, scale: 1.05, zIndex: 10 }}
              className="glass-card rounded-2xl p-4 w-56 shadow-xl cursor-pointer"
              style={{ zIndex: i === 1 ? 3 : 1 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground shadow-md"
                  style={{ backgroundColor: card.color }}
                >
                  {card.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{card.name}</p>
                  <p className="text-[10px] text-muted-foreground">{card.role}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {card.tags.map(t => (
                  <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>
                ))}
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${card.match}%` }}
                  transition={{ delay: 1.2 + card.delay, duration: 1, ease: "easeOut" }}
                  className="bg-primary h-1.5 rounded-full"
                />
              </div>
              <p className="text-[10px] text-primary font-semibold mt-1">{card.match}% match</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
