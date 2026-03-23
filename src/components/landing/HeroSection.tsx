import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getLandingStats, getTrustUsers } from "../../services/landingService";
import type { PlatformStat, TrustUser } from "../../types/landing";

const WORDS = ["Legendary", "Unstoppable", "Inevitable", "Historic"];

export default function HeroSection() {
  const [stats, setStats] = useState<PlatformStat[]>([]);
  const [trustUsers, setTrustUsers] = useState<TrustUser[]>([]);
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    getLandingStats().then(setStats);
    getTrustUsers().then(setTrustUsers);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setWordIdx((i) => (i + 1) % WORDS.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background video — visible at 55% so the scene reads clearly */}
      <video autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ opacity: 0.55 }}>
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Overlay: dark at very top/bottom edges, mostly transparent in the middle so video shows */}
      <div className="absolute inset-0 z-[1]" style={{
        background: [
          "linear-gradient(180deg,",
          "  hsl(222,30%,7%) 0%,",   
          "  hsl(222,30%,7%,0.45) 12%,",
          "  hsl(222,30%,7%,0.18) 30%,",
          "  hsl(222,30%,7%,0.18) 65%,",
          "  hsl(222,30%,7%,0.70) 82%,",
          "  hsl(222,30%,7%) 100%)"
        ].join("")
      }} />

      {/* Radial glow orbs */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] atmo-orb atmo-orb-purple opacity-[0.15] z-[2]" style={{ transform: "translate(-50%,-50%)" }} />
      <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] atmo-orb atmo-orb-teal opacity-[0.08] z-[2]" />



      <div className="container mx-auto px-4 pt-28 pb-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8"
            style={{
              background: "hsl(262, 75%, 68%, 0.1)",
              border: "1px solid hsl(262, 75%, 68%, 0.25)",
              color: "hsl(262, 75%, 78%)",
            }}
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-bold tracking-widest uppercase">
              Introducing SYNAPSE™ Assessment 2.0
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.05] mb-6"
            style={{ color: "hsl(218, 22%, 96%)" }}
          >
            Find Your Co-Founder.
            <br />
            <span className="font-display">Build Something </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIdx}
                initial={{ opacity: 0, y: 20, clipPath: "inset(100% 0% -20% 0%)" }}
                animate={{ opacity: 1, y: 0, clipPath: "inset(-20% 0% -20% 0%)" }}
                exit={{ opacity: 0, y: -20, clipPath: "inset(-20% 0% 100% 0%)" }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="font-accent italic inline-block"
                style={{ color: "hsl(262, 75%, 72%)" }}
              >
                {WORDS[wordIdx]}.
              </motion.span>
            </AnimatePresence>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-base md:text-lg max-w-2xl mx-auto mb-10"
            style={{ color: "hsl(218, 14%, 62%)" }}
          >
            Where visionary founders, brilliant freelancers, and seasoned operators
            connect to build the next great company — powered by AI psychographic matching.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link to="/onboarding">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 36px hsl(262 75% 68% / 0.4)" }}
                whileTap={{ scale: 0.96 }}
                className="group relative h-14 px-9 rounded-full font-bold flex items-center gap-3 overflow-hidden text-sm shadow-xl"
                style={{ background: "hsl(262, 75%, 60%)", color: "#fff" }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                Join the Network
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link to="/browse">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="h-14 px-9 rounded-full font-bold flex items-center gap-3 text-sm transition-all"
                style={{
                  background: "hsl(222, 28%, 12%)",
                  border: "1px solid hsl(222, 22%, 22%)",
                  color: "hsl(218, 18%, 78%)",
                }}
              >
                Browse Profiles
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust avatars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-3"
            style={{ color: "hsl(218, 14%, 52%)" }}
          >
            <div className="flex -space-x-2">
              {trustUsers.map((user, i) => (
                <motion.div
                  key={user.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.06, type: "spring" }}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shadow-sm"
                  style={{
                    backgroundColor: user.bgColor,
                    borderColor: "hsl(222, 30%, 7%)",
                    color: "#fff",
                  }}
                >
                  {user.initials}
                </motion.div>
              ))}
            </div>
            <span className="text-sm">2,400+ founders matched across 18 cities</span>
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px mt-20 max-w-4xl mx-auto rounded-2xl overflow-hidden"
          style={{ background: "hsl(222, 22%, 18%)" }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.08 }}
              whileHover={{ background: "hsl(222, 26%, 13%)" } as any}
              className="text-center py-6 px-4 group cursor-default transition-all"
              style={{ background: "hsl(222, 28%, 10%)" }}
            >
              <p className="text-3xl md:text-4xl font-display font-bold mb-1"
                style={{ color: "hsl(218, 22%, 96%)" }}>
                {stat.value}
              </p>
              <p className="text-xs font-medium group-hover:text-primary transition-colors"
                style={{ color: "hsl(218, 14%, 52%)" }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
