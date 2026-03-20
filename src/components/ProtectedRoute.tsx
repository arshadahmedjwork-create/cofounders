import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ requireProfile = true }: { requireProfile?: boolean }) {
  const { user, hasProfile, loading } = useAuth();

  // Show a full-screen loader while checking auth state or database profile
  if (loading || (user && hasProfile === null)) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-muted-foreground font-medium animate-pulse">Authenticating...</p>
      </div>
    );
  }

  // Not logged in at all -> send to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, requires a profile to view this route, but no profile -> send to Onboarding
  if (requireProfile && hasProfile === false) {
    return <Navigate to="/onboarding" replace />;
  }

  // Logged in, DOES NOT require a profile (like the Onboarding page itself), but already HAS one -> kick to Home/Browse
  if (!requireProfile && hasProfile === true) {
    return <Navigate to="/browse" replace />;
  }

  return <Outlet />;
}
