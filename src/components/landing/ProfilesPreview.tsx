import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { profiles } from "@/data/profiles";
import ProfileCard from "@/components/ProfileCard";

const filters = ["All", "Founders", "Freelancers", "Operators"];

export default function ProfilesPreview() {
  const [active, setActive] = useState("All");

  const filtered = profiles.filter((p) => {
    if (active === "All") return true;
    if (active === "Founders") return p.role.includes("Founder") || p.role.includes("Entrepreneur");
    if (active === "Freelancers") return p.role.includes("Freelance");
    if (active === "Operators") return p.role.includes("Operator");
    return true;
  });

  return (
    <section id="process" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            Meet Your Future <span className="font-accent italic text-primary">Co-Founders</span>
          </h2>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active === f
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {filtered.map((p, i) => (
            <ProfileCard key={p.id} profile={p} index={i} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
          >
            View All 240+ Profiles →
          </Link>
        </div>
      </div>
    </section>
  );
}
