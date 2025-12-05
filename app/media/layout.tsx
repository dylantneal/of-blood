import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photos & Videos | Of Blood Media Gallery - Death Metal Band",
  description: "Of Blood media gallery featuring live photos, music videos, behind-the-scenes content, and press materials. Explore the visual darkness of blackened death metal.",
  keywords: [
    "Of Blood photos",
    "Of Blood videos",
    "Of Blood media",
    "Of Blood gallery",
    "Of Blood live photos",
    "Of Blood music videos",
    "death metal photos",
    "Of Blood press photos",
    "Of Blood Instagram"
  ],
  openGraph: {
    title: "Photos & Videos | Of Blood",
    description: "Media gallery featuring live photos, music videos, and behind-the-scenes content from Of Blood.",
    url: "https://of-blood.com/media",
  },
  alternates: {
    canonical: "https://of-blood.com/media",
  },
};

export default function MediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


