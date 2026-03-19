import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

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

const lookingFor: Option[] = [
  { label: "Technical (CTO profile)", value: "Technical (CTO profile)" },
  { label: "Business / Operations", value: "Business / Operations" },
  { label: "Product / Design", value: "Product / Design" },
  { label: "Sales / Marketing", value: "Sales / Marketing" },
  { label: "Domain Expert", value: "Domain Expert" },
  { label: "Any", value: "Any" },
];

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProfileModal({ isOpen, onClose }: CreateProfileModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Startup Founder",
    industry: "AI / Machine Learning",
    selectedSkills: [] as string[],
    lookingFor: "Technical (CTO profile)",
    idea: "",
    city: "",
    linkedin: "",
  });

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter(s => s !== skill)
        : [...prev.selectedSkills, skill]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Submit logic here
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm overflow-y-auto"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto z-10"
          >
            <div className="p-6 md:p-8 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-display font-semibold text-foreground mb-2">
                  Create Your <span className="font-accent italic text-primary">Founder Profile</span>
                </h2>
                <p className="text-muted-foreground text-sm">
                  Tell us about yourself and what you're looking for. Takes about 10 minutes.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">First Name</label>
                    <input
                      type="text"
                      placeholder="Jane"
                      value={formData.firstName}
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Email Address</label>
                  <input
                    type="email"
                    placeholder="jane@startup.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">I Am A</label>
                    <div className="relative">
                      <select
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground appearance-none cursor-pointer"
                      >
                        {roles.map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Industry Domain</label>
                    <div className="relative">
                      <select
                        value={formData.industry}
                        onChange={e => setFormData({ ...formData, industry: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground appearance-none cursor-pointer"
                      >
                        {industries.map(i => (
                          <option key={i.value} value={i.value}>{i.label}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Your Core Skills (Select all that apply)</label>
                  <div className="flex flex-wrap gap-x-6 gap-y-3">
                    {skills.map(skill => (
                      <label 
                        key={skill} 
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent default text selection behavior
                          handleSkillToggle(skill);
                        }}
                      >
                        <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${
                          formData.selectedSkills.includes(skill)
                             ? "bg-primary border-primary text-primary-foreground"
                             : "border-border bg-background group-hover:border-primary/50"
                        }`}>
                          {formData.selectedSkills.includes(skill) && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span className="text-xs font-medium text-foreground">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Looking For A Co-Founder Who Is</label>
                  <div className="relative">
                    <select
                      value={formData.lookingFor}
                      onChange={e => setFormData({ ...formData, lookingFor: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground appearance-none cursor-pointer"
                    >
                      {lookingFor.map(l => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Your Startup Idea (Brief Description)</label>
                  <textarea
                    placeholder="Describe your idea, the problem you're solving, and stage you're at..."
                    value={formData.idea}
                    onChange={e => setFormData({ ...formData, idea: e.target.value })}
                    rows={4}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none text-foreground"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">City / Location</label>
                    <input
                      type="text"
                      placeholder="Bangalore, India"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">LinkedIn URL</label>
                    <input
                      type="text"
                      placeholder="linkedin.com/in/jane"
                      value={formData.linkedin}
                      onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-accent text-accent-foreground py-4 rounded-xl text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                  >
                    Create My Profile & Find Matches →
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
