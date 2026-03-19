import { Linkedin, Twitter, Instagram, Youtube } from "lucide-react";
import { motion } from "framer-motion";

const links = {
  Product: ["Browse Profiles", "PsycheMap™", "Founder Sprint", "Pricing"],
  Resources: ["Blog", "Guides", "Webinars", "Community"],
  Company: ["About Us", "Careers", "Press", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-16 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-1">
            <span className="font-accent text-xl font-semibold text-foreground">
              Cofounder <span className="text-primary">✦</span> Matrimony
            </span>
            <p className="text-sm text-secondary-foreground/50 mt-3 leading-relaxed">
              Finding your perfect business cofounder through intelligent, AI-powered matchmaking designed for modern professionals.der.
            </p>
            <div className="flex gap-3 mt-4">
              {[Linkedin, Twitter, Instagram, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.15, y: -2 }}
                  className="p-2 rounded-full border border-secondary-foreground/10 hover:border-primary hover:text-primary transition-colors"
                  aria-label="Social link"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-4 text-secondary-foreground/80">{title}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item} className="story-link">
                    <a href="#" className="text-sm text-secondary-foreground/50 hover:text-primary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-secondary-foreground/10 pt-8 mb-8">
          <div className="max-w-md">
            <h4 className="text-sm font-semibold mb-2">Stay in the loop</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg px-4 py-2.5 text-sm text-secondary-foreground placeholder:text-secondary-foreground/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary-foreground/40">
          <p>© 2026 CoFounder Matrimony. All rights reserved.</p>
          <p>Made with ♡ in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
