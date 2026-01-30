import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AudioProvider } from "@/contexts/audio-context";
import { CartProvider } from "@/contexts/cart-context";
import { AudioPlayer } from "@/components/audio/audio-player";
import { ErrorBoundary } from "@/components/error-boundary";
import { ToastProvider } from "@/components/ui/toast";
import { runStartupValidation } from "@/lib/env-validation";
import { MusicGroupSchema, WebsiteSchema, OrganizationSchema } from "@/components/seo/structured-data";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

// Run environment validation on startup (development only)
if (typeof window === 'undefined') {
  runStartupValidation();
}

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
  metadataBase: new URL('https://of-blood.com'),
  title: {
    default: "Of Blood | Official Website",
    template: "%s | Of Blood",
  },
  description: "Official website of Of Blood, a cosmic death metal band exploring existential dread and apocalyptic themes. Listen to music, view tour dates, shop merch.",
  keywords: [
    "Of Blood",
    "Of Blood band",
    "Of Blood metal",
    "Of Blood music",
    "cosmic death metal",
    "death metal",
    "black metal",
    "extreme metal",
    "atmospheric metal",
    "cosmic horror metal",
    "death metal band",
    "metal band",
    "heavy metal",
    "Tendrils of Descending Divinity",
    "metal music",
    "death metal Chicago",
    "black metal band"
  ],
  authors: [{ name: "Of Blood", url: "https://of-blood.com" }],
  creator: "Of Blood",
  publisher: "Of Blood",
  applicationName: "Of Blood Official Website",
  generator: "Next.js",
  category: "Music",
  classification: "Music Band Website",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://of-blood.com",
    siteName: "Of Blood - Cosmic Death Metal",
    title: "Of Blood | Cosmic Death Metal Band - Official Website",
    description: "Official website of Of Blood, a cosmic death metal band exploring existential dread and apocalyptic themes. Listen to music, view tour dates, shop merch.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Of Blood - Cosmic Death Metal Band Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Of Blood | Cosmic Death Metal Band",
    description: "Official website of Of Blood - Cosmic death metal exploring existential dread and apocalyptic themes. Listen to music, tour dates, and merch.",
    images: ["/images/OfBloodLogo.png"],
    creator: "@ofbloodband",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes when you get them
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  alternates: {
    canonical: "https://of-blood.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <head>
        <MusicGroupSchema />
        <WebsiteSchema />
        <OrganizationSchema />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          <AudioProvider>
            <CartProvider>
            <ToastProvider>
              <Header />
              <main id="main-content" className="min-h-screen pt-20 pb-32 md:pb-36">
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </main>
              <Footer />
              <AudioPlayer />
            </ToastProvider>
            </CartProvider>
          </AudioProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}

