import { motion } from "framer-motion";
import { UserPlus, Brain, Sparkles } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: UserPlus,
    title: "Build Your Founder Profile",
    desc: "Takes 10 min. Describe your skills, vision, stage, and what you're looking for in a co-founder.",
  },
  {
    num: "02",
    icon: Brain,
    title: "Take the PsycheMap™ Assessment",
    desc: "Our 20-question founder psyche + working-style quiz surfaces your compatibility blueprint.",
  },
  {
    num: "03",
    icon: Sparkles,
    title: "Meet Your Synapse Matches™",
    desc: "We surface your top co-founder candidates ranked by our 5-dimension match engine.",
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
          <span className="text-xs font-bold tracking-widest uppercase text-primary mb-2 block">The Process</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            From Stranger to <span className="font-accent italic text-primary">Co-Builder</span> in 3 Steps
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -6 }}
              className="glass-card rounded-2xl p-7 relative overflow-hidden group"
            >
              <span className="absolute -top-4 -right-2 text-8xl font-display font-bold text-primary/5 select-none">
                {step.num}
              </span>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <step.icon className="text-primary" size={22} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-10 max-w-2xl mx-auto"
        >
          Then we help you run a <strong className="text-foreground">7-Day Founder Sprint</strong> — a structured co-working trial before you commit.
        </motion.p>
      </div>
    </section>
  );
}
