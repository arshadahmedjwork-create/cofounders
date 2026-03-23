import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check, ChevronDown, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { UserProfile } from "@/types/profile";
import { saveProfile } from "@/services/profileService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Option { label: string; value: string; }

const roles: Option[] = [
  { label: "Startup Founder", value: "Startup Founder" },
  { label: "Freelancer / Independent", value: "Freelancer / Independent" },
  { label: "Corporate Professional", value: "Corporate Professional" },
  { label: "Serial Entrepreneur", value: "Serial Entrepreneur" },
  { label: "Investor / Operator", value: "Investor / Operator" },
  { label: "Technical (CTO profile)", value: "Technical (CTO profile)" },
];

const industries: Option[] = [
  { label: "AI / Machine Learning", value: "AI / Machine Learning" },
  { label: "FinTech", value: "FinTech" },
  { label: "HealthTech", value: "HealthTech" },
  { label: "EdTech", value: "EdTech" },
  { label: "SaaS / B2B", value: "SaaS / B2B" },
  { label: "D2C / Consumer", value: "D2C / Consumer" },
  { label: "Climate Tech", value: "Climate Tech" },
  { label: "Logistics / Supply Chain", value: "Logistics / Supply Chain" },
  { label: "Web3 / Crypto", value: "Web3 / Crypto" },
  { label: "Other", value: "Other" },
];

const skills = [
  "PRODUCT", "ENGINEERING", "DESIGN", "SALES", 
  "MARKETING", "FINANCE / CFO", "OPERATIONS", "LEGAL"
];

