import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  user: User | null;
  hasProfile: boolean | null;
  loading: boolean;
  signOut: () => Promise<void>;
  checkProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Use TanStack Query for profile matching - this handles caching and fast retrieval
  const { data: profileData, isLoading: profileLoading, refetch: checkProfile } = useQuery({
    queryKey: ["profile", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.email,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const hasProfile = user ? (profileLoading ? null : !!profileData) : false;

  useEffect(() => {
    // Initial session check
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        if (!session) {
          queryClient.clear(); // Clear cache on logout
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      queryClient.clear();
      navigate("/login");
    } catch (err) {
      console.error("Sign out error:", err);
      // Fallback if SDK fails
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        hasProfile, 
        loading: loading || (!!user && profileLoading), 
        signOut, 
        checkProfile: () => checkProfile() 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
