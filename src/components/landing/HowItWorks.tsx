import { motion } from "framer-motion";
import { UserPlus, Brain, Sparkles } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: UserPlus,
    title: "Build Your Founder Profile",
    desc: "Takes 10 min. Describe your skills, vision, stage, and what you're looking for in a co-founder.",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    num: "02",
    icon: Brain,
    title: "Take the PsycheMap™ Assessment",
    desc: "Our 20-question founder psyche + working-style quiz surfaces your compatibility blueprint.",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    num: "03",
    icon: Sparkles,
    title: "Meet Your Synapse Matches™",
    desc: "We surface your top co-founder candidates ranked by our 5-dimension match engine.",
    gradient: "from-secondary/20 to-secondary/5",
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
            From Stranger to <span className="font-accent italic text-primary">Co-Builder</span> in 3 Steps
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.5, type: "spring" }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card rounded-2xl p-7 relative overflow-hidden group"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <span className="absolute -top-4 -right-2 text-8xl font-display font-bold text-primary/5 select-none group-hover:text-primary/10 transition-colors duration-500">
                {step.num}
              </span>
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 relative z-10"
              >
                <step.icon className="text-primary" size={22} />
              </motion.div>
              <h3 className="text-lg font-semibold text-foreground mb-2 relative z-10">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed relative z-10">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-muted-foreground mt-10 max-w-2xl mx-auto"
        >
          Then we help you run a <strong className="text-foreground">7-Day Founder Sprint</strong> — a structured co-working trial before you commit.
        </motion.p>
      </div>
    </section>
  );
}
