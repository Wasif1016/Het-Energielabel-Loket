"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { howWeWork } from "@/constant/constant";

export function HowWeWork() {
  const sidebarRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Dynamically import GSAP to avoid SSR issues
    const loadGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      
      gsap.registerPlugin(ScrollTrigger);

      if (window.innerWidth >= 1024) { // Only on desktop
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 25%",
          end: "bottom 65%",
          pin: sidebarRef.current,
          pinSpacing: false,
        });
      }

      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    };

    loadGSAP();
  }, []);

  return (
    <>
      {/* Load GSAP from CDN */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
      
      <section className="relative py-8 md:py-24 overflow-hidden bg-foreground/5">
        <div className="max-w-[2350px] mx-auto px-6 lg:px-12">
          <div ref={containerRef} className="lg:flex lg:gap-8 lg:items-start">
            {/* Left side - Pinned Sidebar */}
            <div className="lg:w-2/5">
              <motion.div
                ref={sidebarRef}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-4xl md:text-5xl font-semibold">
                  Onze werkwijze
                </h2>
                <p className="text-foreground/90 text-lg text-pretty">
                  <strong>
                    Snel en efficiënt uw energielabel en rapportages aanvragen
                  </strong>{" "}
                  Bij Het Energielabel Loket zorgen we ervoor dat het aanvragen van een{" "}
                  <strong>energielabel voor uw woning</strong> of het uitvoeren van een{" "}
                  <strong>WWS puntentelling</strong> snel, duidelijk en eenvoudig
                  verloopt. Dit is hoe onze werkwijze eruitziet:
                </p>
              </motion.div>
            </div>

            {/* Right side - Scrollable Content */}
            <div className="lg:w-3/5 mt-8 lg:mt-0">
              <div className="grid grid-cols-1 gap-6 relative">
                {/* Vertical line connecting steps */}
                <div className="absolute left-[45px] top-[60px] bottom-[40px] w-[2px] bg-primary/20 hidden md:block" />
                
                {howWeWork.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <div className="p-6 rounded-xl border border-primary/10 bg-background flex flex-col md:flex-row gap-6 w-full hover:border-primary/40 transition-all duration-300">
                      {/* Step number circle */}
                      <div className="flex-shrink-0 relative">
                        <div className="w-[90px] h-[90px] rounded-full bg-primary/5 flex items-center justify-center border-2 border-primary relative z-10">
                          <div className="text-3xl font-bold text-primary">
                            {(index + 1).toString().padStart(2, '0')}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <h3 className="text-2xl font-medium">{item.title}</h3>
                        <p className="text-lg text-foreground/90">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}