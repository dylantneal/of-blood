import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { FeaturedRelease } from "@/components/home/featured-release";
import { FeaturedMerch } from "@/components/home/featured-merch";
import { TourTicker } from "@/components/home/tour-ticker";
import { Newsletter } from "@/components/home/newsletter";

// Revalidate homepage every 60 seconds to show new products and content
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Of Blood | Official Blackened Death Metal Band - Music, Tour Dates & Merch",
  description: "Of Blood is a blackened death metal band exploring cosmic horror and apocalyptic themes. Listen to Tendrils of Descending Divinity, view upcoming tour dates, and shop official merchandise.",
  keywords: [
    "Of Blood",
    "Of Blood band",
    "Of Blood metal band",
    "blackened death metal",
    "death metal band",
    "Of Blood music",
    "Of Blood tour dates",
    "Of Blood merch",
    "Tendrils of Descending Divinity",
    "cosmic horror metal",
    "atmospheric death metal"
  ],
  openGraph: {
    title: "Of Blood | Official Blackened Death Metal Band",
    description: "Blackened death metal exploring cosmic horror and apocalyptic themes. Listen to music, view tour dates, and shop merch.",
    url: "https://of-blood.com",
    images: [
      {
        url: "/images/OfBloodLogo.png",
        width: 1200,
        height: 630,
        alt: "Of Blood - Blackened Death Metal Band",
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
      <FeaturedMerch />
      <Newsletter />
    </>
  );
}

