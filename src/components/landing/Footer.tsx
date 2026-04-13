import { Linkedin, Twitter, Instagram, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const links = {
  Product: ["Browse Profiles", "PsycheMap™", "Pricing"],
  Resources: ["Blog", "Guides", "Webinars", "Community"],
  Company: ["About Us", "Careers", "Press", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, hsl(228, 28%, 7%) 0%, hsl(228, 32%, 5%) 100%)",
        borderTop: "1px solid hsl(228, 22%, 16%)",
      }}
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px"
        style={{
          width: "60%",
          background:
            "linear-gradient(90deg, transparent, hsl(262, 78%, 67%, 0.5), transparent)",
        }}
      />

      <div className="container mx-auto px-4 pt-16 pb-8">
        {/* Main grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-10 mb-14">
          {/* Brand col */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <img src="/logo.png" alt="Cofounder Matrimony" className="h-40 w-auto object-contain" />
            </div>
            <p
              className="text-sm leading-relaxed max-w-xs mb-6"
              style={{ color: "hsl(220, 12%, 52%)" }}
            >
              Finding your perfect business cofounder through intelligent,
              AI-powered matchmaking designed for modern professionals.
            </p>
            <div className="flex gap-2">
              {[Linkedin, Twitter, Instagram, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.18, y: -3 }}
                  className="p-2.5 rounded-xl transition-all"
                  style={{
                    background: "hsl(228, 28%, 12%)",
                    border: "1px solid hsl(228, 22%, 20%)",
                    color: "hsl(220, 12%, 52%)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "hsl(262, 78%, 72%)";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "hsl(262, 78%, 40%)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "hsl(220, 12%, 52%)";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "hsl(228, 22%, 20%)";
                  }}
                  aria-label="Social link"
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4
                className="text-xs font-bold tracking-widest uppercase mb-5"
                style={{ color: "hsl(220, 18%, 70%)" }}
              >
                {title}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm transition-colors duration-200"
                      style={{ color: "hsl(220, 12%, 45%)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          "hsl(262, 78%, 72%)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          "hsl(220, 12%, 45%)";
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div
          className="rounded-2xl p-7 mb-10"
          style={{
            background: "hsl(228, 28%, 11%)",
            border: "1px solid hsl(228, 22%, 18%)",
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h3
                className="text-base font-semibold mb-1"
                style={{ color: "hsl(220, 18%, 90%)" }}
              >
                Stay in the loop
              </h3>
              <p
                className="text-sm"
                style={{ color: "hsl(220, 12%, 50%)" }}
              >
                Get the latest on founder stories, platform updates, and curated matching insights.
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto md:min-w-[380px]">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all"
                style={{
                  background: "hsl(228, 28%, 8%)",
                  border: "1px solid hsl(228, 22%, 22%)",
                  color: "hsl(220, 18%, 88%)",
                  // @ts-ignore
                  "--tw-ring-color": "hsl(262, 78%, 40%)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "hsl(262, 78%, 50%)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "hsl(228, 22%, 22%)";
                }}
              />
              <motion.button
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 0 20px hsl(262, 78%, 50%, 0.3)",
                }}
                whileTap={{ scale: 0.97 }}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap shadow-lg shadow-primary/20 transition-all"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: "1px solid hsl(228, 22%, 14%)" }}
        >
          <p className="text-xs" style={{ color: "hsl(220, 12%, 36%)" }}>
            © 2026 CoFounder Matrimony. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-xs transition-colors"
              style={{ color: "hsl(220, 12%, 36%)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "hsl(262, 78%, 67%)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "hsl(220, 12%, 36%)";
              }}
            >
              Login
            </Link>
            <p className="text-xs" style={{ color: "hsl(220, 12%, 36%)" }}>
              Made with ♡ in India 🇮🇳
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
