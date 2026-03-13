import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const tiers = [
  {
    name: "Explorer",
    monthlyPrice: 0,
    yearlyPrice: 0,
    desc: "Get started and explore the platform",
    features: [
      { text: "Create founder profile", included: true },
      { text: "Browse 10 profiles/week", included: true },
      { text: "PsycheMap™ assessment", included: true },
      { text: "Send connection requests", included: false },
      { text: "Synapse Match™ scores", included: false },
      { text: "7-Day Founder Sprint", included: false },
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Builder",
    monthlyPrice: 999,
    yearlyPrice: 799,
    desc: "For founders ready to find their match",
    features: [
      { text: "Create founder profile", included: true },
      { text: "Unlimited profile browsing", included: true },
      { text: "PsycheMap™ assessment", included: true },
      { text: "15 connections/month", included: true },
      { text: "Synapse Match™ scores", included: true },
      { text: "7-Day Founder Sprint", included: false },
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Founder Pro",
    monthlyPrice: 2499,
    yearlyPrice: 1999,
    desc: "Premium matching with sprint access",
    features: [
      { text: "Create founder profile", included: true },
      { text: "Unlimited profile browsing", included: true },
      { text: "PsycheMap™ assessment", included: true },
      { text: "Unlimited connections", included: true },
      { text: "Synapse Match™ scores", included: true },
      { text: "7-Day Founder Sprint", included: true },
    ],
    cta: "Go Pro",
    popular: false,
  },
];

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-primary mb-2 block">Pricing</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">
            Simple, <span className="font-accent italic text-primary">Transparent</span> Pricing
          </h2>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-muted rounded-full p-1">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!yearly ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${yearly ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              Yearly <span className="text-primary text-xs font-bold">-20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card rounded-2xl p-7 relative ${
                tier.popular ? "ring-2 ring-primary shadow-xl scale-[1.02]" : ""
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-display font-bold text-foreground mb-1">{tier.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">{tier.desc}</p>
              <div className="mb-6">
                <motion.span
                  key={yearly ? "y" : "m"}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-display font-bold text-foreground"
                >
                  ₹{yearly ? tier.yearlyPrice : tier.monthlyPrice}
                </motion.span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-3 mb-6">
                {tier.features.map((f) => (
                  <li key={f.text} className="flex items-center gap-2 text-sm">
                    {f.included ? (
                      <Check size={14} className="text-primary shrink-0" />
                    ) : (
                      <X size={14} className="text-muted-foreground/40 shrink-0" />
                    )}
                    <span className={f.included ? "text-foreground" : "text-muted-foreground/50"}>{f.text}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-xl text-sm font-bold transition-opacity ${
                  tier.popular
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-foreground/20 text-foreground hover:bg-muted"
                }`}
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
