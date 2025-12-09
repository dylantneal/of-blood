"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Check } from "lucide-react";

// Custom SVG icons - all filled for consistent glow
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com/ofbloodband", icon: InstagramIcon },
  { name: "TikTok", href: "https://tiktok.com/@ofbloodband", icon: TikTokIcon },
  { name: "YouTube", href: "https://youtube.com/@OfBloodBand", icon: YoutubeIcon },
];

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // If response is not JSON, use status text
        setStatus("error");
        setErrorMessage(`Server error: ${response.statusText || "Unknown error"}`);
        return;
      }

      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
      console.error("Newsletter subscription error:", error);
    }
  };

  return (
    <Section className="relative overflow-hidden">
      {/* Subtle glow behind content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
      
      <Container size="narrow" className="relative z-10">
        <div className="text-center space-y-8">
          {/* Decorative top accent */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 md:w-16 bg-gradient-to-r from-transparent to-gold/40" />
            <div className="relative w-10 h-10 opacity-40">
              <Image
                src="/images/logos/OfBloodSymbol.png"
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <div className="h-px w-12 md:w-16 bg-gradient-to-l from-transparent to-gold/40" />
          </div>
          
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Stay Connected
            </h2>
            <p className="text-foreground/70 text-lg md:text-xl max-w-lg mx-auto">
              New releases, tour dates, and limited merch drops; delivered to your inbox.
            </p>
          </div>

          {/* Form with decorative frame */}
          <div className="relative max-w-xl mx-auto">
            {/* Frame */}
            <div className="relative p-6 md:p-8 border border-gold/20 bg-black/20">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-gold/60" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-gold/60" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-gold/60" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-gold/60" />
              
              {status === "success" ? (
                <div className="flex items-center justify-center gap-3 text-gold py-4">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <p className="font-display text-lg">You&apos;re in. Check your email to confirm.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === "loading"}
                    className="flex-1 h-12 bg-black/60 border-line/50 focus:border-primary/50"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={status === "loading"}
                    className="h-12 px-8 uppercase tracking-widest font-display"
                  >
                    {status === "loading" ? "..." : "Join"}
                  </Button>
                </form>
              )}

              {status === "error" && (
                <p className="text-primary text-sm mt-4 text-center">
                  {errorMessage || "Something went wrong. Please try again."}
                </p>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="pt-10 md:pt-14">
            {/* Section divider */}
            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="h-px w-10 md:w-16 bg-gradient-to-r from-transparent to-line" />
              <p className="text-xs text-foreground/50 uppercase tracking-[0.3em]">
                Follow Us
              </p>
              <div className="h-px w-10 md:w-16 bg-gradient-to-l from-transparent to-line" />
            </div>
            
            <div className="flex items-center justify-center gap-20 md:gap-28 lg:gap-32">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${social.name}`}
                  className="group relative flex flex-col items-center"
                >
                  {/* Blood glow - subtle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary/0 group-hover:bg-primary/40 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150" />
                  
                  {/* Gold corner sigils - ritualistic touch */}
                  <div className="absolute -top-3 -left-3 w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                    <div className="w-full h-px bg-gold/70 absolute top-0" />
                    <div className="h-full w-px bg-gold/70 absolute left-0" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-150">
                    <div className="w-full h-px bg-gold/70 absolute top-0" />
                    <div className="h-full w-px bg-gold/70 absolute right-0" />
                  </div>
                  <div className="absolute -bottom-3 -left-3 w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200">
                    <div className="w-full h-px bg-gold/70 absolute bottom-0" />
                    <div className="h-full w-px bg-gold/70 absolute left-0" />
                  </div>
                  <div className="absolute -bottom-3 -right-3 w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-[250ms]">
                    <div className="w-full h-px bg-gold/70 absolute bottom-0" />
                    <div className="h-full w-px bg-gold/70 absolute right-0" />
                  </div>
                  
                  {/* Icon container with lift effect */}
                  <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
                    <social.icon className="w-14 h-14 md:w-16 md:h-16 text-foreground/70 group-hover:text-white transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(179,10,10,0.7)]" />
                  </div>
                  
                  {/* Platform name - slides up from darkness */}
                  <div className="h-6 mt-4 overflow-hidden">
                    <span className="block text-xs md:text-sm uppercase tracking-[0.2em] text-primary font-display font-semibold translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out delay-100 drop-shadow-[0_0_10px_rgba(179,10,10,0.5)]">
                      {social.name}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
          
        </div>
      </Container>
    </Section>
  );
}

