import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { FeaturedRelease } from "@/components/home/featured-release";
import { FeaturedMerch } from "@/components/home/featured-merch";
import { FeaturedVideo } from "@/components/home/featured-video";
import { TourTicker } from "@/components/home/tour-ticker";
import { MERCH_ENABLED } from "@/lib/site-config";
import { BandPhoto } from "@/components/home/band-photo";
import { Newsletter } from "@/components/home/newsletter";

// Revalidate homepage every 60 seconds to show new products and content
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Of Blood | Official Website",
  description: "Of Blood is a cosmic death metal band exploring apocalyptic themes and existential dread. Listen to Tendrils of Descending Divinity, view upcoming tour dates, and shop official merchandise.",
  keywords: [
    "Of Blood",
    "Of Blood band",
    "Of Blood metal band",
    "cosmic death metal",
    "death metal band",
    "Of Blood music",
    "Of Blood tour dates",
    "Of Blood merch",
    "Tendrils of Descending Divinity",
    "cosmic horror metal",
    "atmospheric death metal"
  ],
  openGraph: {
    title: "Of Blood | Official Website",
    description: "Cosmic death metal exploring apocalyptic themes and existential dread. Listen to music, view tour dates, and shop merch.",
    url: "https://of-blood.com",
    images: [
      {
        url: "/images/OfBloodLogo.png",
        width: 1200,
        height: 630,
        alt: "Of Blood - Cosmic Death Metal Band",
      },
    ],
  },
  alternates: {
    canonical: "https://of-blood.com",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedRelease />
      <TourTicker />
      <FeaturedVideo />
      {MERCH_ENABLED && <FeaturedMerch />}
      <BandPhoto />
      <Newsletter />
    </>
  );
}

