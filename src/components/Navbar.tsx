import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const navLinks = [
  { label: "Find your ideal co-founder", href: "/browse" },
  { label: "Pricing", href: "/#pricing" },
];

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      setPendingCount(0);
      return;
    }

    const fetchPending = async () => {
      const { count } = await supabase
        .from("connection_requests")
        .select("*", { count: 'exact', head: true })
        .eq("receiver_id", user.id)
        .eq("status", "pending");
      
      setPendingCount(count || 0);
    };

    fetchPending();

    // Subscribe to real-time updates for NEW connections
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'connection_requests',
          filter: `receiver_id=eq.${user.id}`
        },
        () => fetchPending()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Always enforce dark mode — light mode is removed.
  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={scrolled ? {
          background: "hsl(232, 62%, 12%, 0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid hsl(232, 39%, 20%)",
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
        } : {
          background: "transparent",
          paddingTop: "1.25rem",
          paddingBottom: "1.25rem",
        }}
      >
        <div className="container mx-auto flex items-center justify-between px-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group"
            onClick={() => {
              if (location.pathname === "/") {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <img
              src="/cfm_icon_only.png"
              alt="Cofounder Matrimony Icon"
              className="h-14 lg:h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
            />
            <span className="font-accent text-2xl font-bold tracking-tight" style={{ color: "hsl(231, 29%, 93%)" }}>
              Cofounder Matrimony
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link, i) => {
              const isAnchor = link.href.startsWith("/#");
              const active = location.pathname + location.hash === link.href ||
                (isAnchor && location.pathname === "/" && location.hash === link.href.slice(1));
              
              if (isAnchor) {
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-sm font-medium relative group py-1"
                    style={{ color: active ? "hsl(252, 100%, 72%)" : "hsl(227, 13%, 65%)" }}
                    onClick={(e) => {
                      if (location.pathname === "/") {
                        e.preventDefault();
                        const id = link.href.split("#")[1];
                        const el = document.getElementById(id);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <motion.span
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      {link.label}
                    </motion.span>
                    <span className="absolute bottom-0 left-0 w-full h-px rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                      style={{ background: "hsl(252, 100%, 68%)" }} />
                  </Link>
                );
              }
              
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-medium relative group py-1"
                  style={{ color: active ? "hsl(252, 100%, 72%)" : "hsl(227, 13%, 65%)" }}
                >
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    {link.label}
                  </motion.span>
                  <span className="absolute bottom-0 left-0 w-full h-px rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                    style={{ background: "hsl(252, 100%, 68%)" }} />
                </Link>
              );
            })}
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3">

            {!user ? (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all inline-block"
                  style={{
                    background: "hsl(232, 49%, 14%)",
                    border: "1px solid hsl(232, 39%, 20%)",
                    color: "hsl(227, 13%, 65%)",
                  }}
                >
                  Login
                </Link>
              </motion.div>
            ) : (
              <div className="relative group">
                <div className="flex items-center gap-3 p-1 pr-4 rounded-full cursor-pointer hover:bg-[hsl(222,28%,14%)] transition-colors relative"
                  style={{ background: "hsl(232, 49%, 14%)", border: "1px solid hsl(232, 39%, 20%)" }}>
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-sm">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "hsl(227, 13%, 65%)" }}>Dashboard</span>
                  
                  {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] items-center justify-center text-white font-bold">
                        {pendingCount}
                      </span>
                    </span>
                  )}
                </div>
                
                {/* Dropdown Options for Backend Features */}
                <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-[hsl(232,39%,20%)]"
                  style={{ background: "hsl(232, 62%, 12%)" }}>
                  <Link to="/browse" className="block px-4 py-3 text-sm transition-colors text-[hsl(231,29%,82%)] hover:bg-[hsl(232,49%,16%)]">
                    Find your ideal co-founder
                  </Link>
                  <Link to="/profile" className="block px-4 py-3 text-sm transition-colors text-[hsl(218,18%,82%)] hover:bg-[hsl(222,28%,12%)]">
                    My Account
                  </Link>
                  <Link to="/posts" className="block px-4 py-3 text-sm transition-colors text-[hsl(218,18%,82%)] hover:bg-[hsl(222,28%,12%)]">
                    My Opportunity Hub
                  </Link>
                  <Link to="/requests" className="block px-4 py-3 text-sm transition-colors text-[hsl(218,18%,82%)] hover:bg-[hsl(222,28%,12%)] flex justify-between items-center">
                    Network Requests
                    {pendingCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        {pendingCount}
                      </span>
                    )}
                  </Link>
                  <div className="w-full h-px" style={{ background: "hsl(222, 22%, 18%)" }}></div>
                  <button onClick={() => signOut()} className="w-full text-left block px-4 py-3 text-sm font-semibold transition-colors text-[hsl(0,62%,60%)] hover:bg-[hsl(222,28%,12%)]">
                    Secure Sign Out
                  </button>
                </div>
              </div>
            )}

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/assessment"
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all inline-block shadow-lg"
                style={{
                  background: "hsl(252, 100%, 68%)",
                  color: "#fff",
                  boxShadow: "0 0 16px hsl(252 100% 68% / 0.25)",
                }}
              >
                Understand your founder DNA
              </Link>
            </motion.div>
          </div>

          {/* Mobile toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2"
              style={{ color: "hsl(218, 14%, 72%)" }}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at top right)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at top right)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at top right)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 lg:hidden"
            style={{
              background: "hsl(232, 62%, 12%, 0.97)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div className="flex flex-col items-center gap-6 mb-8 mt-12">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, type: "spring" }}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-display font-semibold transition-colors"
                  style={{ color: "hsl(231, 29%, 93%)" }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-3 w-full px-6 overflow-y-auto max-h-[60vh] pb-10"
            >
              {user && (
                <div className="flex flex-col gap-3 py-6 border-y border-border/30 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2 px-2">Account Control</span>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="text-xl font-bold py-2 px-2 text-foreground/80">My Profile</Link>
                  <Link to="/requests" onClick={() => setMobileOpen(false)} className="text-xl font-bold py-2 px-2 text-foreground/80 flex justify-between items-center">
                    Network Requests
                    {pendingCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingCount}</span>}
                  </Link>
                  <Link to="/posts" onClick={() => setMobileOpen(false)} className="text-xl font-bold py-2 px-2 text-foreground/80">Opportunity Hub</Link>
                </div>
              )}

              {!user ? (
                <Link to="/login" onClick={() => setMobileOpen(false)}
                  className="py-4 rounded-2xl text-lg font-semibold text-center transition-all bg-[hsl(232,49%,14%)] border border-[hsl(232,39%,20%)] text-[hsl(227,13%,76%)]">
                  Access Portal
                </Link>
              ) : (
                <button onClick={() => { signOut(); setMobileOpen(false); }}
                  className="py-4 rounded-2xl text-lg font-semibold text-center bg-destructive/10 text-destructive border border-destructive/20">
                  Logout Current Session
                </button>
              )}
              <Link to="/assessment" onClick={() => setMobileOpen(false)}
                className="py-4 rounded-2xl text-lg font-bold text-center shadow-xl bg-[hsl(252, 100%, 68%)] text-white">
                Understand your founder DNA
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
