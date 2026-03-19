import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Browse Profiles", href: "/browse" },
  { label: "Our Process", href: "/#process" },
  { label: "Success Stories", href: "/#testimonials" },
  { label: "Pricing", href: "/#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
            ? "py-2 glass-card shadow-lg"
            : "py-4 bg-transparent"
          }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.span
              className="w-3 h-3 rounded-full bg-primary inline-block"
              whileHover={{ scale: 1.4, rotate: 90 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <span className="font-accent text-xl font-semibold text-foreground">
              Cofounder <span className="text-primary">✦</span> Matrimony
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className={`text-sm font-medium relative group py-1 ${location.pathname === link.href
                    ? "text-primary"
                    : "text-black dark:text-foreground hover:text-white"
                  }`}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
              </motion.a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <motion.button
              onClick={toggleTheme}
              whileTap={{ rotate: 180, scale: 0.9 }}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/login"
                className="bg-secondary text-secondary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-secondary/20 inline-block"
              >
                Login
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/assessment"
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-primary/20 inline-block"
              >
                Take SYNAPSE™ Test
              </Link>
            </motion.div>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <motion.button
              onClick={toggleTheme}
              whileTap={{ rotate: 180, scale: 0.9 }}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at top right)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at top right)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at top right)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl flex flex-col items-center justify-center gap-6 lg:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08, type: "spring" }}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-display font-semibold text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col gap-3 mt-4"
            >
              <Link to="/login" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-foreground">Login</Link>
              <Link
                to="/assessment"
                onClick={() => setMobileOpen(false)}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg text-lg font-semibold"
              >
                Take SYNAPSE™ Test
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
