"use client";

import Image from "next/image";
import { Instagram, Youtube, Music2, Globe, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

function SpotifyLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0Zm5.505 17.307a.74.74 0 0 1-1.02.25 10.898 10.898 0 0 0-11 0 .74.74 0 1 1-.77-1.263 12.377 12.377 0 0 1 12.54 0 .74.74 0 0 1 .25 1.013Zm1.457-2.893a.926.926 0 0 1-1.276.313 13.645 13.645 0 0 0-13.372 0 .926.926 0 0 1-.963-1.582 15.5 15.5 0 0 1 15.31 0 .926.926 0 0 1 .301 1.27Zm.131-3.012a16.406 16.406 0 0 0-14.86 0 1.11 1.11 0 1 1-1.01-1.977 18.632 18.632 0 0 1 16.88 0 1.11 1.11 0 1 1-1.01 1.977Z" />
    </svg>
  );
}

function YouTubeMusicLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M10.015 14.97V9.03L15 12l-4.985 2.97Zm1.985 7.03A10 10 0 1 1 22 12a10.011 10.011 0 0 1-10 10Zm0-18.5A8.5 8.5 0 1 0 20.5 12 8.51 8.51 0 0 0 12 3.5Zm0 2.375A6.125 6.125 0 1 1 5.875 12 6.132 6.132 0 0 1 12 5.875Zm0 10.75A4.625 4.625 0 1 0 7.375 12 4.63 4.63 0 0 0 12 16.625Z" />
    </svg>
  );
}

const links = [
  {
    name: "Official Website",
    href: "/",
    icon: Globe,
    variant: "primary" as const,
    description: "Visit our website",
  },
  {
    name: "Spotify",
    href: "https://open.spotify.com/artist/6bnYniIgW2iRKvMeMvNqfW",
    icon: SpotifyLogo,
    variant: "ghost" as const,
    description: "Of Blood",
  },
  {
    name: "YouTube Music",
    href: "https://music.youtube.com/channel/UCVS7ytVPsU3ZO9RLWyVxbng",
    icon: YouTubeMusicLogo,
    variant: "ghost" as const,
    description: "Of Blood",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@OfBloodBand",
    icon: Youtube,
    variant: "gold" as const,
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
            COSMIC DEATH METAL
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
                className="
                  group relative flex items-center gap-4 w-full p-4 sm:p-5
                  border-2 rounded-sm transition-all duration-300
                  bg-muted/30 border-line text-foreground
                  hover:bg-primary/10 hover:border-primary/70 hover:shadow-[0_0_0_1px_rgba(179,10,10,0.6),0_0_28px_rgba(179,10,10,0.45)]
                "
              >
                {/* Icon */}
                <div
                  className="
                    flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12
                    flex items-center justify-center rounded-sm border
                    bg-background/50 border-line text-foreground/70
                    group-hover:text-primary group-hover:border-primary/70 group-hover:bg-primary/10 group-hover:shadow-[0_0_16px_rgba(179,10,10,0.35)]
                    transition-all duration-300
                  "
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

