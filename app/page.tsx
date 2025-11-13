import { Hero } from "@/components/home/hero";
import { FeaturedRelease } from "@/components/home/featured-release";
import { FeaturedMerch } from "@/components/home/featured-merch";
import { TourTicker } from "@/components/home/tour-ticker";
import { Newsletter } from "@/components/home/newsletter";

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

