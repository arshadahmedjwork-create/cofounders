import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function Posts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // form states
  const [title, setTitle] = useState("");
  const [rolesList, setRolesList] = useState<string[]>([]);
  const [roleInput, setRoleInput] = useState("");
  const [desc, setDesc] = useState("");

  const fetchPosts = async () => {
    if (!user) return;
    const { data, error } = await supabase.from("cofounder_posts").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (!error && data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, [user]);

  const handleAddRole = () => {
    if (roleInput.trim() && !rolesList.includes(roleInput.trim())) {
      setRolesList([...rolesList, roleInput.trim()]);
      setRoleInput("");
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setRolesList(rolesList.filter(r => r !== roleToRemove));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (rolesList.length === 0) {
      toast.error("Please add at least one role");
      return;
    }

    const { error } = await supabase.from("cofounder_posts").insert([
      { user_id: user.id, title, role_required: rolesList.join(", "), description: desc }
    ]);
    if (error) { toast.error("Failed to create post"); return; }
    toast.success("Post created!");
    setTitle(""); setRolesList([]); setRoleInput(""); setDesc("");
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
        <h1 className="text-4xl font-display font-bold mb-8">My Posts</h1>
        
        <div className="glass-card rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold mb-6 text-white">Create New Post</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[hsl(218,14%,66%)]">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-[hsl(222,28%,12%)] border border-[hsl(222,22%,20%)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="e.g. Looking for technical co-founder" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[hsl(218,14%,66%)]">Roles Required</label>
              <div className="flex gap-2">
                <input 
                  value={roleInput} 
                  onChange={(e) => setRoleInput(e.target.value)} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRole();
                    }
                  }}
                  className="flex-1 bg-[hsl(222,28%,12%)] border border-[hsl(222,22%,20%)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" 
                  placeholder="e.g. CTO, CFO, Marketing Lead" 
                />
                <button 
                  type="button" 
                  onClick={handleAddRole}
                  className="bg-[hsl(262,75%,60%,0.2)] text-primary font-bold px-6 py-3 rounded-xl hover:bg-[hsl(262,75%,60%,0.3)] transition-colors border border-primary/30"
                >
                  Add
                </button>
              </div>
              {rolesList.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {rolesList.map(r => (
                    <span key={r} className="flex items-center gap-1.5 bg-[hsl(222,28%,16%)] border border-[hsl(222,22%,24%)] px-3 py-1.5 rounded-lg text-sm text-white">
                      {r}
                      <button type="button" onClick={() => handleRemoveRole(r)} className="text-muted-foreground hover:text-red-400 transition-colors">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[hsl(218,14%,66%)]">Description</label>
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} required rows={4} className="w-full bg-[hsl(222,28%,12%)] border border-[hsl(222,22%,20%)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="Describe your vision and what you're looking for..." />
            </div>
            <button type="submit" className="bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors mt-2">Post Now</button>
          </form>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-white">Active Posts</h2>
        {loading ? <p className="text-muted-foreground">Loading...</p> : posts.length === 0 ? <p className="text-muted-foreground">You haven't posted anything yet.</p> : (
          <div className="grid gap-4">
            {posts.map(post => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-xl bg-[hsl(222,28%,12%)] border border-[hsl(222,22%,20%)]">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white">{post.title}</h3>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[hsl(262,75%,60%,0.1)] text-primary uppercase tracking-wider">{post.role_required}</span>
                </div>
                <p className="text-sm text-[hsl(218,14%,66%)]">{post.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
