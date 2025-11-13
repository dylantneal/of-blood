import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

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
    default: "Of Blood | Industrial Occult Metal",
    template: "%s | Of Blood",
  },
  description: "Industrial occult metal. Tendrils of descending divinity wrapped in black, red, and gold.",
  keywords: ["metal", "industrial", "occult", "music", "band"],
  authors: [{ name: "Of Blood" }],
  creator: "Of Blood",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Of Blood",
    title: "Of Blood | Industrial Occult Metal",
    description: "Industrial occult metal. Tendrils of descending divinity wrapped in black, red, and gold.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Of Blood | Industrial Occult Metal",
    description: "Industrial occult metal. Tendrils of descending divinity wrapped in black, red, and gold.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <body className="antialiased">
        <Header />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

