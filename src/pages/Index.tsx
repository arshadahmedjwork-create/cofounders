import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProfilesPreview from "@/components/landing/ProfilesPreview";
import PsycheMapTeaser from "@/components/landing/PsycheMapTeaser";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";

export default function Index() {
  const { user, hasProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (hasProfile === false) {
        navigate("/onboarding");
      }
      // Removed forced redirect to /browse to allow viewing landing page sections (Pricing, etc)
    }
  }, [user, hasProfile, loading, navigate]);

  return (
    // Single unified dark base — sections use atmospheric depth, not alternating BGs
    <div
      className="min-h-screen"
      style={{ background: "hsl(222, 30%, 7%)" }}
    >
      <Navbar />
      <HeroSection />
      <ProfilesPreview />
      <PsycheMapTeaser />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
}
