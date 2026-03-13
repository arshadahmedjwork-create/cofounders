import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import HowItWorks from "@/components/landing/HowItWorks";
import ProfilesPreview from "@/components/landing/ProfilesPreview";
import PsycheMapTeaser from "@/components/landing/PsycheMapTeaser";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <HowItWorks />
      <ProfilesPreview />
      <PsycheMapTeaser />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
}
