"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Logo } from "./logo";
import { Container } from "../ui/container";
import { Instagram, Youtube, Music2 } from "lucide-react";

const footerLinks = {
  music: [
    { name: "Releases", href: "/music" },
    { name: "YouTube", href: "https://www.youtube.com/@OfBloodBand", external: true },
  ],
  connect: [
    { name: "Tour Dates", href: "/tour" },
    { name: "Merch", href: "/merch" },
    { name: "Press Kit", href: "/media" },
    { name: "Booking", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/legal#privacy" },
    { name: "Terms of Service", href: "/legal#terms" },
    { name: "Cookies", href: "/legal#cookies" },
  ],
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/ofbloodband/" },
  { name: "YouTube", icon: Youtube, href: "https://www.youtube.com/@OfBloodBand" },
  { name: "TikTok", icon: Music2, href: "https://www.tiktok.com/@ofbloodband" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("idle");
        alert("Failed to subscribe. Please try again.");
      }
    } catch (error) {
      console.error("Newsletter error:", error);
      setStatus("idle");
      alert("Failed to subscribe. Please try again.");
    }
  };

  return (
    <footer className="relative z-10 border-t border-line bg-muted/30">
      <Container>
        {/* Main Footer Content */}
        <div className="py-8 md:py-12 lg:py-16 grid grid-cols-1 gap-6 md:gap-10 lg:gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand - Hidden on mobile to save space */}
          <div className="hidden md:block space-y-4">
            <Logo />
            <p className="text-sm text-foreground/70 max-w-xs leading-relaxed">
              Cosmic death metal from Chicago.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 pt-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/70 hover:text-primary transition-colors"
                    aria-label={social.name}
                    title={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Mobile: Combined Links Section */}
          <div className="md:hidden">
            <h3 className="font-display text-base font-semibold mb-3">Quick Links</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {footerLinks.music.concat(footerLinks.connect).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  target={'external' in link && link.external ? "_blank" : undefined}
                  rel={'external' in link && link.external ? "noopener noreferrer" : undefined}
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop: Music Links */}
          <div className="hidden md:block">
            <h3 className="font-display text-lg font-semibold mb-4">Music</h3>
            <ul className="space-y-2.5">
              {footerLinks.music.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-sm text-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop: Connect Links */}
          <div className="hidden md:block">
            <h3 className="font-display text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2.5">
              {footerLinks.connect.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter - Simplified on mobile */}
          <div>
            <h3 className="font-display text-base md:text-lg font-semibold mb-3 md:mb-4">Newsletter</h3>
            <p className="text-sm text-foreground/70 mb-3 leading-relaxed hidden md:block">
              Get updates on new releases, tour dates, and exclusive drops.
            </p>
            <p className="text-xs text-foreground/70 mb-3 leading-relaxed md:hidden">
              Get updates on releases and tour dates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === "loading" || status === "success"}
                className="h-10 w-full rounded-sm border border-line bg-muted px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="h-10 w-full rounded-sm bg-primary text-fg text-xs md:text-sm font-medium font-display uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Subscribing..." : status === "success" ? "✓ Subscribed!" : "Subscribe"}
              </button>
            </form>
          </div>

          {/* Mobile: Social Links */}
          <div className="md:hidden border-t border-line pt-6">
            <div className="flex justify-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/70 hover:text-primary transition-colors"
                    aria-label={social.name}
                    title={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-line py-4 md:py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
          <p className="text-xs md:text-sm text-foreground/60 order-2 md:order-1">
            © {new Date().getFullYear()} Of Blood. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-6 order-1 md:order-2">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs md:text-sm text-foreground/60 hover:text-primary transition-colors whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

