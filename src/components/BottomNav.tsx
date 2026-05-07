import { Home, Users, User, LayoutDashboard, MessageSquare } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

export default function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const navItems = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Discover", icon: Users, href: "/match" },
    { label: "Dashboard", icon: LayoutDashboard, href: "/posts" },
    { label: "Profile", icon: User, href: "/profile" },
  ];

  return (
    <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50 bg-[#0a0c10]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] px-8 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex flex-col items-center gap-1.5 transition-all relative ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-white"
              }`}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" : ""} />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-white" : ""}`}>{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-2 w-8 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]"
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
