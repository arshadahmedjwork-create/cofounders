import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProfilesPreview from "@/components/landing/ProfilesPreview";
import PsycheMapTeaser from "@/components/landing/PsycheMapTeaser";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";

export default function Index() {
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
