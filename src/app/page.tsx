import { HeroSection } from "@/components/layout/hero-section";
import { ServicesSection } from "@/components/layout/services-section";
import WhyChooseSection from "@/components/layout/why-choose-section";
import { HowWeWork } from "@/components/layout/method";
import FAQ from "@/components/layout/faq";
import { ContactSection } from "@/components/layout/contact-section";
import { SustainabilitySection } from "@/components/layout/sustainability-section";
import { ParallaxImage } from "@/components/ui/ParallaxImage";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <SustainabilitySection />
      <ServicesSection />
      <WhyChooseSection />
      <HowWeWork />
      <div className="relative h-[500px] lg:h-[calc(100vh-122px)]">
        <ParallaxImage
          src="/cityscape.jpg"
          alt="Hero Section"
          className="w-full h-full"
        />
      </div>
      <FAQ />
      <ContactSection />
    </main>
  );
}