const lookingForOpts: Option[] = [
  { label: "Technical (CTO profile)", value: "Technical (CTO profile)" },
  { label: "Business / Operations", value: "Business / Operations" },
  { label: "Product / Design", value: "Product / Design" },
  { label: "Sales / Marketing", value: "Sales / Marketing" },
  { label: "Domain Expert", value: "Domain Expert" },
  { label: "Any", value: "Any" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, checkProfile } = useAuth();
  
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    role: "Startup Founder",
    industry: "AI / Machine Learning",
    selectedSkills: [],
    lookingFor: "Technical (CTO profile)",
    idea: "",
    city: "",
    linkedin: "",
  });

  // Sync email if user loads slightly after mount
  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: user.email! }));
    }
  }, [user]);

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter(s => s !== skill)
        : [...prev.selectedSkills, skill]
    }));
  };

  const isStep1Valid = formData.firstName.trim() !== "" && formData.lastName.trim() !== "" && formData.email.trim() !== "" && formData.city.trim() !== "";
  const isStep2Valid = formData.role !== "" && formData.industry !== "" && formData.selectedSkills.length > 0;
  const isStep3Valid = formData.lookingFor !== "" && formData.idea.trim() !== "";

  const handleNext = () => {
    if (step === 1 && !isStep1Valid) return;
    if (step === 2 && !isStep2Valid) return;
    if (step < 3) {
      setDirection(1);
      setStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(s => s - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep3Valid) return;
    
    setIsSubmitting(true);
    try {
      const res = await saveProfile(user!.id, formData);
      if (!res.success) {
        toast.error(`Error: ${res.error}`);
        setIsSubmitting(false);
        return;
      }
      // Wait for success, refresh global AuthContext so the ProtectedRoutes open up
      await checkProfile(user?.email);
      // Navigate to browse matches now that onboarding is complete
      navigate("/browse");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save profile");
      setIsSubmitting(false);
    }
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 30 : -30, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (dir: number) => ({ zIndex: 0, x: dir < 0 ? 30 : -30, opacity: 0 })
  };

  return (
    <div className="min-h-screen bg-background/95 relative overflow-hidden flex flex-col justify-center items-center p-4 py-12">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/20 blur-3xl" />

      <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-8 text-center relative z-10">
        Construct Your <span className="font-accent italic text-primary">Identity</span>
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl flex flex-col z-10 overflow-hidden min-h-[500px]"
      >
        {/* Header / Stepper */}
        <div className="p-6 md:px-8 border-b border-border bg-muted/30">
          
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className="h-1.5 flex-1 rounded-full overflow-hidden bg-muted relative">
                  <motion.div 
                    initial={false}
                    animate={{ width: step >= s ? "100%" : "0%" }}
                    className="absolute inset-0 bg-primary h-full"
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 px-1">
            <span className={`text-xs font-bold ${step >= 1 ? "text-primary" : "text-muted-foreground"} tracking-widest uppercase`}>Identity</span>
            <span className={`text-xs font-bold ${step >= 2 ? "text-primary" : "text-muted-foreground"} tracking-widest uppercase text-center`}>Expertise</span>
            <span className={`text-xs font-bold ${step >= 3 ? "text-primary" : "text-muted-foreground"} tracking-widest uppercase text-right`}>Vision</span>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 md:p-8 overflow-y-auto overflow-x-hidden relative flex-1 min-h-[350px]">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, type: "tween", ease: "easeInOut" }}
              className="space-y-6"
            >
              {/* STEP 1: IDENTITY */}
              {step === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground tracking-widest uppercase">First Name</label>
                      <input
                        type="text"
                        placeholder="Jane"
                        value={formData.firstName}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Last Name</label>
                      <input
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Email Address (Locked via Auth)</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground/50 cursor-not-allowed font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground tracking-widest uppercase">City / Location</label>
                    <input
                      type="text"
                      placeholder="Bangalore, India"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
                    />
                  </div>
                </>
              )}

              {/* STEP 2: EXPERTISE */}
              {step === 2 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground tracking-widest uppercase">I Am A</label>
                      <div className="relative">
                        <select
                          value={formData.role}
                          onChange={e => setFormData({ ...formData, role: e.target.value })}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground appearance-none cursor-pointer font-medium"
                        >
                          {roles.map(r => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Industry Domain</label>
                      <div className="relative">
                        <select
                          value={formData.industry}
                          onChange={e => setFormData({ ...formData, industry: e.target.value })}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground appearance-none cursor-pointer font-medium"
                        >
                          {industries.map(i => (
                            <option key={i.value} value={i.value}>{i.label}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <label className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Your Core Skills <span className="text-muted-foreground/60 normal-case">(Select multiple)</span></label>
                    <div className="flex flex-wrap gap-x-2 gap-y-3">
                      {skills.map(skill => (
                        <label 
                          key={skill} 
                          className={`flex items-center gap-2 cursor-pointer group px-4 py-2 border-2 rounded-xl transition-all font-semibold text-xs tracking-wider ${
                            formData.selectedSkills.includes(skill)
                              ? "bg-primary/10 border-primary text-primary shadow-sm"
                              : "border-border bg-background hover:border-primary/40 text-foreground"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleSkillToggle(skill);
                          }}
                        >
                          <div className={`w-4 h-4 rounded-[4px] border-2 flex items-center justify-center transition-colors ${
                            formData.selectedSkills.includes(skill)
                               ? "bg-primary border-primary text-primary-foreground"
                               : "border-[var(--border)] bg-background"
                          }`}>
                            {formData.selectedSkills.includes(skill) && <Check size={12} strokeWidth={4} />}
                          </div>
                          {skill}
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* STEP 3: VISION */}
              {step === 3 && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Looking For A Co-Founder Who Is</label>
                    <div className="relative">
                      <select
                        value={formData.lookingFor}
                        onChange={e => setFormData({ ...formData, lookingFor: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground appearance-none cursor-pointer font-medium"
                      >
                        {lookingForOpts.map(l => (
                          <option key={l.value} value={l.value}>{l.label}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Your Startup Idea or Goal</label>
                    <textarea
                      placeholder="Describe the problem you're solving, your traction, or your vision..."
                      value={formData.idea}
                      onChange={e => setFormData({ ...formData, idea: e.target.value })}
                      rows={4}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none text-foreground font-medium"
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-muted-foreground tracking-widest uppercase pl-1">LinkedIn URL <span className="text-muted-foreground/60 normal-case font-normal">(Optional)</span></label>
                    <input
                      type="text"
                      placeholder="linkedin.com/in/jane"
                      value={formData.linkedin}
                      onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground font-medium"
                    />
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-6 md:px-8 border-t border-border bg-muted/20 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-transparent hover:border-border"
            >
              <ChevronLeft size={16} /> Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
            >
              Next <ChevronRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isStep3Valid || isSubmitting}
              className="flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-accent/25 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100 min-w-[160px] justify-center"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <>Complete <Check size={18} /></>}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
