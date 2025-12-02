import type { Metadata } from "next";
import { MusicReleaseSchema } from "@/components/seo/structured-data";

const releasesData = require("@/data/releases.json");

export const metadata: Metadata = {
  title: "Music & Releases | Of Blood - Blackened Death Metal Discography",
  description: "Official discography of Of Blood featuring Tendrils of Descending Divinity and other blackened death metal releases. Stream tracks, download music, and explore the sonic darkness.",
  keywords: [
    "Of Blood music",
    "Of Blood discography",
    "Of Blood songs",
    "Tendrils of Descending Divinity",
    "Of Blood album",
    "death metal music",
    "blackened death metal songs",
    "Of Blood Bandcamp",
    "Of Blood Spotify"
  ],
  openGraph: {
    title: "Music & Releases | Of Blood",
    description: "Official discography of Of Blood. Blackened death metal exploring cosmic horror and apocalyptic themes.",
    url: "https://of-blood.com/music",
  },
  alternates: {
    canonical: "https://of-blood.com/music",
  },
};

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Add structured data for each release */}
      {releasesData.map((release: any) => (
        <MusicReleaseSchema
          key={release.id}
          title={release.title}
          type={release.type}
          date={release.date}
          cover={release.cover}
          description={release.description}
          tracks={release.tracks}
        />
      ))}
      {children}
    </>
  );
}

