import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Heart, Users } from "lucide-react";

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

  const getUsers = (): { email: string; password: string }[] => {
    try {
      return JSON.parse(localStorage.getItem("cofounder_users") || "[]");
    } catch {
      return [];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    const users = getUsers();

    if (isLogin) {
      const user = users.find(
        (u) => u.email === email.toLowerCase() && u.password === password
      );
      if (!user) {
        setError("Invalid email or password. If you're new, sign up first!");
        return;
      }
      setLoading(true);
      localStorage.setItem("cofounder_current_user", email.toLowerCase());
      setTimeout(() => navigate("/"), 800);
    } else {
      if (!confirmPassword.trim()) {
        setError("Please confirm your password.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      const exists = users.find((u) => u.email === email.toLowerCase());
      if (exists) {
        setError("This email is already registered. Please login instead.");
        return;
      }
      setLoading(true);
      users.push({ email: email.toLowerCase(), password });
      localStorage.setItem("cofounder_users", JSON.stringify(users));
      localStorage.setItem("cofounder_current_user", email.toLowerCase());
      setTimeout(() => navigate("/"), 800);
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
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Sign up to start your journey"}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-muted rounded-xl p-1 mb-8">
            <button
              onClick={() => switchMode()}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isLogin
                  ? "bg-background text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => switchMode()}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                !isLogin
                  ? "bg-background text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login" : "signup"}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={isLogin ? "Enter your password" : "Create a password (min 6 chars)"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (Sign Up only) */}
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium text-foreground" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-11 pr-12 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-xl border border-destructive/20"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                />
              ) : (
                <>
                  {isLogin ? "Login" : "Create Account"}
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer text */}
          <p className="text-center text-muted-foreground text-xs mt-8">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={switchMode}
              className="text-primary font-semibold hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
