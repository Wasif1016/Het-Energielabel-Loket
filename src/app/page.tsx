import { HeroSection } from "@/components/layout/hero-section";
import { ServicesSection } from "@/components/layout/services-section";
import WhyChooseSection from "@/components/layout/why-choose-section";
import { HowWeWork } from "@/components/layout/method";
import FAQ from "@/components/layout/faq";
import { ContactSection } from "@/components/layout/contact-section";
import { SustainabilitySection } from "@/components/layout/sustainability-section";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import Image from "next/image";

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
      {/* Certificate Section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground">
              Certificering
            </h2>
            <div className="bg-white rounded-lg shadow-lg p-2 md:p-8 flex justify-center items-center">
              <div className="relative w-full max-w-4xl">
                <div className="relative aspect-[1200/1697] w-full h-auto max-w-full">
                  <Image
                    src="/Certificaat%20Het%20Energielabel%20Loket%20nov%202025_page-0001.jpg"
                    alt="NL-EPBD® Procescertificaat - Het Energielabel Loket"
                    fill
                    style={{ objectFit: "contain" }}
                    className="rounded-md shadow-md"
                    quality={95}
                    sizes="(max-width: 768px) 100vw, 800px"
                    priority={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
