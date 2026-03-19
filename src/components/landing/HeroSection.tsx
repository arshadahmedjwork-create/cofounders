import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import CreateProfileModal from "../CreateProfileModal";


export default function HeroSection() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-background/30 z-[1]" />

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
            className="text-base md:text-lg text-white max-w-2xl mx-auto mb-8 font-medium drop-shadow-md"
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
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/25 inline-block animate-pulse-glow"
              >
                Create Profile →
              </button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/browse"
                className="border border-foreground/20 text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-muted/20 transition-all inline-block"
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

        {/* Achievement Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto border-t border-border pt-10"
        >
          {[
            { value: "2,400+", label: "Founders Matched" },
            { value: "₹180Cr+", label: "Raised by Matched Teams" },
            { value: "94%", label: "Report Culture Fit" },
            { value: "18", label: "Indian Cities" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-display font-bold text-foreground dark:text-white dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{stat.value}</p>
              <p className="text-sm text-muted-foreground dark:text-black font-bold mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <CreateProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </section>
  );
}
