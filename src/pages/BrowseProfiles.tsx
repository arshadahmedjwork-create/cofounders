import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProfileCard from "@/components/ProfileCard";
import { ProfileCardSkeleton } from "@/components/ProfileCardSkeleton";
import Footer from "@/components/landing/Footer";
import { getProfiles } from "@/services/profileService";
import { useQuery } from "@tanstack/react-query";

const roleFilters = ["All", "Founders", "Freelancers", "Operators"];
const domainFilters = ["All Domains", "AI / ML", "FinTech", "HealthTech", "SaaS / B2B", "D2C / Consumer", "Climate Tech"];

export default function BrowseProfiles() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [domainFilter, setDomainFilter] = useState("All Domains");

  // useQuery handles caching, loading states, and fast retrieval automatically
  const { data: profiles = [], isLoading, isError } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const data = await getProfiles();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });

  const filtered = useMemo(() => {
    if (!Array.isArray(profiles)) return [];
    
    return profiles.filter((p) => {
      if (!p) return false;
      const s = search.toLowerCase();
      const pName = p.name?.toLowerCase() || "";
      const pDomain = p.domain?.toLowerCase() || "";
      const pRole = p.role?.toLowerCase() || "";
      
      const matchesSearch = !search || 
        pName.includes(s) || 
        (p.tags || []).some(t => t?.toLowerCase().includes(s)) || 
        pDomain.includes(s);

      const matchesRole = roleFilter === "All" ||
        (roleFilter === "Founders" && (pRole.includes("founder") || pRole.includes("entrepreneur"))) ||
        (roleFilter === "Freelancers" && pRole.includes("freelance")) ||
        (roleFilter === "Operators" && pRole.includes("operator"));
        
      const matchesDomain = domainFilter === "All Domains" || p.domain === domainFilter;
      
      return matchesSearch && matchesRole && matchesDomain;
    });
  }, [profiles, search, roleFilter, domainFilter]);

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-foreground mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">We couldn't load the profiles right now.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-primary text-white rounded-lg font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-3">
              Browse <span className="font-accent italic text-primary">Co-Founders</span>
            </h1>
            <p className="text-muted-foreground">Find the perfect match for your startup journey</p>
          </motion.div>

          {/* Search & filters */}
          <div className="max-w-4xl mx-auto mb-10 space-y-4">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, skill, or industry..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {roleFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setRoleFilter(f)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    roleFilter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
              <span className="w-px bg-border mx-1" />
              {domainFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setDomainFilter(f)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    domainFilter === f ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            {!isLoading && <p className="text-xs text-muted-foreground">Showing {filtered.length} of {profiles.length} profiles</p>}
          </div>

          {/* Grid */}
          <div className="max-w-5xl mx-auto">
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <ProfileCardSkeleton key={i} />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <motion.div 
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                <AnimatePresence>
                  {filtered.map((p, i) => (
                    <ProfileCard key={p.id} profile={p} index={i} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-lg font-semibold text-foreground mb-1">No matches found</p>
                <p className="text-sm text-muted-foreground">Try widening your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
