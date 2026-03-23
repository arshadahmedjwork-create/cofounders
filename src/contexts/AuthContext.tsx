import { createContext, useContext, useEffect, useState, useRef } from "react";
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
  const checkingProfileRef = useRef<string | null>(null);

  const checkProfile = async (currentEmail?: string) => {
    if (!currentEmail) {
      setHasProfile(false);
      return;
    }
    
    // Prevent redundant checks if already checking this email
    if (checkingProfileRef.current === currentEmail) return;
    checkingProfileRef.current = currentEmail;

    try {
      // Force a timeout to prevent infinite hanging
      const fetchPromise = supabase
        .from("user_profiles")
        .select("id")
        .eq("email", currentEmail)
        .maybeSingle();
        
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Supabase query timeout")), 30000)
      );

      const result = await Promise.race([fetchPromise, timeoutPromise]) as any;
        
      if (result && result.error) {
        // If it's a real error (not just not found), don't assume profile is missing
        console.error("Profile check error:", result.error);
        return; 
      }

      if (result && result.data) {
        setHasProfile(true);
      } else if (result) {
        // No data and no error means definitely no profile
        setHasProfile(false);
      }
    } catch (err) {
      console.error("Error checking profile (timeout/abort):", err);
      // Keep hasProfile as null to avoid redirecting incorrectly
    } finally {
      if (checkingProfileRef.current === currentEmail) {
        checkingProfileRef.current = null;
      }
    }
  };

  useEffect(() => {
    // Listen for changes on auth state (log in, log out, etc.)
    // Note: onAuthStateChange fires with the initial session on subscribe
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          if (currentUser?.email) {
            await checkProfile(currentUser.email);
          } else {
            setHasProfile(false);
          }
        } catch (err) {
          console.error("Critical AuthContext subscription failure:", err);
          setHasProfile(false);
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      // Clear local state first for immediate UI response
      setUser(null);
      setHasProfile(false);
      
      // Attempt to notify Supabase (and clear cookies)
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      // Always ensure we are back at the home or login page
      window.location.href = "/login";
    }
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
