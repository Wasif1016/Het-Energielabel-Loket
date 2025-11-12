"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useContactPopup } from "@/components/providers/contact-popup-provider";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openContactPopup } = useContactPopup();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Get all sections
      const sections = document.querySelectorAll("section[id]");

      // Find the current section
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).clientHeight;
        if (
          window.scrollY >= sectionTop - 100 &&
          window.scrollY < sectionTop + sectionHeight - 100
        ) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    href: string
  ) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      // Close mobile menu first
      setIsMobileMenuOpen(false);

      // Small delay to allow menu animation to complete
      setTimeout(() => {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }, 300);
    }
  };

  const navItems = [
    {
      label: "Wat we bieden",
      href: "#services",
    },
    {
      label: "Over ons",
      href: "#about",
    },
    {
      label: "Veelgestelde vragen",
      href: "#faq",
    },
    {
      label: "Contact",
      href: "#contact",
    },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "bg-background/80 backdrop-blur-xl shadow-sm"
          : "bg-foreground/5"
      }`}
    >
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-sm">
        <div className="container mx-auto px-4 flex justify-center items-center space-x-6">
          <a href="tel:+31647198116" className="flex items-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className="hidden md:inline">Bel ons</span>
            <span className="md:ml-2">+31647198116</span>
          </a>
          <a href="mailto:energielabel.loket@gmail.com" className="flex items-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <path d="m22 6-10 7L2 6" />
            </svg>
            <span className="hidden md:inline">Email ons</span>
            <span className="md:ml-2">energielabel.loket@gmail.com</span>
          </a>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex py-3 items-center justify-between">
          {/* Logo */}
          <Link href="#hero" className="flex items-center justify-start gap-2">
            <Image
              src="/Het-Energielabel-Loket-logo.png"
              alt="Logo"
              width={600}
              height={600}
              className="w-fit h-14 object-contain"
              priority
            />
            <h1 className="text-2xl font-bold text-primary hover:text-primary/90 transition-colors">
              Het Energielabel Loket
            </h1>
          </Link>

          {/* Desktop Navigation */}

          <nav className="hidden md:flex items-center gap-0">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`relative group text-lg font-semibold pr-6 px-4 py-1 `}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <Button
              className="hidden md:inline-flex px-8 py-5"
              onClick={openContactPopup}
            >
              Vraag direct een offerte aan
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-accent rounded-md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {!isMobileMenuOpen ? (
                <Menu className="h-8 w-8" />
              ) : (
                <X className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-primary/10 min-h-[calc(100dvh-100px)] pb-12 flex flex-col justify-between"
            >
              <div className="py-12 space-y-8">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block text-xl text-center"
                    onClick={(e) => handleNavClick(e, item.href)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="px-4 pt-2">
                <Button onClick={openContactPopup} className="w-full py-6">
                  Vraag direct een offerte aan
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
