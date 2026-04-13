import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Heart, Users, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<"linkedin" | "google" | "github" | null>(null);

  const handleOAuthLogin = async (provider: "linkedin_oidc" | "google" | "github") => {
    setLoadingProvider(
      provider === "linkedin_oidc" ? "linkedin" : 
      provider === "google" ? "google" : "github"
    );
    setError("");
    
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + "/",
        scopes: "openid profile email", 
      },
    });

    if (authError) {
      setError(authError.message);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Branding Panel */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-secondary"
      >
        {/* Animated background shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl animate-float" />
          <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-gold/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-teal/10 blur-3xl animate-float" style={{ animationDelay: "4s" }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-start p-12 xl:p-16">
          <Link to="/" className="flex items-center gap-2 mb-12 group">
            <motion.span
              className="w-3 h-3 rounded-full bg-primary inline-block"
              whileHover={{ scale: 1.4, rotate: 90 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <span className="font-accent text-xl font-semibold text-secondary-foreground">
              Cofounder <span className="text-primary">✦</span> Matrimony
            </span>
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-display text-4xl xl:text-5xl font-bold text-secondary-foreground leading-tight mb-6"
          >
            Find Your
            <br />
            <span className="text-primary">Perfect Match</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-secondary-foreground/70 text-lg leading-relaxed mb-10 max-w-md"
          >
            Join thousands of professionals who found their business cofounder through our intelligent matching platform.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            {[
              { icon: Sparkles, text: "AI-Powered Cofounder Matching" },
              { icon: Heart, text: "Verified Profiles" },
              { icon: Users, text: "10,000+ Active Users" },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.15 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <item.icon size={18} className="text-primary" />
                </div>
                <span className="text-secondary-foreground/80 font-medium text-sm">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background relative">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <span className="w-3 h-3 rounded-full bg-primary inline-block" />
            <span className="font-accent text-xl font-semibold text-foreground">
              Cofounder <span className="text-primary">✦</span> Matrimony
            </span>
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl font-bold text-foreground mb-3">
              Join the Network
            </h2>
            <p className="text-muted-foreground text-sm max-w-[280px] mx-auto">
              Connect with founders and builders. Choose your preferred way to sign in.
            </p>
          </div>

          <div className="space-y-4">
            {/* LinkedIn Button */}
            <motion.button
              onClick={() => handleOAuthLogin("linkedin_oidc")}
              disabled={!!loadingProvider}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl bg-[#0077b5] text-white font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-[#0077b5]/20 hover:bg-[#0077b5]/90 transition-all disabled:opacity-70"
            >
              {loadingProvider === "linkedin" ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                  Continue with LinkedIn
                </>
              )}
            </motion.button>

            {/* Google Button */}
            <motion.button
              onClick={() => handleOAuthLogin("google")}
              disabled={!!loadingProvider}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl bg-white text-gray-700 border border-gray-200 font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-gray-200/20 hover:bg-gray-50 transition-all disabled:opacity-70"
            >
              {loadingProvider === "google" ? (
                <Loader2 className="animate-spin text-gray-500" size={20} />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </motion.button>

            {/* GitHub Button */}
            <motion.button
              onClick={() => handleOAuthLogin("github")}
              disabled={!!loadingProvider}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl bg-[#24292e] text-white font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-[#24292e]/20 hover:bg-[#24292e]/90 transition-all disabled:opacity-70"
            >
              {loadingProvider === "github" ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  Continue with GitHub
                </>
              )}
            </motion.button>

            {/* Privacy note */}
            <p className="text-center text-[10px] text-muted-foreground leading-relaxed px-4">
              By continuing, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>. We only sync your professional profile.
            </p>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-destructive/10 text-destructive text-xs p-3 rounded-xl border border-destructive/20 text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
