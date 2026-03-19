import { motion } from "framer-motion";
import { UserPlus, Zap, MessageCircle, BarChart3, Scale } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: UserPlus,
    title: "Build Your Founder Profile",
    desc: "Tell us your startup vision, domain expertise, skills, and what you're looking for in a co-founder. Our AI-powered profiling goes deep.",
    badge: "10 MIN SETUP",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    num: "02",
    icon: Zap,
    title: "AI-Powered Matching",
    desc: "Our algorithm analyses 47 compatibility dimensions — from skill complementarity and working style to risk appetite and life stage alignment.",
    badge: "INSTANT RESULTS",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    num: "03",
    icon: MessageCircle,
    title: "Curated Introductions",
    desc: "Browse your matches, send connection requests, and engage in structured video calls with built-in prompts to accelerate meaningful conversations.",
    badge: "STRUCTURED CALLS",
    gradient: "from-secondary/20 to-secondary/5",
  },
  {
    num: "04",
    icon: BarChart3,
    title: "3-Week Trial Sprint",
    desc: "Work together on a real mini-project. Our platform tracks collaboration patterns, communication health, and decision-making compatibility weekly.",
    badge: "LIVE TRACKING",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    num: "05",
    icon: Scale,
    title: "Legal Onboarding",
    desc: "Once compatible, our partner legal network helps you draft co-founder agreements, equity splits, vesting schedules, and NDAs efficiently.",
    badge: "LEGAL SUPPORT",
    gradient: "from-accent/20 to-accent/5",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-widest uppercase text-primary mb-2 block"
          >
            The Process
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            From Stranger to <span className="font-accent italic text-primary">Co-Builder</span> in 5 Steps
          </h2>
        </motion.div>

        {/* All 5 cards in one row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-7xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5, type: "spring" }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card rounded-2xl p-5 relative overflow-hidden group flex flex-col"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <span className="absolute -top-4 -right-2 text-6xl font-display font-bold text-primary/5 select-none group-hover:text-primary/10 transition-colors duration-500">
                {step.num}
              </span>
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 relative z-10"
              >
                <step.icon className="text-primary" size={18} />
              </motion.div>
              <h3 className="text-sm font-semibold text-foreground mb-2 relative z-10">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed relative z-10 mb-4 flex-grow">{step.desc}</p>
              <span className="inline-block text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-md border border-border text-muted-foreground relative z-10 self-start mt-auto">
                {step.badge}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
