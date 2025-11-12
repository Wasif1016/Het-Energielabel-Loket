"use client";

import { useLayoutEffect, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

interface ParallaxImageProps {
  src: string | StaticImageData;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  objectPosition?: string;
  objectFit?: string;
}

export function ParallaxImage({
  src,
  alt,
  className = "",
  fill = false,
  priority = false,
  quality = 100,
  sizes,
  objectPosition = "center",
  objectFit = "cover",
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const element = container.querySelector("img, video");
    if (!element) return;

    // Create timeline for this element
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Add animation to timeline
    tl.fromTo(
      element,
      {
        y: "-12%",
        scale: 1.2, // Start slightly scaled up to prevent white edges during parallax
      },
      {
        y: "12%",
        scale: 1.2, // Maintain scale throughout animation
        ease: "none",
      }
    );

    // Cleanup function
    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
    };
  }, []);

  // Check if source is a video
  const isVideo =
    typeof src === "string" && (src.endsWith(".mp4") || src.endsWith(".webm"));

  // Map objectFit values to Tailwind classes
  const objectFitClasses: Record<string, string> = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
    "scale-down": "object-scale-down",
  };

  // Map objectPosition values to Tailwind classes
  const objectPositionClasses: Record<string, string> = {
    center: "object-center",
    top: "object-top",
    bottom: "object-bottom",
    left: "object-left",
    right: "object-right",
    "top-left": "object-top-left",
    "top-right": "object-top-right",
    "bottom-left": "object-bottom-left",
    "bottom-right": "object-bottom-right",
  };

  const objectFitClass = objectFitClasses[objectFit] || "object-cover";
  const objectPositionClass = objectPositionClasses[objectPosition] || "object-center";

  return (
    <div
      ref={containerRef}
      className={`img-container relative overflow-hidden w-full h-full ${className}`}
    >
      {isVideo ? (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-full ${objectFitClass} ${objectPositionClass}`}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill={true}
          className={`${objectFitClass} ${objectPositionClass}`}
          priority={priority}
          quality={quality}
          sizes={sizes}
        />
      )}
    </div>
  );
}
