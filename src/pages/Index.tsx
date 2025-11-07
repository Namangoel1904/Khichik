import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CustomizeSection } from "@/components/CustomizeSection";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { AboutSection } from "@/components/AboutSection";
import { Footer } from "@/components/Footer";
import { VideoAd } from "@/components/VideoAd";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturedProducts />
      <VideoAd />
      <CustomizeSection />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;
