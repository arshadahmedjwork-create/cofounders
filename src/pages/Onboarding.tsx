import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check, ChevronRight, ChevronLeft, Loader2, Award, Clock, Target, Briefcase, GraduationCap, Plus, Trash2, Linkedin, MapPin, Users, Building } from "lucide-react";
import { UserProfile, EducationItem, ExperienceItem } from "@/types/profile";
import { saveProfile } from "@/services/profileService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const timeOptions = [
  { id: "<10", label: "<10 hrs/week", desc: "Exploratory / Part-time" },
  { id: "10-20", label: "10–20 hrs/week", desc: "Serious side-hustle" },
  { id: "20+", label: "20+ hrs/week", desc: "Full-time commitment" },
];

const skillOptions = [
  "Product Strategy", "Sales / GTM", "Fundraising", "Engineering", 
  "UI / UX Design", "Data Science / AI", "Marketing / Growth", 
  "Operations", "Finance / CFO", "Business Development"
];

const keywordOptions = [
  "SaaS", "B2B", "Web3", "AI", "D2C", "FinTech", "HealthTech", "EdTech", 
  "Sustainability", "E-commerce", "Mobile", "Enterprise", "Consumer", 
  "Hardware", "DeepTech", "Marketplace", "Logistics", "BioTech"
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, checkProfile } = useAuth();
  
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  
  const [formData, setFormData] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    role: "Founder",
    industry: "Tech",
    selectedSkills: [],
    lookingFor: "Co-founder",
    idea: "",
    city: "",
    linkedin: "",
    avatarUrl: "",
    experience: "",
    work: "",
    timeCommitment: "10-20",
    educationHistory: [{ school: "", degree: "", year: "" }],
    experienceHistory: [{ company: "", role: "", year: "" }],
    // New fields
    userType: "Professional",
    fullBio: "",
    discoveryPreference: "candidates",
    companyName: "",
    companyStage: "Idea",
    companyDescription: "",
    companyLogo: "",
  });

  // Sync data from OAuth Metadata if available
  useEffect(() => {
    if (user) {
      const meta = user.user_metadata;
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        firstName: prev.firstName || meta.given_name || meta.full_name?.split(' ')[0] || meta.name?.split(' ')[0] || meta.user_name || "",
        lastName: prev.lastName || meta.family_name || meta.full_name?.split(' ').slice(1).join(' ') || meta.name?.split(' ').slice(1).join(' ') || "",
        avatarUrl: prev.avatarUrl || meta.avatar_url || meta.picture || "",
        experience: prev.experience || meta.headline || "",
        work: prev.work || meta.company || meta.work || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.city) {
          setFormData(prev => ({ ...prev, city: data.city }));
        }
      } catch (e) {
        console.log("Could not auto-detect city");
      }
    };
    fetchCity();
  }, []);

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
    if (step === 1) {
      if (!formData.firstName || !formData.lastName) {
        toast.error("Please fill in your name.");
        return;
      }

      const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9\-_%]+\/?/i;
      if (!formData.linkedin || !linkedinRegex.test(formData.linkedin)) {
        toast.error("Please provide a valid LinkedIn Profile URL.");
        return;
      }

      if (!formData.fullBio || formData.fullBio.length < 20) {
        toast.error("Please provide a brief bio (at least 20 characters).");
        return;
      }

      if (formData.userType === 'Entrepreneur' && !formData.companyName) {
        toast.error("Please provide your company name.");
        return;
      }

      const hasValidEdu = formData.educationHistory.some(edu => edu.school.trim() && edu.degree.trim() && edu.year.trim());
      const hasValidExp = formData.experienceHistory.some(exp => exp.company.trim() && exp.role.trim() && exp.year.trim());

      if (!hasValidEdu) {
        toast.error("Please provide at least one complete Academic History record.");
        return;
      }

      if (!hasValidExp) {
        toast.error("Please provide at least one complete Work Experience record.");
        return;
      }
    }
    if (step === 2) {
      if (formData.selectedSkills.length === 0) {
        toast.error("Please select at least one core skill.");
        return;
      }
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
      const res = await saveProfile(user!.id, formData);
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
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (dir: number) => ({ zIndex: 0, x: dir < 0 ? 50 : -50, opacity: 0 })
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center py-12 px-4 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-5xl font-display font-bold mb-4"
          >
            Forge Your <span className="text-primary italic font-accent">Founder Identity</span>
          </motion.h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Complete your profile to unlock the high-fidelity co-founder matching network.
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="flex items-center justify-between mb-10 px-6 max-w-md mx-auto">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  step >= s ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-background border-border text-muted-foreground"
                }`}
              >
                {step > s ? <Check size={20} strokeWidth={3} /> : s}
              </div>
              {s < 3 && (
                <div className="w-12 h-0.5 bg-border mx-2">
                  <motion.div 
                    initial={false}
                    animate={{ width: step > s ? "100%" : "0%" }}
                    className="h-full bg-primary"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-3xl p-8 shadow-2xl relative"
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, type: "tween", ease: "easeInOut" }}
            >
              {/* STEP 1: IDENTITY & HISTORY */}
              {step === 1 && (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-3xl bg-muted overflow-hidden border-2 border-border p-1">
                          {formData.avatarUrl ? (
                            <img src={formData.avatarUrl} className="w-full h-full object-cover rounded-2xl" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-muted-foreground">
                              {formData.firstName[0]}
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-1.5 rounded-xl shadow-lg border-4 border-card">
                          <Check size={14} strokeWidth={4} />
                        </div>
                      </div>
                      <span className="text-[10px] font-bold tracking-widest uppercase text-primary">Identity Synced</span>
                    </div>

                    <div className="flex-1 w-full space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground">First Name</label>
                          <input 
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className="onboarding-input" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Last Name</label>
                          <input 
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className="onboarding-input" 
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground">I am a...</label>
                          <select 
                            value={formData.userType}
                            onChange={(e) => setFormData({...formData, userType: e.target.value as any})}
                            className="onboarding-input"
                          >
                            <option value="Professional">Working Professional</option>
                            <option value="Entrepreneur">Entrepreneur / Founder</option>
                            <option value="Freelancer">Freelancer</option>
                            <option value="Student">Student</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground flex items-center justify-between">
                            Location
                            <span className="text-[10px] text-primary lowercase animate-pulse">Auto-detected</span>
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input 
                              value={formData.city}
                              onChange={(e) => setFormData({...formData, city: e.target.value})}
                              placeholder="e.g. San Francisco"
                              className="onboarding-input pl-10" 
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground">LinkedIn URL <span className="text-primary">*</span></label>
                          <div className="relative">
                            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input 
                              value={formData.linkedin}
                              onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                              placeholder="linkedin.com/in/username"
                              className="onboarding-input pl-10" 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Professional Bio</label>
                        <textarea 
                          value={formData.fullBio}
                          onChange={(e) => setFormData({...formData, fullBio: e.target.value})}
                          placeholder="Tell your story. What are you building? What are you passionate about?"
                          className="onboarding-input min-h-[100px] py-4 resize-none"
                        />
                        <p className="text-[10px] text-muted-foreground italic">Tip: This is the first thing other founders will read about you.</p>
                      </div>

                      {formData.userType === 'Entrepreneur' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl"
                        >
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">Company Details</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[9px] font-bold text-muted-foreground uppercase">Company Name</label>
                              <input 
                                value={formData.companyName}
                                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                placeholder="e.g. QIQ AI"
                                className="onboarding-input-small"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-bold text-muted-foreground uppercase">Stage</label>
                              <select 
                                value={formData.companyStage}
                                onChange={(e) => setFormData({...formData, companyStage: e.target.value})}
                                className="onboarding-input-small"
                              >
                                <option value="Idea">Idea</option>
                                <option value="MVP">MVP</option>
                                <option value="Pre-Seed">Pre-Seed</option>
                                <option value="Seed">Seed</option>
                                <option value="Growth">Growth/Series A+</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-bold text-muted-foreground uppercase">Logo URL</label>
                            <input 
                              value={formData.companyLogo}
                              onChange={(e) => setFormData({...formData, companyLogo: e.target.value})}
                              placeholder="Direct link to logo (SVG/PNG)"
                              className="onboarding-input-small"
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* ACADEMIC HISTORY */}
                  <div className="space-y-4 pt-6 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold tracking-widest uppercase text-primary flex items-center gap-2">
                        <GraduationCap size={18} /> Academic History <span className="text-xs font-normal text-muted-foreground lowercase tracking-normal">(Required)</span>
                      </h3>
                      <button 
                        onClick={addEducation}
                        className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                      >
                        <Plus size={14} /> Add School
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {(formData.educationHistory || []).map((edu, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-3 items-end p-4 bg-muted/20 border border-border/50 rounded-2xl relative group hover:border-primary/30 transition-all">
                          <div className="col-span-4 space-y-1">
                            <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">University / School</label>
                            <input 
                              value={edu.school}
                              onChange={(e) => updateEducation(idx, 'school', e.target.value)}
                              placeholder="e.g. Stanford"
                              className="onboarding-input-small"
                            />
                          </div>
                          <div className="col-span-4 space-y-1">
                            <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">Degree / Field</label>
                            <input 
                              value={edu.degree}
                              onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                              placeholder="e.g. Computer Science"
                              className="onboarding-input-small"
                            />
                          </div>
                          <div className="col-span-3 space-y-1">
                            <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">Year</label>
                            <input 
                              value={edu.year}
                              onChange={(e) => updateEducation(idx, 'year', e.target.value)}
                              placeholder="2018"
                              className="onboarding-input-small"
                            />
                          </div>
                          <div className="col-span-1 pb-1">
                            <button 
                              onClick={() => removeEducation(idx)}
                              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                              title="Remove"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* WORK EXPERIENCE */}
                  <div className="space-y-4 pt-6 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold tracking-widest uppercase text-primary flex items-center gap-2">
                        <Briefcase size={18} /> Work Experience <span className="text-xs font-normal text-muted-foreground lowercase tracking-normal">(Required)</span>
                      </h3>
                      <button 
                        onClick={addExperience}
                        className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                      >
                        <Plus size={14} /> Add Experience
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {(formData.experienceHistory || []).map((exp, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-3 items-end p-4 bg-muted/20 border border-border/50 rounded-2xl relative group hover:border-primary/30 transition-all">
                          <div className="col-span-4 space-y-1">
                            <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">Company / Organization</label>
                            <input 
                              value={exp.company}
                              onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                              placeholder="e.g. Google"
                              className="onboarding-input-small"
                            />
                          </div>
                          <div className="col-span-4 space-y-1">
                            <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">Role / Title</label>
                            <input 
                              value={exp.role}
                              onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                              placeholder="e.g. Sr. Product Manager"
                              className="onboarding-input-small"
                            />
                          </div>
                          <div className="col-span-3 space-y-1">
                            <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">Period</label>
                            <input 
                              value={exp.year}
                              onChange={(e) => updateExperience(idx, 'year', e.target.value)}
                              placeholder="2019 - Present"
                              className="onboarding-input-small"
                            />
                          </div>
                          <div className="col-span-1 pb-1">
                            <button 
                              onClick={() => removeExperience(idx)}
                              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                              title="Remove"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: COMMITMENT & SKILLS */}
              {step === 2 && (
                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                      <Clock size={14} /> Weekly Time Commitment
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {timeOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setFormData({...formData, timeCommitment: opt.id})}
                          className={`p-5 rounded-2xl text-left border-2 transition-all ${
                            formData.timeCommitment === opt.id 
                            ? "bg-primary/10 border-primary shadow-xl shadow-primary/10" 
                            : "bg-background border-border hover:border-primary/30"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border-2 mb-3 flex items-center justify-center ${
                            formData.timeCommitment === opt.id ? "border-primary bg-primary" : "border-muted-foreground"
                          }`}>
                            {formData.timeCommitment === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div className="font-bold text-sm mb-1">{opt.label}</div>
                          <div className="text-[10px] text-muted-foreground">{opt.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                      <Target size={14} /> Your Core Skill Set (Max 3)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map((skill) => {
                        const selected = formData.selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            onClick={() => {
                              if (selected) {
                                setFormData({...formData, selectedSkills: formData.selectedSkills.filter(s => s !== skill)});
                              } else if (formData.selectedSkills.length < 3) {
                                setFormData({...formData, selectedSkills: [...formData.selectedSkills, skill]});
                              } else {
                                toast.warning("Maximum of 3 skills allowed");
                              }
                            }}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${
                              selected 
                              ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                              : "bg-background border-border text-muted-foreground hover:border-primary/40"
                            }`}
                          >
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: PREFERENCES (KEYWORDS) */}
              {step === 3 && (
                <div className="space-y-8">
                  <div className="space-y-6 pt-6 border-t border-border/50">
                    <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                      <Target size={14} /> What do you want to discover?
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setFormData({...formData, discoveryPreference: 'candidates'})}
                        className={`p-6 rounded-2xl border-2 transition-all text-center flex flex-col items-center gap-3 ${
                          formData.discoveryPreference === 'candidates' 
                          ? "bg-primary/10 border-primary shadow-xl shadow-primary/10 text-primary" 
                          : "bg-background border-border text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        <Users size={24} />
                        <div className="font-bold text-sm">Candidates</div>
                        <p className="text-[9px]">Finding Talent / Co-founders</p>
                      </button>
                      <button
                        onClick={() => setFormData({...formData, discoveryPreference: 'companies'})}
                        className={`p-6 rounded-2xl border-2 transition-all text-center flex flex-col items-center gap-3 ${
                          formData.discoveryPreference === 'companies' 
                          ? "bg-primary/10 border-primary shadow-xl shadow-primary/10 text-primary" 
                          : "bg-background border-border text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        <Building size={24} />
                        <div className="font-bold text-sm">Companies</div>
                        <p className="text-[9px]">Finding Projects / Startups</p>
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-6">
                    <div className="text-center space-y-2">
                       <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Interest Keywords</label>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {keywordOptions.map((tag) => {
                        const selected = (formData.idea || "").includes(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => {
                              const current = (formData.idea || "").split(", ").filter(t => t);
                              const updated = selected 
                                ? current.filter(t => t !== tag)
                                : [...current, tag];
                              setFormData({...formData, idea: updated.join(", ")});
                            }}
                            className={`px-4 py-4 rounded-2xl text-xs font-bold transition-all text-center border-2 ${
                              selected 
                              ? "bg-secondary text-secondary-foreground border-secondary shadow-lg shadow-secondary/20" 
                              : "bg-background border-border text-muted-foreground hover:border-secondary/40"
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-8 flex justify-center">
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-12 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-base shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <>Complete Onboarding <Check size={20} strokeWidth={3} /></>}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Navigation Buttons */}
        {step < 3 && (
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-0"
            >
              <ChevronLeft size={18} /> Previous
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
              Continue <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        .onboarding-input {
          width: 100%;
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: 1rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          transition: all 0.2s;
          color: hsl(var(--foreground));
        }
        .onboarding-input:focus {
          outline: none;
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 2px hsla(var(--primary), 0.1);
        }
        .onboarding-input-small {
          width: 100%;
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: 0.75rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          transition: all 0.2s;
          color: hsl(var(--foreground));
        }
        .onboarding-input-small:focus {
          outline: none;
          border-color: hsl(var(--primary));
        }
      `}</style>
    </div>
  );
}
