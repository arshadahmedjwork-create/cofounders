import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Check, ChevronRight, ChevronLeft, Loader2, 
  Target, Rocket, UserPlus, Linkedin, MapPin, 
  Briefcase, GraduationCap, DollarSign, Clock, 
  Zap, Brain, Heart, Search, ShieldCheck, Plus, Trash2, Building, Eye
} from "lucide-react";
import { UserProfile, EducationItem, ExperienceItem } from "@/types/profile";
import { saveProfile } from "@/services/profileService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Options from the MASTER PROMPT
const startupGoals = ["Validate idea", "Build MVP", "Improve product", "Get first users", "Scale"];
const startupStages = ["Idea", "MVP", "Early traction"];
const timeCommitments = [
  { id: "<10", label: "<10 hrs", desc: "Exploratory" },
  { id: "10-20", label: "10–20 hrs", desc: "Serious side-hustle" },
  { id: "20+", label: "20+ hrs", desc: "Full-time / Deep commitment" },
];
const skillCategories = [
  "Product Strategy", "Engineering", "Marketing", "Sales", 
  "Operations", "Design", "Data/AI", "Finance", "Biz Dev"
];
const cofounderTypes = [
  { id: "Execution Engine", icon: Zap },
  { id: "Marketing Strategist", icon: Search },
  { id: "Financial Builder", icon: DollarSign },
  { id: "Technical Expert", icon: Brain }
];
const compensations = ["Equity only", "Stipend + equity", "Salary + equity", "Flexible"];
const nonNegotiables = ["Full-time", "Same city (Tamil Nadu)", "Domain expertise", "Startup experience", "Technical", "Business"];

const aspirantGoals = ["Explore", "Build seriously", "Join early startup", "Long-term cofounder"];
const workStyles = ["Execute fast", "Think first", "Work with users", "Hands-on builder", "Experiment", "Structured"];
const survivalTimes = ["<1 month", "1–3 months", "3–6 months", "6+ months"];

