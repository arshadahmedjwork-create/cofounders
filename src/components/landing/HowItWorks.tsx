import { motion } from "framer-motion";
import { UserPlus, Zap, MessageCircle, BarChart3, Scale } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: UserPlus,
    title: "Build Your Founder Profile",
    desc: "Tell us your startup vision, domain expertise, skills, and what you're looking for in a co-founder. Our AI-powered profiling goes deep.",
    badge: "10 min setup",
    color: "hsl(262, 75%, 68%)",
  },
  {
    num: "02",
    icon: Zap,
    title: "AI-Powered Matching",
    desc: "Our algorithm analyses 47 compatibility dimensions — from skill complementarity and working style to risk appetite and life stage alignment.",
    badge: "Instant results",
    color: "hsl(174, 52%, 52%)",
  },
  {
    num: "03",
    icon: MessageCircle,
    title: "Curated Introductions",
    desc: "Browse your matches, send connection requests, and engage in structured video calls with built-in prompts to accelerate meaningful conversations.",
    badge: "Structured calls",
    color: "hsl(42, 85%, 60%)",
  },
  {
    num: "04",
    icon: BarChart3,
    title: "3-Week Trial Sprint",
    desc: "Work together on a real mini-project. Our platform tracks collaboration patterns, communication health, and decision-making compatibility.",
    badge: "Live tracking",
    color: "hsl(262, 75%, 68%)",
  },
  {
    num: "05",
    icon: Scale,
    title: "Legal Onboarding",
    desc: "Once compatible, our partner legal network helps you draft co-founder agreements, equity splits, vesting schedules, and NDAs efficiently.",
    badge: "Legal support",
    color: "hsl(174, 52%, 52%)",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 relative overflow-hidden">
      {/* Atmospheric top orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] atmo-orb atmo-orb-purple opacity-[0.07]" />

      {/* Section rule */}
      <div className="section-rule mb-0 opacity-40" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-18"
        >
          <p className="section-label justify-center mb-3">The Process</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold"
            style={{ color: "hsl(218, 22%, 94%)" }}>
            From Stranger to{" "}
            <span className="font-accent italic" style={{ color: "hsl(262, 75%, 72%)" }}>
              Co-Builder
            </span>{" "}
            in 5 Steps
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-7xl mx-auto mt-14">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, type: "spring", damping: 20 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="rounded-2xl p-6 flex flex-col cursor-default relative overflow-hidden group"
              style={{
                background: "hsl(222, 28%, 10%)",
                border: "1px solid hsl(222, 22%, 16%)",
              }}
            >
              {/* Number watermark */}
              <span className="absolute -top-3 -right-1 text-7xl font-display font-bold pointer-events-none select-none group-hover:opacity-[0.45] transition-opacity duration-300"
                style={{ color: step.color, opacity: 0.25 }}>
                {step.num}
              </span>

              {/* Top bar accent */}
              <div className="absolute top-0 left-6 right-6 h-px rounded-full"
                style={{ background: `linear-gradient(90deg, transparent, ${step.color}44, transparent)` }} />

              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 8, scale: 1.1 }}
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 z-10"
                style={{ background: `${step.color}18`, border: `1px solid ${step.color}30` }}
              >
                <step.icon size={19} style={{ color: step.color }} />
              </motion.div>

              <h3 className="text-sm font-bold mb-2.5 z-10"
                style={{ color: "hsl(218, 22%, 90%)" }}>
                {step.title}
              </h3>
              <p className="text-xs leading-relaxed flex-grow z-10 mb-5"
                style={{ color: "hsl(218, 14%, 52%)" }}>
                {step.desc}
              </p>

              {/* Badge */}
              <span className="inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg z-10 self-start"
                style={{
                  background: `${step.color}12`,
                  border: `1px solid ${step.color}28`,
                  color: step.color,
                }}>
                {step.badge}
              </span>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at 30% 80%, ${step.color}08, transparent 60%)` }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
