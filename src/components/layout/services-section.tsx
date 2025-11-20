"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ParallaxImage } from "../ui/ParallaxImage";

const services = [
  {
    title: "Energielabel voor Woningen",
    paragraph:
      "Onze BRL 9500-gecertificeerde adviseurs leveren een betrouwbare, nauwkeurige en snelle beoordeling volgens alle geldende normen – zodat uw woning voldoet aan de wettelijke eisen én aantrekkelijker wordt voor kopers of huurders.",
    image: "/home energy assessment.jpg",
    link: "#contact",
  },
  {
    title: "WWS puntentelling",
    paragraph:
      "Wij voeren de puntentelling volgens het WWS (Woningwaarderingsstelsel) uit om de maximale huurprijs van uw woning te bepalen. Dit is essentieel voor het bepalen van de huurberekening in zowel de sociale als vrije sector.",
    image: "/rental property scoring.jpg",
    link: "#contact",
  },
  {
    title: "Duurzaamheidsadvies",
    paragraph:
      "Slimme en praktische oplossingen om isolatie, technologie en energieverbruik te verbeteren – volledig afgestemd op uw woning en budget.",
    image: "/Sustainability-Advice.avif",
    link: "#contact",
  },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative py-20 overflow-hidden bg-foreground/5"
    >
      <div className="container relative mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl   font-bold">
            Onze diensten
          </h2>
          <p className="text-foreground/90 text-lg text-pretty">
          Bij Het Energielabel Loket bieden wij een compleet pakket aan duurzame diensten die uw woning energiezuiniger maken en voldoen aan alle vereisten voor verkoop of verhuur.
          Onze energieadviesdiensten zijn speciaal ontworpen om uw energielabel te verbeteren, het energieverbruik te verlagen en het wooncomfort te verhogen – snel, betrouwbaar en volledig op maat van uw woning.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative h-full"
            >
              {/* Service Card */}
              <div className="relative bg-background/50 backdrop-blur-sm rounded-2xl border overflow-hidden border-border h-full flex flex-col justify-between">
                <div>
                  {/* Image */}
                  <div className="relative md:h-44 h-52 overflow-hidden">
                    <ParallaxImage
                      src={service.image}
                      alt={service.title}
                      className="object-contain w-full transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {service.title}
                    </h3>
                    <p className="text-foreground/90 mb-4 text-md">
                      {service.paragraph}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-6 pt-0">
                  <Link
                    href={service.link}
                    className="flex items-center justify-center px-4 py-2 rounded-md bg-foreground/90 text-background w-full group-hover:bg-primary/80 group-hover:text-primary-foreground transition-colors"
                  >
                    Neem contact met ons op <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
