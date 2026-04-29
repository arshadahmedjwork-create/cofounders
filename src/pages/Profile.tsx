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
  Sparkles,
  MapPin
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

  useEffect(() => {
    if (activeTab === 'company' && formData.userType !== 'Entrepreneur') {
      setActiveTab('personal');
    }
  }, [formData.userType, activeTab]);

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
          <p className="text-muted-foreground font-medium">Analyzing Founder DNA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-0 w-full h-[50vh] pointer-events-none overflow-hidden -z-10 opacity-40">
        <div className="absolute top-0 left-[20%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 pt-32 md:pt-40 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 mb-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-[2rem] bg-muted border border-border flex items-center justify-center text-4xl font-bold text-primary shadow-2xl overflow-hidden">
                  {formData.avatarUrl ? (
                    <img src={formData.avatarUrl} className="w-full h-full object-cover" />
                  ) : (
                    formData.firstName[0] || "U"
                  )}
                </div>
                <button className="absolute -bottom-2 -right-2 p-2.5 bg-primary text-primary-foreground rounded-xl shadow-lg hover:scale-110 transition-all">
                  <Sparkles size={16} />
                </button>
              </div>
              
              <div className="text-center md:text-left space-y-2">
                <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">
                  {formData.firstName} {formData.lastName}
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    {formData.userType}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-bold uppercase tracking-widest">
                    <MapPin size={14} className="text-primary" /> {formData.city || 'India'}
                  </span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <Save size={18} /> {isSaving ? "Syncing..." : "Save Profile"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Sidebar Navigation */}
            <div className="md:col-span-3 space-y-2">
              {[
                { id: 'personal', label: 'Identity', icon: User },
                { id: 'professional', label: 'History', icon: Briefcase },
                { id: 'company', label: 'Startup', icon: Building, hide: formData.userType !== 'Entrepreneur' },
                { id: 'preferences', label: 'Discovery', icon: Settings },
              ].filter(t => !t.hide).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all text-sm font-bold ${
                    activeTab === tab.id 
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-inner" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  <tab.icon size={18} /> {tab.label}
                </button>
              ))}
            </div>

            {/* Main Form Area */}
            <div className="md:col-span-9 bg-card border border-border shadow-xl rounded-[2.5rem] p-8 md:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* PERSONAL TAB */}
                  {activeTab === 'personal' && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">First Name</label>
                          <input 
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className="onboarding-input" 
                          />
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Last Name</label>
                          <input 
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className="onboarding-input" 
                          />
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Current Role / Title</label>
                          <input 
                            value={formData.work}
                            onChange={(e) => setFormData({...formData, work: e.target.value})}
                            placeholder="e.g. Product Designer @ Google"
                            className="onboarding-input" 
                          />
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Location</label>
                          <input 
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            className="onboarding-input" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Professional Bio</label>
                        <textarea 
                          value={formData.fullBio}
                          onChange={(e) => setFormData({...formData, fullBio: e.target.value})}
                          className="onboarding-input min-h-[200px] py-5 leading-relaxed"
                          placeholder="Tell your founder story..."
                        />
                      </div>
                    </div>
                  )}

                  {/* PROFESSIONAL TAB */}
                  {activeTab === 'professional' && (
                    <div className="space-y-12">
                       <section className="space-y-6">
                          <div className="flex items-center justify-between border-b border-border pb-4">
                            <h3 className="text-xl font-bold flex items-center gap-3 font-display">
                              <Briefcase className="text-primary" size={20} /> Work Experience
                            </h3>
                            <button 
                              onClick={() => setFormData(prev => ({...prev, experienceHistory: [...(prev.experienceHistory || []), { company: "", role: "", year: "" }]}))}
                              className="p-2.5 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all"
                            >
                              <Plus size={20} />
                            </button>
                          </div>
                          
                          <div className="space-y-6">
                            {formData.experienceHistory?.map((exp, idx) => (
                              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 bg-muted/20 rounded-3xl border border-border/50 group relative">
                                <div className="md:col-span-4 space-y-1.5">
                                  <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">Company</label>
                                  <input value={exp.company} onChange={(e) => {
                                    const newList = [...(formData.experienceHistory || [])];
                                    newList[idx].company = e.target.value;
                                    setFormData({...formData, experienceHistory: newList});
                                  }} className="onboarding-input-small" />
                                </div>
                                <div className="md:col-span-5 space-y-1.5">
                                  <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">Role</label>
                                  <input value={exp.role} onChange={(e) => {
                                    const newList = [...(formData.experienceHistory || [])];
                                    newList[idx].role = e.target.value;
                                    setFormData({...formData, experienceHistory: newList});
                                  }} className="onboarding-input-small" />
                                </div>
                                <div className="md:col-span-3 flex gap-2 items-end">
                                  <div className="flex-grow space-y-1.5">
                                    <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">Year</label>
                                    <input 
                                      value={exp.year} 
                                      type="text"
                                      inputMode="numeric"
                                      onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                        const newList = [...(formData.experienceHistory || [])];
                                        newList[idx] = { ...newList[idx], year: val };
                                        setFormData({...formData, experienceHistory: newList});
                                      }} 
                                      className="onboarding-input-small" 
                                      placeholder="YYYY"
                                    />
                                  </div>
                                  <button onClick={() => setFormData(prev => ({...prev, experienceHistory: (prev.experienceHistory || []).filter((_, i) => i !== idx)}))} className="p-2.5 mb-0.5 text-muted-foreground hover:text-destructive transition-colors">
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                       </section>

                       <section className="space-y-6">
                          <div className="flex items-center justify-between border-b border-border pb-4">
                            <h3 className="text-xl font-bold flex items-center gap-3 font-display">
                              <GraduationCap className="text-primary" size={20} /> Education
                            </h3>
                            <button 
                              onClick={() => setFormData(prev => ({...prev, educationHistory: [...(prev.educationHistory || []), { school: "", degree: "", year: "" }]}))}
                              className="p-2.5 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all"
                            >
                              <Plus size={20} />
                            </button>
                          </div>
                          
                          <div className="space-y-6">
                            {formData.educationHistory?.map((edu, idx) => (
                              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 bg-muted/20 rounded-3xl border border-border/50 group relative">
                                <div className="md:col-span-4 space-y-1.5">
                                  <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">School</label>
                                  <input value={edu.school} onChange={(e) => {
                                    const newList = [...(formData.educationHistory || [])];
                                    newList[idx].school = e.target.value;
                                    setFormData({...formData, educationHistory: newList});
                                  }} className="onboarding-input-small" />
                                </div>
                                <div className="md:col-span-5 space-y-1.5">
                                  <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">Degree</label>
                                  <input value={edu.degree} onChange={(e) => {
                                    const newList = [...(formData.educationHistory || [])];
                                    newList[idx].degree = e.target.value;
                                    setFormData({...formData, educationHistory: newList});
                                  }} className="onboarding-input-small" />
                                </div>
                                <div className="md:col-span-3 flex gap-2 items-end">
                                  <div className="flex-grow space-y-1.5">
                                    <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">Year</label>
                                    <input 
                                      value={edu.year} 
                                      type="text"
                                      inputMode="numeric"
                                      onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                        const newList = [...(formData.educationHistory || [])];
                                        newList[idx] = { ...newList[idx], year: val };
                                        setFormData({...formData, educationHistory: newList});
                                      }} 
                                      className="onboarding-input-small" 
                                      placeholder="YYYY"
                                    />
                                  </div>
                                  <button onClick={() => setFormData(prev => ({...prev, educationHistory: (prev.educationHistory || []).filter((_, i) => i !== idx)}))} className="p-2.5 mb-0.5 text-muted-foreground hover:text-destructive transition-colors">
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                       </section>
                    </div>
                  )}

                  {/* COMPANY TAB */}
                  {activeTab === 'company' && (
                    <div className="space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2.5">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Company Name</label>
                            <input 
                              value={formData.companyName}
                              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                              placeholder="e.g. QIQ AI"
                              className="onboarding-input"
                            />
                          </div>
                          <div className="space-y-2.5">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Current Stage</label>
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
                        <div className="space-y-2.5">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">One-line Pitch</label>
                          <textarea 
                            value={formData.companyDescription}
                            onChange={(e) => setFormData({...formData, companyDescription: e.target.value})}
                            placeholder="What problem are you solving? Who is it for?"
                            className="onboarding-input min-h-[120px] py-4"
                          />
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Startup Logo URL</label>
                          <input 
                            value={formData.companyLogo}
                            onChange={(e) => setFormData({...formData, companyLogo: e.target.value})}
                            placeholder="Direct link to logo (SVG/PNG/JPG)"
                            className="onboarding-input"
                          />
                        </div>
                    </div>
                  )}

                  {/* PREFERENCES TAB */}
                  {activeTab === 'preferences' && (
                    <div className="space-y-10">
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-3 font-display">
                          <Target className="text-primary" size={22} /> Discovery Mode
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { id: 'candidates', label: 'Talent Network', desc: 'Discover individual talent and potential co-founders' },
                            { id: 'companies', label: 'Venture Network', desc: 'Discover high-potential startups and projects' }
                          ].map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => setFormData({...formData, discoveryPreference: opt.id as any})}
                              className={`p-6 rounded-3xl border transition-all text-left group ${
                                formData.discoveryPreference === opt.id 
                                ? "bg-primary/10 border-primary/40 shadow-lg shadow-primary/5" 
                                : "bg-muted/20 border-border hover:border-primary/30"
                              }`}
                            >
                              <div className={`font-bold text-lg mb-1 transition-colors ${formData.discoveryPreference === opt.id ? 'text-primary' : ''}`}>{opt.label}</div>
                              <p className="text-xs text-muted-foreground leading-relaxed">{opt.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-3 font-display">
                          <Linkedin className="text-primary" size={22} /> Social Integration
                        </h3>
                        <div className="space-y-2.5">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">LinkedIn Profile URL</label>
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
    </div>
  );
}
