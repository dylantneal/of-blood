"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { AnimatedBackground } from "./animated-background";

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Enhanced Background with multiple layers */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-background to-black" />
        
        {/* Animated particle background */}
        <AnimatedBackground />
        
        {/* Radial glow - center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(179,10,10,0.15)_0%,_transparent_60%)]" />
        
        {/* Subtle top light */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)]" />
      </div>

      {/* Content */}
      <Container className="relative h-full z-10">
        <div className="flex h-full flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="space-y-12"
          >
            {/* Main Logo with enhanced glow */}
            <motion.div 
              className="flex justify-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <div className="relative">
                {/* Pulsing glow effect layers */}
                <motion.div 
                  className="absolute inset-0 blur-3xl"
                  animate={{ 
                    opacity: [0.25, 0.45, 0.25],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Image
                    src="/images/logos/OfBloodLogo.png"
                    alt=""
                    width={800}
                    height={800}
                    priority
                    className="w-full"
                    aria-hidden="true"
                  />
                </motion.div>
                
                {/* Main logo */}
                <Image
                  src="/images/logos/OfBloodLogo.png"
                  alt="Of Blood"
                  width={800}
                  height={800}
                  priority
                  className="relative w-full max-w-sm md:max-w-2xl lg:max-w-3xl drop-shadow-[0_0_40px_rgba(179,10,10,0.6)]"
                />
              </div>
            </motion.div>

            {/* CTA Buttons with staggered animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Button variant="primary" size="lg" asChild>
                <Link href="/music">Listen</Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link href="/tour">Tour Dates</Link>
              </Button>
              <Button variant="gold" size="lg" asChild>
                <Link href="/merch">Shop</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator with pulse effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ 
                y: [0, 12, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2.5,
                ease: "easeInOut"
              }}
              className="text-gold/60 hover:text-gold transition-colors"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