const lookingForOptions = ["Co-founder", "CEO", "CTO", "COO", "CPO", "CFO", "Technical Partner", "Business Partner", "Advisor", "Investor"];
const aspirantLookingForOptions = ["Early stage startup", "Founder to build with", "CEO role", "CTO role", "COO role", "CPO role", "CFO role", "Co-founder role", "Freelance project"];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, checkProfile } = useAuth();
  
  const [step, setStep] = useState(0); // 0: Intent, 1+: Questions
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noWorkExperience, setNoWorkExperience] = useState(false);
  
  const [formData, setFormData] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    role: "Founder",
    industry: "Tech",
    selectedSkills: [],
    lookingFor: "",
    idea: "",
    city: "",
    linkedin: "",
    avatarUrl: "",
    experience: "",
    work: "",
    timeCommitment: "10-20",
    userType: "Professional",
    fullBio: "",
    intent: undefined,
    startupGoal: "",
    startupStage: "",
    whatYouCover: [],
    whatYouNeed: [],
    cofounderType: "",
    compensation: "",
    nonNegotiables: [],
    aspirantGoal: "",
    preferredStage: "",
    workStyle: [],
    survivalTime: "",
    equityExpectation: "10-25%",
    educationHistory: [{ school: "", degree: "", year: "" }],
    experienceHistory: [{ company: "", role: "", year: "" }],
    companyName: "",
    companyStage: "Idea",
    companyDescription: "",
  });

  const isLinkedInUser = user?.app_metadata?.provider === "linkedin_oidc" || user?.identities?.some(id => id.provider === "linkedin_oidc");

  useEffect(() => {
    if (user) {
      const meta = user.user_metadata;
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        firstName: prev.firstName || meta.given_name || meta.full_name?.split(' ')[0] || meta.name?.split(' ')[0] || meta.user_name || "",
        lastName: prev.lastName || meta.family_name || meta.full_name?.split(' ').slice(1).join(' ') || meta.name?.split(' ').slice(1).join(' ') || "",
        avatarUrl: prev.avatarUrl || meta.avatar_url || meta.picture || "",
        linkedin: prev.linkedin || (isLinkedInUser ? "Verified LinkedIn Account" : ""),
      }));
    }
  }, [user, isLinkedInUser]);

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      educationHistory: [...(prev.educationHistory || []), { school: "", degree: "", year: "" }]
    }));
  };

  const updateEducation = (index: number, field: keyof EducationItem, value: string) => {
    const newList = [...(formData.educationHistory || [])];
    newList[index] = { ...newList[index], [field]: value };
    setFormData({ ...formData, educationHistory: newList });
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      educationHistory: (prev.educationHistory || []).filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experienceHistory: [...(prev.experienceHistory || []), { company: "", role: "", year: "" }]
    }));
  };

  const updateExperience = (index: number, field: keyof ExperienceItem, value: string) => {
    const newList = [...(formData.experienceHistory || [])];
    newList[index] = { ...newList[index], [field]: value };
    setFormData({ ...formData, experienceHistory: newList });
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experienceHistory: (prev.experienceHistory || []).filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    if (step === 0 && !formData.intent) {
      toast.error("Please select your intent to continue.");
      return;
    }
    
    if (step === 1 && (!formData.firstName || !formData.lastName)) {
      toast.error("Please provide your name.");
      return;
    }
    
    if (step === 2 && !isLinkedInUser && !formData.linkedin) {
       toast.error("Please provide your LinkedIn profile URL.");
       return;
    }

    if (step === 4 && !formData.lookingFor) {
      toast.error("Please select what you are looking for.");
      return;
    }

    if (step === 5) {
      const hasValidEdu = formData.educationHistory?.some(edu => edu.school.trim() && edu.degree.trim());
      if (!hasValidEdu) {
        toast.error("Please provide at least one academic record.");
        return;
      }
    }

    if (step === 6 && !noWorkExperience) {
      const hasValidExp = formData.experienceHistory?.some(exp => exp.company.trim() && exp.role.trim());
      if (!hasValidExp) {
        toast.error("Please provide your work experience or select 'No work experience'.");
        return;
      }
    }

    if (step === 7 && formData.intent === 'building' && !formData.companyName) {
      toast.error("Please provide your startup's name.");
      return;
    }

    setDirection(1);
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Create a descriptive work string from the latest experience
      let workString = formData.intent === 'building' ? 'Founder' : 'Co-founder';
      const latestExp = formData.experienceHistory?.[0];
      if (!noWorkExperience && latestExp && latestExp.role && latestExp.company) {
        workString = `${latestExp.role} @ ${latestExp.company}`;
      } else if (noWorkExperience && formData.userType) {
        workString = formData.userType;
      }

      const finalData = {
        ...formData,
        role: formData.intent === 'building' ? 'Founder' : 'Co-founder',
        work: workString,
        experienceHistory: noWorkExperience ? [] : formData.experienceHistory
      };

      const res = await saveProfile(user!.id, finalData);
      if (!res.success) {
        toast.error(`Error: ${res.error}`);
        return;
      }
      await checkProfile();
      navigate("/browse");
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    enter: (dir: number) => ({ y: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { zIndex: 1, y: 0, opacity: 1 },
    exit: (dir: number) => ({ zIndex: 0, y: dir < 0 ? 100 : -100, opacity: 0 })
  };

  const totalSteps = formData.intent === 'building' ? 16 : 15;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-1.5 bg-border z-50">
        <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
      </div>

      <div className="w-full max-w-2xl relative">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full"
          >
            {/* STEP 0: INTENT */}
            {step === 0 && (
              <div className="space-y-8 text-center">
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-5xl font-display font-bold">Select your <span className="text-primary italic">intent</span></h1>
                  <p className="text-muted-foreground">Choose the path that best describes your current goal.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={() => { setFormData({...formData, intent: 'building'}); handleNext(); }} className={`group p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${formData.intent === 'building' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}><div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform"><Rocket size={32} className="text-primary" /></div><div className="space-y-1"><h3 className="text-xl font-bold">I am building a startup</h3><p className="text-xs text-muted-foreground">Find a co-founder to build with</p></div></button>
                  <button onClick={() => { setFormData({...formData, intent: 'joining'}); handleNext(); }} className={`group p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${formData.intent === 'joining' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}><div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform"><UserPlus size={32} className="text-secondary" /></div><div className="space-y-1"><h3 className="text-xl font-bold">I want to join a startup</h3><p className="text-xs text-muted-foreground">Become a co-founder in a project</p></div></button>
                </div>
              </div>
            )}

            {/* STEP 1: NAME */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-display font-bold">What's your name?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input autoFocus placeholder="First Name" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="onboarding-input-large" onKeyDown={(e) => e.key === 'Enter' && handleNext()} />
                  <input placeholder="Last Name" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="onboarding-input-large" onKeyDown={(e) => e.key === 'Enter' && handleNext()} />
                </div>
              </div>
            )}

            {/* STEP 2: LINKEDIN */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-display font-bold">Your Professional Profile</h2>
                {isLinkedInUser ? (
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><ShieldCheck className="text-primary" /></div>
                    <div><p className="font-bold">LinkedIn Verified</p><p className="text-xs text-muted-foreground">Your identity is securely synced from LinkedIn.</p></div>
                  </div>
                ) : (
                  <div className="relative group">
                    <Linkedin className="absolute left-1 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={32} />
                    <input autoFocus placeholder="linkedin.com/in/username" value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} className="onboarding-input-large pl-14" onKeyDown={(e) => e.key === 'Enter' && handleNext()} />
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: BIO */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-display font-bold">Tell us your story</h2>
                <textarea autoFocus placeholder="Tell your story. What are you building? What are you passionate about?" value={formData.fullBio} onChange={(e) => setFormData({...formData, fullBio: e.target.value})} className="onboarding-input-large min-h-[200px] py-4 resize-none" />
              </div>
            )}

            {/* STEP 4: LOOKING FOR (NEW) */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-display font-bold">What are you <span className="text-primary">looking for</span>?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(formData.intent === 'building' ? lookingForOptions : aspirantLookingForOptions).map(opt => (
                    <button key={opt} onClick={() => { setFormData({...formData, lookingFor: opt}); handleNext(); }} className={`p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${formData.lookingFor === opt ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                      <span className="font-bold">{opt}</span>
                      <Eye size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: EDUCATION */}
            {step === 5 && (
              <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 pb-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-display font-bold">Education</h2>
                  <button onClick={addEducation} className="flex items-center gap-2 text-primary font-bold text-sm"><Plus size={18} /> Add</button>
                </div>
                {formData.educationHistory?.map((edu, idx) => (
                  <div key={idx} className="p-6 bg-card border border-border rounded-3xl space-y-4 relative">
                    <input placeholder="University / School" value={edu.school} onChange={(e) => updateEducation(idx, 'school', e.target.value)} className="w-full bg-transparent border-b border-border py-2 text-lg font-bold focus:outline-none focus:border-primary" />
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(idx, 'degree', e.target.value)} className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-primary" />
                      <input 
                        placeholder="Year (YYYY)" 
                        type="text"
                        inputMode="numeric"
                        value={edu.year} 
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                          updateEducation(idx, 'year', val);
                        }} 
                        className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-primary" 
                      />
                    </div>
                    {idx > 0 && <button onClick={() => removeEducation(idx)} className="absolute top-2 right-2 p-2 text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>}
                  </div>
                ))}
              </div>
            )}

            {/* STEP 6: WORK HISTORY */}
            {step === 6 && (
              <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 pb-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-display font-bold">Work Experience</h2>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setNoWorkExperience(!noWorkExperience)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${noWorkExperience ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"}`}>No work experience</button>
                    {!noWorkExperience && <button onClick={addExperience} className="flex items-center gap-2 text-primary font-bold text-sm"><Plus size={18} /> Add</button>}
                  </div>
                </div>
                {!noWorkExperience && formData.experienceHistory?.map((exp, idx) => (
                  <div key={idx} className="p-6 bg-card border border-border rounded-3xl space-y-4 relative">
                    <input placeholder="Company" value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} className="w-full bg-transparent border-b border-border py-2 text-lg font-bold focus:outline-none focus:border-primary" />
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="Role" value={exp.role} onChange={(e) => updateExperience(idx, 'role', e.target.value)} className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-primary" />
                      <input 
                        placeholder="Year (YYYY)" 
                        type="text"
                        inputMode="numeric"
                        value={exp.year} 
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                          updateExperience(idx, 'year', val);
                        }} 
                        className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-primary" 
                      />
                    </div>
                    {idx > 0 && <button onClick={() => removeExperience(idx)} className="absolute top-2 right-2 p-2 text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>}
                  </div>
                ))}
              </div>
            )}

            {/* FLOW A: BUILDING */}
            {formData.intent === 'building' && (
              <>
                {step === 7 && (
                  <div className="space-y-8">
                    <h2 className="text-3xl font-display font-bold">About your Startup</h2>
                    <div className="space-y-6">
                      <div className="relative group"><Building className="absolute left-1 top-1/2 -translate-y-1/2 text-primary transition-colors" size={32} /><input autoFocus placeholder="Company Name" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} className="onboarding-input-large pl-14" /></div>
                      <div className="space-y-2"><label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tell us more</label><textarea placeholder="Describe what you are building..." value={formData.companyDescription} onChange={(e) => setFormData({...formData, companyDescription: e.target.value})} className="w-full bg-card/50 border border-border rounded-2xl p-4 min-h-[120px] focus:outline-none focus:border-primary" /></div>
                    </div>
                  </div>
                )}
                {step === 8 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-display font-bold">What is your current goal?</h2>
                    <div className="grid grid-cols-1 gap-3">
                      {startupGoals.map(goal => (<button key={goal} onClick={() => { setFormData({...formData, startupGoal: goal}); handleNext(); }} className={`p-5 rounded-2xl border-2 text-left transition-all ${formData.startupGoal === goal ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}><span className="font-bold">{goal}</span></button>))}
                    </div>
                  </div>
                )}
                {step === 9 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-display font-bold">Startup Stage</h2>
                    <div className="grid grid-cols-1 gap-3">
                      {startupStages.map(stage => (<button key={stage} onClick={() => { setFormData({...formData, startupStage: stage}); handleNext(); }} className={`p-5 rounded-2xl border-2 text-left transition-all ${formData.startupStage === stage ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}><span className="font-bold">{stage}</span></button>))}
                    </div>
                  </div>
                )}
                {step === 10 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-display font-bold">Time Commitment</h2>
                    <div className="grid grid-cols-1 gap-3">
                      {timeCommitments.map(opt => (<button key={opt.id} onClick={() => { setFormData({...formData, timeCommitment: opt.id}); handleNext(); }} className={`p-5 rounded-2xl border-2 text-left transition-all ${formData.timeCommitment === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}><div className="flex justify-between items-center"><span className="font-bold">{opt.label}</span><span className="text-xs text-muted-foreground">{opt.desc}</span></div></button>))}
                    </div>
                  </div>
                )}
                {step === 11 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-display font-bold">What do you already cover? (Max 3)</h2>
                    <div className="flex flex-wrap gap-3">
                      {skillCategories.map(skill => (<button key={skill} onClick={() => { const current = formData.whatYouCover || []; if (current.includes(skill)) { setFormData({...formData, whatYouCover: current.filter(s => s !== skill)}); } else if (current.length < 3) { setFormData({...formData, whatYouCover: [...current, skill]}); } }} className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${formData.whatYouCover?.includes(skill) ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/30"}`}>{skill}</button>))}
                    </div>
                  </div>
                )}
                {step === 12 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-display font-bold">What do you need help with? (Max 2)</h2>
                    <div className="grid grid-cols-1 gap-3">
                      {["Product clarity", "Technical build", "User acquisition", "Business execution"].map(need => (<button key={need} onClick={() => { const current = formData.whatYouNeed || []; if (current.includes(need)) { setFormData({...formData, whatYouNeed: current.filter(s => s !== need)}); } else if (current.length < 2) { setFormData({...formData, whatYouNeed: [...current, need]}); } }} className={`p-5 rounded-2xl border-2 text-left transition-all ${formData.whatYouNeed?.includes(need) ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/30"}`}><span className="font-bold">{need}</span></button>))}
                    </div>
                  </div>
                )}
                {step === 13 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-display font-bold">Ideal Co-founder Type</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {cofounderTypes.map(type => (<button key={type.id} onClick={() => { setFormData({...formData, cofounderType: type.id}); handleNext(); }} className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${formData.cofounderType === type.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}><type.icon size={24} className={formData.cofounderType === type.id ? "text-primary" : "text-muted-foreground"} /><span className="text-xs font-bold text-center">{type.id}</span></button>))}
                    </div>
                  </div>
                )}
                {step === 14 && (
                   <div className="space-y-6">
                     <h2 className="text-3xl font-display font-bold">Compensation Offer</h2>
                     <div className="grid grid-cols-1 gap-3">
                       {compensations.map(comp => (<button key={comp} onClick={() => { setFormData({...formData, compensation: comp}); handleNext(); }} className={`p-5 rounded-2xl border-2 text-left transition-all ${formData.compensation === comp ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}><span className="font-bold">{comp}</span></button>))}
                     </div>
                   </div>
                )}
                {step === 15 && (
                  <div className="space-y-8">
                    <h2 className="text-3xl font-display font-bold">Equity Expectation</h2>
                    <div className="space-y-4">
                      <input type="range" min="0" max="3" step="1" value={["<10%", "10-25%", "25-40%", "40%+"].indexOf(formData.equityExpectation || "10-25%")} onChange={(e) => { const vals = ["<10%", "10-25%", "25-40%", "40%+"]; setFormData({...formData, equityExpectation: vals[parseInt(e.target.value)]}); }} className="w-full h-3 bg-secondary/20 rounded-lg appearance-none cursor-pointer accent-primary" /><div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest"><span>Low</span><span className="text-primary text-xl font-display">{formData.equityExpectation}</span><span>High</span></div>
                    </div>
                  </div>
                )}
                {step === 16 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-display font-bold">Any Non-Negotiables?</h2>
                    <div className="flex flex-wrap gap-3">
                      {nonNegotiables.map(nn => (<button key={nn} onClick={() => { const current = formData.nonNegotiables || []; if (current.includes(nn)) { setFormData({...formData, nonNegotiables: current.filter(s => s !== nn)}); } else { setFormData({...formData, nonNegotiables: [...current, nn]}); } }} className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${formData.nonNegotiables?.includes(nn) ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/30"}`}>{nn}</button>))}
                    </div>
                    <div className="pt-8"><button onClick={handleSubmit} className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-bold text-xl shadow-xl shadow-primary/20">Complete My Profile</button></div>
                  </div>
                )}
              </>
            )}

            {/* FLOW B: JOINING */}
            {formData.intent === 'joining' && (
              <>
                {step === 7 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-display font-bold">What is your goal?</h2>
                    <div className="grid grid-cols-1 gap-3">
                      {aspirantGoals.map(goal => (<button key={goal} onClick={() => { setFormData({...formData, aspirantGoal: goal}); handleNext(); }} className={`p-5 rounded-2xl border-2 text-left transition-all ${formData.aspirantGoal === goal ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/30"}`}><span className="font-bold">{goal}</span></button>))}
                    </div>
                  </div>
                )}
                {step === 8 && (
                   <div className="space-y-6">
                    <h2 className="text-3xl font-display font-bold">Preferred Startup Stage</h2>
                    <div className="grid grid-cols-1 gap-3">
                      {startupStages.map(stage => (<button key={stage} onClick={() => { setFormData({...formData, preferredStage: stage}); handleNext(); }} className={`p-5 rounded-2xl border-2 text-left transition-all ${formData.preferredStage === stage ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/30"}`}><span className="font-bold">{stage}</span></button>))}
                    </div>
                  </div>
                )}
                {step === 9 && (
                   <div className="space-y-6">
                    <h2 className="text-3xl font-display font-bold">Time Commitment</h2>
                    <div className="grid grid-cols-1 gap-3">
                      {timeCommitments.map(opt => (<button key={opt.id} onClick={() => { setFormData({...formData, timeCommitment: opt.id}); handleNext(); }} className={`p-5 rounded-2xl border-2 text-left transition-all ${formData.timeCommitment === opt.id ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/30"}`}><div className="flex justify-between items-center"><span className="font-bold">{opt.label}</span><span className="text-xs text-muted-foreground">{opt.desc}</span></div></button>))}
                    </div>
                  </div>
                )}
                {step === 10 && (
                   <div className="space-y-6">
                    <h2 className="text-3xl font-display font-bold">Your Core Skills (Max 3)</h2>
                    <div className="flex flex-wrap gap-3">
                      {skillCategories.map(skill => (<button key={skill} onClick={() => { const current = formData.selectedSkills || []; if (current.includes(skill)) { setFormData({...formData, selectedSkills: current.filter(s => s !== skill)}); } else if (current.length < 3) { setFormData({...formData, selectedSkills: [...current, skill]}); } }} className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${formData.selectedSkills?.includes(skill) ? "border-secondary bg-secondary text-secondary-foreground" : "border-border hover:border-secondary/30"}`}>{skill}</button>))}
                    </div>
                  </div>
                )}
                {step === 11 && (
                   <div className="space-y-6">
                    <h2 className="text-3xl font-display font-bold">Work Style (Max 2)</h2>
                    <div className="flex flex-wrap gap-3">
                      {workStyles.map(style => (<button key={style} onClick={() => { const current = formData.workStyle || []; if (current.includes(style)) { setFormData({...formData, workStyle: current.filter(s => s !== style)}); } else if (current.length < 2) { setFormData({...formData, workStyle: [...current, style]}); } }} className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${formData.workStyle?.includes(style) ? "border-secondary bg-secondary text-secondary-foreground" : "border-border hover:border-secondary/30"}`}>{style}</button>))}
                    </div>
                  </div>
                )}
                {step === 12 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-display font-bold">Compensation Expectation</h2>
                    <div className="grid grid-cols-1 gap-3">
                      {compensations.map(comp => (<button key={comp} onClick={() => { setFormData({...formData, compensation: comp}); handleNext(); }} className={`p-5 rounded-2xl border-2 text-left transition-all ${formData.compensation === comp ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/30"}`}><span className="font-bold">{comp}</span></button>))}
                    </div>
                  </div>
                )}
                {step === 13 && (
                   <div className="space-y-6">
                    <h2 className="text-3xl font-display font-bold">Survival Time Without Salary</h2>
                    <div className="grid grid-cols-1 gap-3">
                      {survivalTimes.map(time => (<button key={time} onClick={() => { setFormData({...formData, survivalTime: time}); handleNext(); }} className={`p-5 rounded-2xl border-2 text-left transition-all ${formData.survivalTime === time ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/30"}`}><span className="font-bold">{time}</span></button>))}
                    </div>
                  </div>
                )}
                {step === 14 && (
                  <div className="space-y-8">
                    <h2 className="text-3xl font-display font-bold">Equity Expectation</h2>
                    <div className="space-y-4">
                      <input type="range" min="0" max="3" step="1" value={["<10%", "10-25%", "25-40%", "40%+"].indexOf(formData.equityExpectation || "10-25%")} onChange={(e) => { const vals = ["<10%", "10-25%", "25-40%", "40%+"]; setFormData({...formData, equityExpectation: vals[parseInt(e.target.value)]}); }} className="w-full h-3 bg-secondary/20 rounded-lg appearance-none cursor-pointer accent-secondary" /><div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest"><span>Low</span><span className="text-secondary text-xl font-display">{formData.equityExpectation}</span><span>High</span></div>
                    </div>
                  </div>
                )}
                {step === 15 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-display font-bold">Any Non-Negotiables?</h2>
                    <div className="flex flex-wrap gap-3">
                      {nonNegotiables.map(nn => (<button key={nn} onClick={() => { const current = formData.nonNegotiables || []; if (current.includes(nn)) { setFormData({...formData, nonNegotiables: current.filter(s => s !== nn)}); } else { setFormData({...formData, nonNegotiables: [...current, nn]}); } }} className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${formData.nonNegotiables?.includes(nn) ? "border-secondary bg-secondary text-secondary-foreground" : "border-border hover:border-secondary/30"}`}>{nn}</button>))}
                    </div>
                    <div className="pt-8"><button onClick={handleSubmit} className="w-full py-5 bg-secondary text-secondary-foreground rounded-2xl font-bold text-xl shadow-xl shadow-secondary/20">Complete My Profile</button></div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-between">
          {step > 0 && <button onClick={handleBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-bold transition-colors"><ChevronLeft size={20} /> Back</button>}
          {(
            step === 1 || // Name
            step === 3 || // Bio
            step === 4 || // Looking For
            (step === 2 && !isLinkedInUser) || // LinkedIn
            step === 5 || // Education
            step === 6 || // Work Experience
            (step === 7 && formData.intent === 'building') || // Company Details
            (step === 11 && formData.intent === 'building') || // Cover (A-11)
            (step === 12 && formData.intent === 'building') || // Need (A-12)
            (step === 15 && formData.intent === 'building') || // Equity (A-15)
            (step === 10 && formData.intent === 'joining') || // Skills (B-10)
            (step === 11 && formData.intent === 'joining') || // Style (B-11)
            (step === 14 && formData.intent === 'joining')    // Equity (B-14)
          ) && (
            <button onClick={handleNext} className="ml-auto flex items-center gap-2 px-8 py-3 bg-foreground text-background rounded-full font-bold hover:scale-105 transition-all">Continue <ChevronRight size={20} /></button>
          )}
        </div>
      </div>

      <style>{`
        .onboarding-input-large { width: 100%; background: transparent; border: none; border-bottom: 2px solid hsl(var(--border)); font-size: 1.5rem; font-weight: 600; padding-top: 1rem; padding-bottom: 1rem; transition: all 0.3s; color: hsl(var(--foreground)); }
        .onboarding-input-large:focus { outline: none; border-color: hsl(var(--primary)); }
        @media (min-width: 768px) { .onboarding-input-large { font-size: 2.5rem; } }
      `}</style>
    </div>
  );
}
