import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProfilesPreview from "@/components/landing/ProfilesPreview";
import PsychometricTeaser from "@/components/landing/PsychometricTeaser";
import StatsSection from "@/components/landing/StatsSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function Index() {
  const { user, hasProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (hasProfile === false) {
        navigate("/onboarding");
      }
    }
  }, [user, hasProfile, loading, navigate]);

  return (
    <div
      className="min-h-screen selection:bg-primary/30 selection:text-white"
      style={{ background: "hsl(232, 62%, 12%)" }}
    >
      <Navbar />
      <main id="main-content">
        <HeroSection />
        
        {/* Match Preview - The Interactive Signals */}
        <ProfilesPreview />

        {/* Personality Compatibility - The Science */}
        <PsychometricTeaser />

        {/* Reality Check - The Stats */}
        <StatsSection />

        {/* Emotional Close */}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
