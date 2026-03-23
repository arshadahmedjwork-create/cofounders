import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProfileCard from "@/components/ProfileCard";
import Footer from "@/components/landing/Footer";
import { Profile } from "@/data/profiles";
import { getProfiles } from "@/services/profileService";

const roleFilters = ["All", "Founders", "Freelancers", "Operators"];
const domainFilters = ["All Domains", "AI / ML", "FinTech", "HealthTech", "SaaS / B2B", "D2C / Consumer", "Climate Tech"];

export default function BrowseProfiles() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [domainFilter, setDomainFilter] = useState("All Domains");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await getProfiles();
        setProfiles(data);
      } catch (err) {
        console.error("Failed to load profiles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const filtered = profiles.filter((p) => {
    const s = search.toLowerCase();
    const pName = p.name?.toLowerCase() || '';
    const pDomain = p.domain?.toLowerCase() || '';
    const pRole = p.role?.toLowerCase() || '';
    
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
            {!loading && <p className="text-xs text-muted-foreground">Showing {filtered.length} of {profiles.length} profiles</p>}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {filtered.map((p, i) => (
                <ProfileCard key={p.id} profile={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-lg font-semibold text-foreground mb-1">No matches found</p>
              <p className="text-sm text-muted-foreground">Try widening your filters.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
