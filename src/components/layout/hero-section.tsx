"use client";

import { Button } from "@/components/ui/button";
import { FlickeringGrid } from "@/components/layout/background";
import { motion } from "framer-motion";
import Link from "next/link";
import { ParallaxImage } from "../ui/ParallaxImage";

export function HeroSection() {
  return (
    <>
      <div
        id="hero"
        className="relative mt-32 flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Floating geometric shapes */}
        <FlickeringGrid
          className="z-0 absolute inset-0 w-full h-full"
          squareSize={3}
          gridGap={12}
          color="#929791"
          maxOpacity={0.4}
          flickerChance={0.4}
          height={800}
          width={1600}
        />

        {/* Main content */}
        <div className="relative z-10 container px-4  pt-16 pb-12 mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-5xl mx-auto text-4xl md:text-6xl font-[900] tracking-tight leading-[120%] mb-8 text-primary"
            style={{
              lineHeight: "120%",
            }}
          >
            Duurzame energielabels voor een slimmer en zuiniger huis
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-foreground/90 text-xl md:text-2xl mb-12 max-w-2xl mx-auto"
          >
           Laat uw woning professioneel beoordelen en ontdek hoe u direct kunt besparen op energieverbruik.
           Wij leveren praktische oplossingen op maat – van isolatie en installaties tot energieadvies – zodat uw huis groener, comfortabeler en waardevoller wordt.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link href="#contact">
              <Button size="lg" className="text-base min-w-[250px] h-12">
                Vraag direct een offerte aan
              </Button>
            </Link>
          </motion.div>
          {/* Bottom Image Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="relative h-[300px] md:h-[400px] mx-auto rounded-2xl overflow-hidden border border-foreground/20"
          >
            <ParallaxImage
              className="w-full mx-auto rounded-[1rem] lg:rounded-none"
              src="/clean-environment.jpg"
              alt="Clean environment"
              fill={true}
            />
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-4 md:gap-3 gap-6 items-center"
        >
          <Link
            href="#contact"
            className="flex items-center gap-3 justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span className="">Energielabel voor woningen</span>
          </Link>
          <Link
            href="#contact"
            className="flex items-center gap-3 justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="">NEN 2580 meetrapport</span>
          </Link>
          <Link
            href="#contact"
            className="flex items-center gap-3 justify-center md:pl-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="">WWS puntentelling</span>
          </Link>
          <Link
            href="#contact"
            className="flex items-center gap-3 justify-center md:pl-12"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12c0 1.2-4 6-9 6s-9-4.8-9-6c0-1.2 4-6 9-6s9 4.8 9 6Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="">Duurzaamheidsadvies</span>
          </Link>
        </motion.div>
      </div>
    </>
  );
}
