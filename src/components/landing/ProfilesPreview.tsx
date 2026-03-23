import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import { Profile, DEMO_PROFILES } from "@/data/profiles";

const filters = ["All", "Founders", "Freelancers", "Operators"];

export default function ProfilesPreview() {
  const [active, setActive] = useState("All");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProfiles(DEMO_PROFILES);
    setLoading(false);
  }, []);

  const filtered = profiles.filter((p) => {
    if (active === "All") return true;
    if (active === "Founders") return p.role.includes("Founder") || p.role.includes("Entrepreneur");
    if (active === "Freelancers") return p.role.includes("Freelance");
    if (active === "Operators") return p.role.includes("Operator");
    return true;
  });

  return (
    <section id="process" className="py-28 relative overflow-hidden">
      {/* Orb */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] atmo-orb atmo-orb-teal opacity-[0.06]" />

      <div className="section-rule opacity-30" />

      <div className="container mx-auto px-4 relative z-10 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="section-label justify-center mb-3">The Community</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4"
            style={{ color: "hsl(218, 22%, 94%)" }}>
            Meet Your Future{" "}
            <span className="font-accent italic" style={{ color: "hsl(262, 75%, 72%)" }}>
              Co-Founders
            </span>
          </h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "hsl(218, 14%, 54%)" }}>
            Real people. Real ambitions. Browse verified founder profiles and find your perfect match.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "hsl(222, 28%, 10%)", border: "1px solid hsl(222, 22%, 16%)" }}>
            {filters.map((f) => (
              <motion.button
                key={f}
                onClick={() => setActive(f)}
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-all relative"
                style={active === f ? {
                  background: "hsl(262, 75%, 60%)",
                  color: "#fff",
                  boxShadow: "0 0 16px hsl(262 75% 60% / 0.3)",
                } : {
                  color: "hsl(218, 14%, 52%)",
                  background: "transparent",
                }}
                whileHover={active !== f ? { color: "hsl(218, 18%, 78%)" } as any : {}}
              >
                {f}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto"
            >
              {filtered.slice(0, 6).map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <ProfileCard profile={p} index={i} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        <div className="text-center mt-12">
          <Link to="/browse">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 28px hsl(262 75% 68% / 0.35)" }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-bold shadow-lg transition-all"
              style={{ background: "hsl(262, 75%, 60%)", color: "#fff" }}
            >
              View All Profiles
              <ChevronRight size={16} />
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}
