import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import ProfileCard from "@/components/ProfileCard";
import { ProfileCardSkeleton } from "@/components/ProfileCardSkeleton";
import Footer from "@/components/landing/Footer";
import { getProfiles } from "@/services/profileService";
import { getPosts } from "@/services/postService";
import { useQuery } from "@tanstack/react-query";
import { Users, Building, Rocket, Package, Layers, MapPin, Search } from "lucide-react";
import ProfileModal from "@/components/ProfileModal";
import OpportunityModal from "@/components/OpportunityModal";
import SynapsePrompt from "@/components/SynapsePrompt";
import { Profile } from "@/data/profiles";
import { FounderPost } from "@/types/post";
import OpportunityCard from "@/components/OpportunityCard";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getProfileById } from "@/services/profileService";
import { sendConnectionRequest } from "@/services/connectionService";
import { useEffect } from "react";
import { calculateMatchScore } from "@/lib/matching";

const roleFilters = ["All", "Founders", "Freelancers", "Operators"];

export default function BrowseProfiles() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [discoveryMode, setDiscoveryMode] = useState<'candidates' | 'companies'>('candidates');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [selectedPost, setSelectedPost] = useState<FounderPost | null>(null);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const { user } = useAuth();

  // Fetch co-founder profiles
  const { data: profiles = [], isLoading: profilesLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: getProfiles,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch co-founder opportunity posts
  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    staleTime: 1000 * 60 * 1,
  });

  const isLoading = profilesLoading || postsLoading;

  useEffect(() => {
    const loadCurrentProfile = async () => {
      if (user) {
        const p = await getProfileById(user.id);
        setCurrentProfile(p);
        if (p?.discoveryPreference) {
          setDiscoveryMode(p.discoveryPreference);
        }
      }
    };
    loadCurrentProfile();
  }, [user]);


  // Compute filtered profiles
  const filteredProfiles = useMemo(() => {
    return (profiles || [])
      .filter((p) => p.id !== user?.id) // Exclude current user
      .map(p => {
        // Dynamically calculate match score if current user profile is available
        const score = currentProfile ? calculateMatchScore(currentProfile as any, p) : p.matchPercent;
        return { ...p, matchPercent: score };
      })
      .filter((p) => {
        const s = search.toLowerCase();
        const matchesSearch = !search || 
          p.name?.toLowerCase().includes(s) || 
          (p.tags || []).some(t => t?.toLowerCase().includes(s)) || 
          p.domain?.toLowerCase().includes(s);

        const matchesRole = roleFilter === "All" ||
          (roleFilter === "Founders" && (p.role.toLowerCase().includes("founder") || p.role.toLowerCase().includes("entrepreneur"))) ||
          (roleFilter === "Freelancers" && p.role.toLowerCase().includes("freelance")) ||
          (roleFilter === "Operators" && p.role.toLowerCase().includes("operator"));

        return matchesSearch && matchesRole;
      })
      .sort((a, b) => b.matchPercent - a.matchPercent); // Sort by highest match
  }, [profiles, search, roleFilter, user?.id, currentProfile]);

  // Compute filtered posts
  const filteredPosts = useMemo(() => {
    return (posts || [])
      .filter((p) => p.userId !== user?.id) // Exclude current user's own posts
      .filter((p) => {
        const s = search.toLowerCase();
        return !search || 
          p.title.toLowerCase().includes(s) || 
          p.companyName.toLowerCase().includes(s) || 
          p.roles.some(r => r.toLowerCase().includes(s));
      });
  }, [posts, search, user?.id]);

  const handleConnectPost = async (post: FounderPost) => {
    if (!user || !currentProfile) {
      toast.error("Please complete your profile first.");
      return;
    }

    if (user.id === post.userId) {
      toast.error("This is your own broadcast!");
      return;
    }

    try {
      const res = await sendConnectionRequest(
        user.id,
        post.userId,
        post.id,
        currentProfile.name,
        post.userName || 'Founder',
        post.userEmail || '',
        post.roles[0] || 'Co-founder',
        post.title
      );

      if (res.success) {
        toast.success("Interest sent to the founder! 🚀");
        setSelectedPost(null);
      } else {
        toast.error("Failed to connect: " + res.error);
      }
    } catch (err) {
      toast.error("An error occurred during matching.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-32 md:pt-40 pb-20">
        <div className="container mx-auto px-4">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-10"
          >
            <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-3 leading-tight">
              Explore the <span className="font-accent italic text-primary">Network</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">High-fidelity connections for your startup journey</p>
          </motion.div>

          <SynapsePrompt />

          {/* Discovery Selector - DEPRECATED: Based on candidate preference now */}
          {/* 
          <div className="flex justify-center mb-12 mt-4">
            <div className="inline-flex p-1.5 bg-card border border-border rounded-2xl shadow-xl shadow-primary/5">
              ...
            </div>
          </div>
          */}

          {/* Search & filters */}
          <div className="max-w-4xl mx-auto mb-10 mt-6 space-y-4">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={discoveryMode === 'candidates' ? "Search for talent, skills, or founders..." : "Search for startups, industries, or companies..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="onboarding-input py-3 pl-11 shadow-inner bg-secondary/20 w-full"
              />
            </div>
            {discoveryMode === 'candidates' && (
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {roleFilters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setRoleFilter(f)}
                    className={`px-3 md:px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                      roleFilter === f 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-card text-muted-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Market Grid Content */}
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProfileCardSkeleton key={i} />
                ))}
              </div>
            ) : discoveryMode === 'candidates' ? (
              filteredProfiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProfiles.map((p) => (
                    <ProfileCard 
                      key={p.id} 
                      profile={p} 
                      onConnect={() => setSelectedProfile(p)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 px-4">
                  <Search size={40} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                  <h3 className="text-lg font-bold">No candidates found</h3>
                  <p className="text-sm text-muted-foreground">Try broadening your search criteria.</p>
                </div>
              )
            ) : (
              filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post, i) => (
                    <OpportunityCard 
                      key={post.id} 
                      post={post}
                      index={i}
                      onView={() => setSelectedPost(post)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 px-4">
                  <Rocket size={40} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                  <h3 className="text-lg font-bold">No opportunities broadcasted yet</h3>
                  <p className="text-sm text-muted-foreground mb-6">Be the first to list a role and find your partner.</p>
                  <button 
                    onClick={() => window.location.href = '/posts'}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                  >
                    Broadcast Opportunity
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <Footer />

      <ProfileModal 
        profile={selectedProfile}
        onClose={() => setSelectedProfile(null)}
        onConnect={(p) => {
          setSelectedProfile(null);
          toast.success(`Connection request sent to ${p.name}!`);
        }}
      />

      <OpportunityModal 
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onConnect={handleConnectPost}
      />
    </div>
  );
}
