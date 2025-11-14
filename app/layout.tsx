import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AudioProvider } from "@/contexts/audio-context";
import { CartProvider } from "@/contexts/cart-context";
import { AudioPlayer } from "@/components/audio/audio-player";
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
    default: "Of Blood | Blackened Death Metal",
    template: "%s | Of Blood",
  },
  description: "Death metal exploring themes of cosmic horror, existential dread, and apocalyptic themes.",
  keywords: ["metal", "black metal", "atmospheric", "cosmic horror", "music", "band"],
  authors: [{ name: "Of Blood" }],
  creator: "Of Blood",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Of Blood",
    title: "Of Blood | Blackened Death Metal",
    description: "Death metal exploring themes of cosmic horror, existential dread, and apocalyptic themes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Of Blood | Blackened Death Metal",
    description: "Death metal exploring themes of cosmic horror, existential dread, and apocalyptic themes.",
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
        <AudioProvider>
          <CartProvider>
            <Header />
            <main className="min-h-screen pt-20 pb-32 md:pb-36">
              {children}
            </main>
            <Footer />
            <AudioPlayer />
          </CartProvider>
        </AudioProvider>
      </body>
    </html>
  );
}

