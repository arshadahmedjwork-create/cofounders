import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <h1 className="text-4xl font-display font-bold mb-8">My Profile</h1>
        <div className="glass-card rounded-2xl p-8 max-w-2xl">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {user?.email?.[0].toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.email}</h2>
              <p className="text-[hsl(218,14%,56%)] mt-1">Authenticated via Supabase</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[hsl(222,28%,12%)] border border-[hsl(222,22%,20%)]">
              <h3 className="text-sm font-semibold text-[hsl(218,14%,56%)] mb-2">Account Status</h3>
              <p className="text-white">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
