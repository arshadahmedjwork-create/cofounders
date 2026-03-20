import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Zap } from "lucide-react";

const tiers = [
  {
    name: "Explorer",
    monthlyPrice: 0,
    yearlyPrice: 0,
    desc: "Get started and explore the platform at no cost",
    features: [
      { text: "Create founder profile", included: true },
      { text: "Browse 10 profiles/week", included: true },
      { text: "PsycheMap™ assessment", included: true },
      { text: "Send connection requests", included: false },
      { text: "Synapse Match™ scores", included: false },
      { text: "7-Day Founder Sprint", included: false },
    ],
    cta: "Start for Free",
    popular: false,
    accent: "hsl(174, 52%, 52%)",
  },
  {
    name: "Builder",
    monthlyPrice: 999,
    yearlyPrice: 799,
    desc: "Everything you need to find your ideal co-founder",
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
    accent: "hsl(262, 75%, 68%)",
  },
  {
    name: "Founder Pro",
    monthlyPrice: 2499,
    yearlyPrice: 1999,
    desc: "Premium matching with full sprint & legal access",
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
    accent: "hsl(42, 85%, 60%)",
  },
];

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-28 relative overflow-hidden">
      {/* Orbs */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] atmo-orb atmo-orb-purple opacity-[0.07]" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[250px] atmo-orb atmo-orb-gold opacity-[0.05]" />

      <div className="section-rule opacity-30" />

      <div className="container mx-auto px-4 relative z-10 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="section-label justify-center mb-3">Pricing</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8"
            style={{ color: "hsl(218, 22%, 94%)" }}>
            Simple,{" "}
            <span className="font-accent italic" style={{ color: "hsl(262, 75%, 72%)" }}>
              Transparent
            </span>{" "}
            Pricing
          </h2>

          {/* Toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl relative z-20"
            style={{ background: "hsl(222, 28%, 10%)", border: "1px solid hsl(222, 22%, 18%)" }}>
            {["Monthly", "Yearly"].map((label) => {
              const isYearly = label === "Yearly";
              const active = isYearly ? yearly : !yearly;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setYearly(isYearly)}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer select-none"
                  style={active ? {
                    background: "hsl(262, 75%, 60%)",
                    color: "#fff",
                    boxShadow: "0 0 16px hsl(262 75% 60% / 0.3)",
                  } : {
                    color: "hsl(218, 14%, 52%)",
                  }}
                >
                  {label}
                  {isYearly && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                      style={{ background: "hsl(42, 85%, 60%, 0.2)", color: "hsl(42, 85%, 66%)" }}>
                      -20%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto items-stretch">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, type: "spring", damping: 20 }}
              whileHover={{ y: -8 }}
              className="rounded-2xl p-7 flex flex-col relative overflow-hidden cursor-default"
              style={tier.popular ? {
                background: "hsl(222, 28%, 11%)",
                border: `1px solid ${tier.accent}44`,
                boxShadow: `0 0 0 1px ${tier.accent}22, 0 24px 60px ${tier.accent}0A`,
              } : {
                background: "hsl(222, 28%, 10%)",
                border: "1px solid hsl(222, 22%, 17%)",
              }}
            >
              {/* Glow top for popular */}
              {tier.popular && (
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${tier.accent}80, transparent)` }} />
              )}

              {/* Popular badge */}
              {tier.popular && (
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: tier.accent, color: "hsl(222, 30%, 7%)" }}
                >
                  <Zap size={11} />
                  Most Popular
                </motion.div>
              )}

              {/* Accent top corner */}
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-5"
                style={{ background: `${tier.accent}18`, border: `1px solid ${tier.accent}30` }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: tier.accent }} />
              </div>

              <h3 className="text-xl font-display font-bold mb-1" style={{ color: "hsl(218, 22%, 94%)" }}>
                {tier.name}
              </h3>
              <p className="text-xs mb-6" style={{ color: "hsl(218, 14%, 50%)" }}>{tier.desc}</p>

              {/* Price */}
              <div className="mb-7">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={yearly ? "y" : "m"}
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.25 }}
                    className="text-5xl font-display font-bold inline-block"
                    style={{ color: "hsl(218, 22%, 96%)" }}
                  >
                    {tier.monthlyPrice === 0 ? "Free" : `₹${yearly ? tier.yearlyPrice : tier.monthlyPrice}`}
                  </motion.span>
                </AnimatePresence>
                {tier.monthlyPrice > 0 && (
                  <span className="text-sm ml-1" style={{ color: "hsl(218, 14%, 46%)" }}>/month</span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-grow">
                {tier.features.map((f) => (
                  <li key={f.text} className="flex items-center gap-3 text-sm">
                    {f.included ? (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `${tier.accent}20` }}>
                        <Check size={12} style={{ color: tier.accent }} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "hsl(222, 22%, 14%)" }}>
                        <X size={12} style={{ color: "hsl(218, 14%, 36%)" }} />
                      </div>
                    )}
                    <span style={{ color: f.included ? "hsl(218, 18%, 82%)" : "hsl(218, 14%, 40%)" }}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: tier.popular ? `0 0 24px ${tier.accent}40` : "none" }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-xl text-sm font-bold transition-all"
                style={tier.popular ? {
                  background: tier.accent,
                  color: "hsl(222, 30%, 7%)",
                  boxShadow: `0 0 16px ${tier.accent}30`,
                } : {
                  background: "hsl(222, 28%, 14%)",
                  border: "1px solid hsl(222, 22%, 22%)",
                  color: "hsl(218, 18%, 72%)",
                }}
              >
                {tier.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs mt-8" style={{ color: "hsl(218, 14%, 42%)" }}>
          All plans include GDPR-compliant data handling. Cancel anytime. No hidden fees.
        </p>
      </div>
    </section>
  );
}
