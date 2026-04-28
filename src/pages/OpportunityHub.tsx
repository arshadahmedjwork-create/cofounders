import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { getProfileById } from "@/services/profileService";
import { createPost, getPosts } from "@/services/postService";
import { FounderPost } from "@/types/post";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  Rocket, 
  Building, 
  Target, 
  Plus, 
  Trash2, 
  FileText, 
  Package,
  Layers,
  ArrowRight,
  Linkedin,
  Clock,
  LayoutDashboard,
  Megaphone
} from "lucide-react";

export default function Posts() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myPosts, setMyPosts] = useState<FounderPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [roleInput, setRoleInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    roles: [] as string[],
    package: "",
    companyName: "",
    companyLogo: "",
    companyLinkedin: "",
  });

  const fetchMyPosts = async () => {
    if (!user) return;
    setIsLoadingPosts(true);
    try {
      const { data, error } = await supabase
        .from("cofounder_posts")
        .select(`
          *,
          user_profiles!user_id (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setMyPosts((data || []).map(row => ({
        id: row.id,
        userId: row.user_id,
        title: row.title,
        roles: Array.isArray(row.roles) ? row.roles : (typeof row.roles === 'string' ? JSON.parse(row.roles) : []),
        description: row.description,
        package: row.package,
        companyName: row.company_name,
        companyLogo: row.company_logo,
        companyLinkedin: row.company_linkedin,
        createdAt: row.created_at,
        userName: `${row.user_profiles?.first_name || ''} ${row.user_profiles?.last_name || ''}`.trim(),
        userAvatar: row.user_profiles?.avatar_url,
      })));
    } catch (error) {
      console.error("Error fetching my posts:", error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    const loadAutofill = async () => {
      if (!user) return;
      const profile = await getProfileById(user.id);
      if (profile) {
        setFormData(prev => ({
          ...prev,
          companyName: profile.companyName || "",
          description: profile.companyDescription || profile.bio || "",
          companyLogo: profile.avatarUrl || "",
          companyLinkedin: profile.linkedin || "",
          title: profile.companyName ? `Looking for co-founder for ${profile.companyName}` : "Looking for technical co-founder",
        }));
      }
    };
    loadAutofill();
    fetchMyPosts();
  }, [user]);

  const addRole = () => {
    if (roleInput.trim() && !formData.roles.includes(roleInput.trim())) {
      setFormData(prev => ({ ...prev, roles: [...prev.roles, roleInput.trim()] }));
      setRoleInput("");
    }
  };

  const removeRole = (role: string) => {
    setFormData(prev => ({ ...prev, roles: prev.roles.filter(r => r !== role) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.title || !formData.description || formData.roles.length === 0) {
      toast.error("Please fill in title, description and at least one role.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createPost({
        userId: user.id,
        ...formData,
      });

      if (res.success) {
        toast.success("Broadcast successful! 🚀");
        setFormData(prev => ({ ...prev, title: "", roles: [], package: "" }));
        fetchMyPosts();
        setActiveTab('manage');
      } else {
        toast.error("Failed to post: " + res.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to remove this broadcast?")) return;
    
    try {
      const { error } = await supabase
        .from("cofounder_posts")
        .delete()
        .eq("id", postId);
      
      if (error) throw error;
      
      toast.success("Broadcast removed.");
      setMyPosts(prev => prev.filter(p => p.id !== postId));
    } catch (error) {
      toast.error("Failed to delete post.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navbar />
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10 opacity-30">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[130px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-secondary/20 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 pt-32 md:pt-40 pb-20">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 md:mb-12">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 leading-tight">Opportunity <span className="text-primary italic font-accent">Hub</span></h1>
              <p className="text-sm md:text-base text-muted-foreground">Broadcast missions and manage co-founder listings.</p>
            </div>
            
            <div className="flex w-full md:w-auto bg-card/50 backdrop-blur-md border border-border p-1 rounded-2xl self-center md:self-start">
              <button 
                onClick={() => setActiveTab('create')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-bold transition-all ${activeTab === 'create' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Megaphone size={16} className="shrink-0" /> Broadcast
              </button>
              <button 
                onClick={() => setActiveTab('manage')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-bold transition-all ${activeTab === 'manage' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <LayoutDashboard size={16} className="shrink-0" /> Manage ({myPosts.length})
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'create' ? (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <form onSubmit={handleSubmit} className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-2xl space-y-8 md:space-y-10">
                  <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-10">
                    <div className="space-y-6 md:space-y-8">
                      {/* Title */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <FileText size={14} className="text-primary" /> Post Title
                        </label>
                        <input 
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="e.g. Looking for technical co-founder"
                          className="onboarding-input"
                        />
                      </div>

                      {/* Roles */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Layers size={14} className="text-primary" /> Roles Required
                        </label>
                        <div className="flex gap-2">
                          <input 
                            value={roleInput}
                            onChange={(e) => setRoleInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
                            placeholder="e.g. CTO, CFO..."
                            className="onboarding-input"
                          />
                          <button type="button" onClick={addRole} className="p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors shrink-0">
                            <Plus size={20} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.roles.map(r => (
                            <span key={r} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-[9px] md:text-[10px] font-bold text-primary">
                              {r} <button type="button" onClick={() => removeRole(r)}><Trash2 size={12} /></button>
                            </span>
                          ))}
                        </div>
                      </div>

                       {/* Offering */}
                       <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Package size={14} className="text-primary" /> Package Offering
                        </label>
                        <input 
                          value={formData.package}
                          onChange={(e) => setFormData({...formData, package: e.target.value})}
                          placeholder="e.g. 15% Equity, 5% + Stipend"
                          className="onboarding-input"
                        />
                      </div>
                    </div>

                    <div className="space-y-6 md:space-y-8 text-left">
                       {/* Company Info */}
                       <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Building size={14} className="text-primary" /> Startup Details
                        </label>
                        <div className="space-y-4 p-4 md:p-5 bg-card/40 border border-border rounded-2xl">
                          <input 
                            value={formData.companyName}
                            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                            placeholder="Company Name"
                            className="onboarding-input-small"
                          />
                          <div className="flex flex-col gap-4">
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                              <input 
                                value={formData.companyLogo}
                                onChange={(e) => setFormData({...formData, companyLogo: e.target.value})}
                                placeholder="Logo URL (optional)"
                                className="onboarding-input-small !pl-10"
                              />
                            </div>
                            <div className="relative">
                              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                              <input 
                                value={formData.companyLinkedin}
                                onChange={(e) => setFormData({...formData, companyLinkedin: e.target.value})}
                                placeholder="Company LinkedIn"
                                className="onboarding-input-small !pl-10"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Vision */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Target size={14} className="text-primary" /> Opportunity Vision
                        </label>
                        <textarea 
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder="Describe your vision and what you're looking for in a partner..."
                          className="onboarding-input min-h-[140px] md:min-h-[160px] py-4"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 md:pt-10 border-t border-border/50">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-3 py-4 md:py-5 bg-primary text-primary-foreground rounded-2xl font-bold text-base md:text-lg shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? "Broadcasting..." : "Broadcast Opportunity"} <ArrowRight size={20} />
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="manage"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {isLoadingPosts ? (
                  <div className="grid gap-6">
                    {[1, 2].map(i => (
                      <div key={i} className="h-40 bg-card/50 animate-pulse rounded-[2rem] border border-border" />
                    ))}
                  </div>
                ) : myPosts.length === 0 ? (
                  <div className="text-center py-16 md:py-20 bg-card/30 rounded-[2rem] md:rounded-[3rem] border border-border/50 dashed px-6">
                    <LayoutDashboard size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg md:text-xl font-bold text-muted-foreground">No active broadcasts</h3>
                    <p className="text-sm text-muted-foreground/70 mb-8 max-w-xs mx-auto">You haven't shared any co-founder opportunities yet.</p>
                    <button 
                      onClick={() => setActiveTab('create')}
                      className="w-full md:w-auto px-8 py-3.5 bg-primary/10 text-primary rounded-xl font-bold border border-primary/20 hover:bg-primary/20 transition-all font-display"
                    >
                      Start First Broadcast
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:gap-6">
                    {myPosts.map(post => (
                      <div key={post.id} className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-primary/40 transition-all border-primary/10 text-left">
                        <div className="flex-1 overflow-hidden">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                             <h3 className="text-lg md:text-xl font-bold text-foreground leading-tight">{post.title}</h3>
                             <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.15em] text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                               {post.companyName}
                             </span>
                          </div>
                          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 max-w-2xl mb-5 opacity-80 leading-relaxed font-medium">
                            {post.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card/40 border border-border/50 text-[9px] font-bold uppercase text-muted-foreground">
                               <Package size={14} className="text-primary" /> {post.package || 'TBD'}
                             </div>
                             {post.roles.slice(0, 2).map(r => (
                               <span key={r} className="px-3 py-1.5 rounded-xl bg-card/40 border border-border/50 text-[9px] font-bold uppercase text-primary/70">{r}</span>
                             ))}
                             {post.roles.length > 2 && <span className="px-3 py-1.5 rounded-xl bg-card/40 border border-border/50 text-[9px] font-bold uppercase text-muted-foreground">+{post.roles.length - 2}</span>}
                             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card/40 border border-border/50 text-[9px] font-bold uppercase text-muted-foreground">
                               <Clock size={14} className="text-primary/60" /> {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                             </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full md:w-auto">
                           <button 
                            className="flex-1 md:flex-none flex items-center justify-center p-4 rounded-2xl bg-muted/50 hover:bg-muted text-muted-foreground transition-all border border-border/50"
                            onClick={() => toast.info("Edit feature coming soon!")}
                           >
                             <FileText size={18} />
                           </button>
                           <button 
                            onClick={() => handleDelete(post.id)}
                            className="flex-1 md:flex-none flex items-center justify-center p-4 rounded-2xl bg-destructive/10 hover:bg-destructive/20 text-destructive transition-all border border-destructive/20"
                           >
                             <Trash2 size={18} />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
