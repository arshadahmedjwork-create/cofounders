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
        background: "linear-gradient(180deg, hsl(232, 62%, 10%) 0%, hsl(232, 62%, 6%) 100%)",
        borderTop: "1px solid hsl(232, 39%, 16%)",
      }}
    >
      {/* Decorative Orbs */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top glow line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px"
        style={{
          width: "80%",
          background: "linear-gradient(90deg, transparent, hsl(252, 100%, 68%, 0.4), transparent)",
        }}
      />

      <div className="container mx-auto px-4 pt-20 pb-10 relative z-10">
        {/* Main grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand col */}
          <div className="lg:col-span-2">
            <div className="relative inline-block mb-6 group">
              {/* Logo Glow */}
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src="/cfm_icon_only.png" 
                alt="Cofounder Matrimony" 
                className="h-40 w-auto object-contain relative z-10 drop-shadow-[0_0_30px_rgba(100,100,255,0.4)] transition-transform duration-700 hover:scale-110" 
              />
            </div>
            <p
              className="text-base leading-relaxed max-w-sm mb-8 font-medium"
              style={{ color: "hsl(227, 13%, 75%)" }}
            >
              Finding your perfect business cofounder through intelligent,
              AI-powered matchmaking designed for modern professionals.
            </p>
            <div className="flex gap-3">
              {[Linkedin, Twitter, Instagram, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, y: -4 }}
                  className="p-3 rounded-xl transition-all shadow-lg"
                  style={{
                    background: "hsl(232, 49%, 14%)",
                    border: "1px solid hsl(232, 39%, 22%)",
                    color: "hsl(227, 13%, 70%)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "hsl(252, 100%, 72%)";
                    (e.currentTarget as HTMLElement).style.borderColor = "hsl(252, 100%, 40%)";
                    (e.currentTarget as HTMLElement).style.background = "hsl(232, 49%, 18%)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "hsl(227, 13%, 70%)";
                    (e.currentTarget as HTMLElement).style.borderColor = "hsl(232, 39%, 22%)";
                    (e.currentTarget as HTMLElement).style.background = "hsl(232, 49%, 14%)";
                  }}
                  aria-label="Social link"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4
                className="text-[10px] font-black tracking-[0.2em] uppercase mb-6"
                style={{ color: "hsl(252, 100%, 72%)" }}
              >
                {title}
              </h4>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm transition-all duration-300 font-medium hover:pl-1"
                      style={{ color: "hsl(227, 13%, 60%)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = "hsl(227, 13%, 60%)";
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
          className="rounded-[2.5rem] p-10 mb-12 relative overflow-hidden group"
          style={{
            background: "linear-gradient(145deg, hsl(232, 49%, 12%), hsl(232, 49%, 16%))",
            border: "1px solid hsl(232, 39%, 22%)",
          }}
        >
          {/* Internal Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex flex-col lg:flex-row lg:items-center gap-10 relative z-10">
            <div className="flex-1">
              <h3
                className="text-2xl font-display font-bold mb-3"
                style={{ color: "white" }}
              >
                Stay in the loop
              </h3>
              <p
                className="text-base font-medium max-w-md"
                style={{ color: "hsl(227, 13%, 65%)" }}
              >
                Get the latest on founder stories, platform updates, and curated matching insights.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto lg:min-w-[450px]">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 text-sm rounded-2xl px-6 py-4 outline-none transition-all placeholder:text-slate-600"
                style={{
                  background: "hsl(232, 62%, 8%)",
                  border: "1px solid hsl(232, 39%, 24%)",
                  color: "white",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "hsl(252, 100%, 60%)";
                  e.currentTarget.style.boxShadow = "0 0 20px hsl(252, 100% 60% / 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "hsl(232, 39%, 24%)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 30px hsl(252, 100%, 68%, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary text-white px-10 py-4 rounded-2xl text-sm font-bold shadow-2xl transition-all"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10"
          style={{ borderTop: "1px solid hsl(232, 39%, 16%)" }}
        >
          <p className="text-sm font-medium" style={{ color: "hsl(227, 13%, 50%)" }}>
            © 2026 CoFounder Matrimony. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link
              to="/login"
              className="text-sm font-medium transition-colors hover:text-white"
              style={{ color: "hsl(227, 13%, 50%)" }}
            >
              Secure Login
            </Link>
            <p className="text-sm font-medium flex items-center gap-2" style={{ color: "hsl(227, 13%, 50%)" }}>
              Made with <span className="text-red-500 animate-pulse">♡</span> in India 🇮🇳
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
