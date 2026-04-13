import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Heart, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    if (isLogin) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
      setTimeout(() => navigate("/"), 400);
    } else {
      if (!confirmPassword.trim()) {
        setError("Please confirm your password.");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
      });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      setTimeout(() => navigate("/"), 400);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setPassword("");
    setConfirmPassword("");
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
              Connect with founders and builders. Securely login via LinkedIn.
            </p>
          </div>

          <div className="space-y-6">
            <motion.button
              onClick={async () => {
                setLoading(true);
                setError("");
                const { error: authError } = await supabase.auth.signInWithOAuth({
                  provider: "linkedin_oidc",
                  options: {
                    redirectTo: window.location.origin + "/",
                    scopes: "openid profile email", // Standard OIDC scopes
                  },
                });
                if (authError) {
                  setError(authError.message);
                  setLoading(false);
                }
              }}
              disabled={loading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl bg-[#0077b5] text-white font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-[#0077b5]/20 hover:bg-[#0077b5]/90 transition-all disabled:opacity-70"
            >
              {loading ? (
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
