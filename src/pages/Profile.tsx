import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { UserProfile, EducationItem, ExperienceItem } from "@/types/profile";
import { saveProfile, getProfileById } from "@/services/profileService";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Settings, 
  Save, 
  Linkedin, 
  Plus, 
  Trash2, 
  Building,
  Target,
  Sparkles
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'company' | 'preferences'>('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
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
    educationHistory: [],
    experienceHistory: [],
    userType: "Professional",
    fullBio: "",
    discoveryPreference: "candidates",
    companyName: "",
    companyStage: "Idea",
    companyDescription: "",
    companyLogo: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const myProfile = await getProfileById(user.id);
        
        if (myProfile) {
          const names = myProfile.name.split(" ");
          setFormData({
            firstName: names[0] || "",
            lastName: names.slice(1).join(" ") || "",
            email: user.email || "",
            role: myProfile.role,
            industry: myProfile.domain,
            selectedSkills: myProfile.tags,
            lookingFor: myProfile.lookingFor,
            idea: "", // Re-mapped if needed
            city: myProfile.location,
            linkedin: myProfile.linkedin || "",
            avatarUrl: myProfile.avatarUrl || "",
            experience: myProfile.bio.substring(0, 100),
            work: myProfile.work,
            timeCommitment: myProfile.timeCommitment,
            educationHistory: myProfile.educationHistory || [],
            experienceHistory: myProfile.experienceHistory || [],
            userType: myProfile.userType as any || "Professional",
            fullBio: myProfile.bio,
            discoveryPreference: myProfile.discoveryPreference as any || "candidates",
            companyName: myProfile.companyName || "",
            companyStage: myProfile.stage || "Idea",
            companyDescription: myProfile.companyDescription || "",
            companyLogo: myProfile.companyLogo || "",
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const res = await saveProfile(user.id, formData);
      if (res.success) {
        toast.success("Profile updated successfully! ✨");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium">Syncing with Synapse™...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-3xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-4xl font-bold text-primary shadow-xl overflow-hidden relative group">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} className="w-full h-full object-cover" />
                ) : (
                  formData.firstName[0] || "U"
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Sparkles size={20} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold">{formData.firstName} {formData.lastName}</h1>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <span className="text-primary font-bold">{formData.userType}</span> • {formData.city}
                </p>
              </div>
            </div>
            
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <Save size={18} /> {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="flex border-b border-border/50 mb-8 overflow-x-auto no-scrollbar">
            {[
              { id: 'personal', label: 'Identity', icon: User },
              { id: 'professional', label: 'History', icon: Briefcase },
              { id: 'company', label: 'Startup', icon: Building },
              { id: 'preferences', label: 'Discovery', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all text-sm font-bold whitespace-nowrap ${
                  activeTab === tab.id 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="glass-card rounded-3xl p-8 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* PERSONAL TAB */}
                {activeTab === 'personal' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">First Name</label>
                        <input 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="onboarding-input" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Last Name</label>
                        <input 
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="onboarding-input" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">User Type</label>
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
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Location</label>
                        <input 
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className="onboarding-input" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                        Long-form Biography
                        <span className="text-[10px] text-primary">{formData.fullBio?.length || 0} characters</span>
                      </label>
                      <textarea 
                        value={formData.fullBio}
                        onChange={(e) => setFormData({...formData, fullBio: e.target.value})}
                        className="onboarding-input min-h-[200px] py-4"
                        placeholder="Tell your story..."
                      />
                    </div>
                  </div>
                )}

                {/* PROFESSIONAL TAB */}
                {activeTab === 'professional' && (
                  <div className="space-y-12">
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold flex items-center gap-2">
                            <Briefcase className="text-primary" size={20} /> Work Experience
                          </h3>
                          <button 
                            onClick={() => setFormData(prev => ({...prev, experienceHistory: [...(prev.experienceHistory || []), { company: "", role: "", year: "" }]}))}
                            className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                        <div className="space-y-4">
                          {formData.experienceHistory?.map((exp, idx) => (
                            <div key={idx} className="grid grid-cols-12 gap-3 p-4 bg-muted/30 rounded-2xl border border-border/50 items-end">
                              <div className="col-span-5 md:col-span-4 space-y-1 text-left">
                                <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">Company</label>
                                <input value={exp.company} onChange={(e) => {
                                  const newList = [...(formData.experienceHistory || [])];
                                  newList[idx].company = e.target.value;
                                  setFormData({...formData, experienceHistory: newList});
                                }} className="onboarding-input-small" />
                              </div>
                              <div className="col-span-4 md:col-span-5 space-y-1 text-left">
                                <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">Role</label>
                                <input value={exp.role} onChange={(e) => {
                                  const newList = [...(formData.experienceHistory || [])];
                                  newList[idx].role = e.target.value;
                                  setFormData({...formData, experienceHistory: newList});
                                }} className="onboarding-input-small" />
                              </div>
                              <div className="col-span-2 space-y-1 text-left">
                                <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">Year</label>
                                <input value={exp.year} onChange={(e) => {
                                  const newList = [...(formData.experienceHistory || [])];
                                  newList[idx].year = e.target.value;
                                  setFormData({...formData, experienceHistory: newList});
                                }} className="onboarding-input-small" />
                              </div>
                              <div className="col-span-1 pb-1">
                                <button onClick={() => setFormData(prev => ({...prev, experienceHistory: (prev.experienceHistory || []).filter((_, i) => i !== idx)}))} className="p-2 text-muted-foreground hover:text-destructive">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold flex items-center gap-2">
                            <GraduationCap className="text-secondary" size={20} /> Academic History
                          </h3>
                          <button 
                            onClick={() => setFormData(prev => ({...prev, educationHistory: [...(prev.educationHistory || []), { school: "", degree: "", year: "" }]}))}
                            className="p-2 bg-secondary/10 text-secondary rounded-xl hover:bg-secondary/20 transition-all"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                        <div className="space-y-4">
                          {formData.educationHistory?.map((edu, idx) => (
                            <div key={idx} className="grid grid-cols-12 gap-3 p-4 bg-muted/30 rounded-2xl border border-border/50 items-end">
                              <div className="col-span-5 md:col-span-4 space-y-1 text-left">
                                <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">School</label>
                                <input value={edu.school} onChange={(e) => {
                                  const newList = [...(formData.educationHistory || [])];
                                  newList[idx].school = e.target.value;
                                  setFormData({...formData, educationHistory: newList});
                                }} className="onboarding-input-small" />
                              </div>
                              <div className="col-span-4 md:col-span-5 space-y-1 text-left">
                                <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">Degree</label>
                                <input value={edu.degree} onChange={(e) => {
                                  const newList = [...(formData.educationHistory || [])];
                                  newList[idx].degree = e.target.value;
                                  setFormData({...formData, educationHistory: newList});
                                }} className="onboarding-input-small" />
                              </div>
                              <div className="col-span-2 space-y-1 text-left">
                                <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">Year</label>
                                <input value={edu.year} onChange={(e) => {
                                  const newList = [...(formData.educationHistory || [])];
                                  newList[idx].year = e.target.value;
                                  setFormData({...formData, educationHistory: newList});
                                }} className="onboarding-input-small" />
                              </div>
                              <div className="col-span-1 pb-1">
                                <button onClick={() => setFormData(prev => ({...prev, educationHistory: (prev.educationHistory || []).filter((_, i) => i !== idx)}))} className="p-2 text-muted-foreground hover:text-destructive">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                     </div>
                  </div>
                )}

                {/* COMPANY TAB */}
                {activeTab === 'company' && (
                  <div className="space-y-8">
                    <div className="p-8 bg-primary/5 border border-primary/20 rounded-3xl space-y-8 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-20"><Building size={80} /></div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                          <div className="space-y-2 text-left">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Company / Startup Name</label>
                            <input 
                              value={formData.companyName}
                              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                              placeholder="e.g. QIQ AI"
                              className="onboarding-input"
                            />
                          </div>
                          <div className="space-y-2 text-left">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Stage</label>
                            <select 
                              value={formData.companyStage}
                              onChange={(e) => setFormData({...formData, companyStage: e.target.value})}
                              className="onboarding-input"
                            >
                              <option value="Idea">Idea Phase</option>
                              <option value="MVP">MVP / Prototype</option>
                              <option value="Pre-Seed">Pre-Seed</option>
                              <option value="Seed">Seed Round</option>
                              <option value="Growth">Growth / Series A+</option>
                            </select>
                          </div>
                       </div>
                        <div className="space-y-4 relative z-10 text-left">
                           <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">One-line Pitch / Mission</label>
                              <textarea 
                                value={formData.companyDescription}
                                onChange={(e) => setFormData({...formData, companyDescription: e.target.value})}
                                placeholder="What problem are you solving? Who is it for?"
                                className="onboarding-input min-h-[120px] py-4"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Startup Logo URL</label>
                              <input 
                                value={formData.companyLogo}
                                onChange={(e) => setFormData({...formData, companyLogo: e.target.value})}
                                placeholder="Direct link to logo (SVG/PNG/JPG)"
                                className="onboarding-input"
                              />
                           </div>
                        </div>
                    </div>
                  </div>
                )}

                {/* PREFERENCES TAB */}
                {activeTab === 'preferences' && (
                  <div className="space-y-10">
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Target className="text-primary" size={20} /> Discovery Mode
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { id: 'candidates', label: 'Candidates', desc: 'Discover individual talent and potential co-founders' },
                          { id: 'companies', label: 'Companies', desc: 'Discover high-potential startups and projects' }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setFormData({...formData, discoveryPreference: opt.id as any})}
                            className={`p-6 rounded-3xl border-2 transition-all text-left ${
                              formData.discoveryPreference === opt.id 
                              ? "bg-primary/10 border-primary shadow-xl shadow-primary/5" 
                              : "bg-muted/30 border-border hover:border-primary/30"
                            }`}
                          >
                            <div className="font-bold text-base mb-1">{opt.label}</div>
                            <p className="text-xs text-muted-foreground">{opt.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Settings className="text-secondary" size={20} /> Account & Social
                      </h3>
                      <div className="space-y-2 text-left">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Linkedin size={14} /> Profile URL
                        </label>
                        <input 
                          value={formData.linkedin}
                          onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                          placeholder="linkedin.com/in/username"
                          className="onboarding-input"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
