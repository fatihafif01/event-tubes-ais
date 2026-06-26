import Navbar from "@/components/dashboard/Navbar";
import HeroSection from "@/components/dashboard/HeroSection";
import FeaturedEvents from "@/components/dashboard/FeaturedEvents";
import EventCategories from "@/components/dashboard/EventCategories";
import HowItWorks from "@/components/dashboard/HowItWorks";
import Testimonials from "@/components/dashboard/Testimonials";
import StatsSection from "@/components/dashboard/StatsSection";
import CTASection from "@/components/dashboard/CTASection";
import Footer from "@/components/dashboard-after-login/Footer";
import GlobalBackground from "@/components/dashboard/GlobalBackground";

export default function Home() {
  return (
    <div className="relative bg-white text-gray-900 min-h-screen overflow-x-hidden">
      <GlobalBackground />
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturedEvents />
      <EventCategories />
      <HowItWorks />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
}