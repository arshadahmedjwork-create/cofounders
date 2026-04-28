import { Home, Users, User, LayoutDashboard, MessageSquare } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const navItems = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Matches", icon: Users, href: "/browse" },
    { label: "Dashboard", icon: LayoutDashboard, href: "/posts" },
    { label: "Profile", icon: User, href: "/profile" },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border px-6 pb-6 pt-3">
      <div className="flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
