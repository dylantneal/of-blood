"use client";

import Image from "next/image";
import { Instagram, Youtube, Music2, Disc, Globe, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const links = [
  {
    name: "Official Website",
    href: "/",
    icon: Globe,
    variant: "primary" as const,
    description: "Visit our website",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@OfBloodBand",
    icon: Youtube,
    variant: "ghost" as const,
    description: "@OfBloodBand",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/ofbloodband/",
    icon: Instagram,
    variant: "ghost" as const,
    description: "@ofbloodband",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@ofbloodband",
    icon: Music2,
    variant: "ghost" as const,
    description: "@ofbloodband",
  },
  {
    name: "Bandcamp",
    href: "https://ofblood.bandcamp.com",
    icon: Disc,
    variant: "gold" as const,
    description: "Listen & Support",
  },
];

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 sm:py-16">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-background to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(179,10,10,0.1)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.6)_100%)]" />
      </div>

      <div className="w-full max-w-md space-y-8">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center space-y-4"
        >
          {/* Symbol */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28">
            <div className="absolute inset-0 bg-primary/20 blur-2xl" />
            <Image
              src="/images/logos/OfBloodSymbol.png"
              alt="Of Blood"
              fill
              className="object-contain drop-shadow-[0_0_20px_rgba(179,10,10,0.4)]"
              priority
            />
          </div>

          {/* Text Logo */}
          <div className="relative w-48 h-12 sm:w-56 sm:h-14">
            <Image
              src="/images/logos/OfBlood_TextLogoTransparent.png"
              alt="Of Blood"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Tagline */}
          <p className="text-gold text-sm sm:text-base font-display tracking-widest text-center">
            BLACKENED DEATH METAL
          </p>
        </motion.div>

        {/* Links */}
        <div className="space-y-3">
          {links.map((link, index) => {
            const Icon = link.icon;
            const isExternal = link.href.startsWith("http");
            return (
              <motion.a
                key={link.name}
                href={link.href}
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.3 + (index * 0.1),
                  ease: "easeOut"
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  group relative flex items-center gap-4 w-full p-4 sm:p-5
                  border-2 rounded-sm transition-all duration-300
                  ${
                    link.variant === "primary"
                      ? "bg-primary/10 border-primary/50 text-foreground hover:bg-primary/20 hover:border-primary hover:shadow-[0_0_30px_rgba(179,10,10,0.4)]"
                      : link.variant === "gold"
                      ? "bg-gold/10 border-gold/50 text-foreground hover:bg-gold/20 hover:border-gold hover:shadow-[0_0_30px_rgba(201,162,39,0.4)]"
                      : "bg-muted/30 border-line text-foreground hover:bg-muted/50 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(179,10,10,0.2)]"
                  }
                `}
              >
                {/* Icon */}
                <div
                  className={`
                    flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12
                    flex items-center justify-center
                    rounded-sm border
                    ${
                      link.variant === "primary"
                        ? "bg-primary/20 border-primary/50 text-primary"
                        : link.variant === "gold"
                        ? "bg-gold/20 border-gold/50 text-gold"
                        : "bg-background/50 border-line text-foreground/70 group-hover:text-primary group-hover:border-primary/50"
                    }
                    transition-all duration-300
                  `}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold text-base sm:text-lg mb-0.5">
                    {link.name}
                  </div>
                  <div className="text-xs sm:text-sm text-foreground/60 truncate">
                    {link.description}
                  </div>
                </div>

                {/* External Link Icon */}
                {isExternal && (
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-foreground/40 group-hover:text-foreground/70 flex-shrink-0 transition-colors" />
                )}
              </motion.a>
            );
          })}
        </div>

        {/* Footer Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center pt-4"
        >
          <p className="text-xs text-foreground/40 font-display tracking-widest">
            WE ARE ALL OF BLOOD
          </p>
        </motion.div>
      </div>
    </div>
  );
}

