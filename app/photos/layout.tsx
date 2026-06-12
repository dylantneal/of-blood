import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photos | Of Blood Live Shots & Visual Content",
  description: "Of Blood photo gallery featuring live shots, behind-the-scenes moments, and visual content. Explore the visual darkness of cosmic death metal.",
  keywords: [
    "Of Blood photos",
    "Of Blood gallery",
    "Of Blood live photos",
    "death metal photos",
    "Of Blood press photos",
    "Of Blood Instagram",
  ],
  openGraph: {
    title: "Photos | Of Blood",
    description: "Live photos, behind-the-scenes moments, and visual content from Of Blood.",
    url: "https://of-blood.com/photos",
  },
  alternates: {
    canonical: "https://of-blood.com/photos",
  },
};

export default function PhotosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
