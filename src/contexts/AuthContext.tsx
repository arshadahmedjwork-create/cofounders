import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  hasProfile: boolean | null;
  loading: boolean;
  signOut: () => Promise<void>;
  checkProfile: (userId: string | undefined) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null); // null means checking
  const [loading, setLoading] = useState(true);

  const checkProfile = async (currentEmail?: string) => {
    if (!currentEmail) {
      setHasProfile(false);
      return;
    }
    try {
      // In the schema, we uniquely identify profiles by email for now
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("email", currentEmail)
        .single();
        
      if (data && !error) {
        setHasProfile(true);
      } else {
        setHasProfile(false);
      }
    } catch (err) {
      console.error("Error checking profile:", err);
      setHasProfile(false);
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
         console.warn("Auth session error:", error.message);
      }
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser?.email) {
        await checkProfile(currentUser.email);
      } else {
        setHasProfile(false);
      }
      setLoading(false);
    };

    getSession();

    // Listen for changes on auth state (log in, log out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser?.email) {
          await checkProfile(currentUser.email);
        } else {
          setHasProfile(false);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setHasProfile(false);
  };

  return (
    <AuthContext.Provider value={{ user, hasProfile, loading, signOut, checkProfile }}>
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
