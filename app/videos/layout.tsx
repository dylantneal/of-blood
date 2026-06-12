import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Videos | Of Blood Music Videos & Live Performances",
  description: "Watch Of Blood music videos, live performances, and behind-the-scenes content. Experience cosmic death metal in motion.",
  keywords: [
    "Of Blood videos",
    "Of Blood music videos",
    "Of Blood live",
    "Of Blood YouTube",
    "death metal videos",
    "cosmic death metal live",
  ],
  openGraph: {
    title: "Videos | Of Blood",
    description: "Music videos, live performances, and behind-the-scenes content from Of Blood.",
    url: "https://of-blood.com/videos",
  },
  alternates: {
    canonical: "https://of-blood.com/videos",
  },
};

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
