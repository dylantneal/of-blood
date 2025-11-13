import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Links | Of Blood",
    template: "%s | Of Blood",
  },
  description: "All Of Blood links in one place.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LinksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

