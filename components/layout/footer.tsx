import Link from "next/link";
import { Logo } from "./logo";
import { Container } from "../ui/container";
import { Instagram, Youtube, Music2, Disc } from "lucide-react";

const footerLinks = {
  music: [
    { name: "Releases", href: "/music" },
    { name: "Bandcamp", href: "https://ofblood.bandcamp.com", external: true },
    { name: "YouTube Music", href: "https://www.youtube.com/@OfBloodBand", external: true },
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
  { name: "Bandcamp", icon: Disc, href: "https://ofblood.bandcamp.com" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-muted/30">
      <Container>
        {/* Main Footer Content */}
        <div className="py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-foreground/70 max-w-xs">
              Cosmic death metal exploring cosmic horror, existential dread, and apocalyptic themes. Tendrils of descending divinity wrapped in black, red, and gold.
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

          {/* Music Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Music</h3>
            <ul className="space-y-2">
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

          {/* Connect Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
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

          {/* Newsletter */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-foreground/70 mb-4">
              Get updates on new releases, tour dates, and exclusive drops.
            </p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="h-10 w-full rounded-sm border border-line bg-muted px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <button
                type="submit"
                className="h-10 w-full rounded-sm bg-primary text-fg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-line py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground/60">
            © {new Date().getFullYear()} Of Blood. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-foreground/60 hover:text-primary transition-colors"
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

