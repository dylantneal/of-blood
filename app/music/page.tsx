import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Play } from "lucide-react";

export const metadata: Metadata = {
  title: "Music",
  description: "Discography of Of Blood. Industrial occult metal releases.",
};

const releases = [
  {
    id: "1",
    title: "Tendrils of Descending Divinity",
    type: "Single",
    date: "2025-11-08",
    tracks: [
      { n: 1, title: "Tendrils of Descending Divinity" },
    ],
    links: {
      bandcamp: "https://ofblood.bandcamp.com/track/tendrils-of-descending-divinity",
      youtube: "https://www.youtube.com/@OfBloodBand",
      spotify: undefined,
    },
  },
];

export default function MusicPage() {
  return (
    <>
      {/* Header */}
      <Section className="pt-32 pb-16">
        <Container size="narrow" className="text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">Music</h1>
          <p className="text-xl text-foreground/70">
            Lightning wrapped in chains. Divinity descending through smoke and steel.
          </p>
        </Container>
      </Section>

      {/* Releases */}
      <Section>
        <Container>
          <div className="space-y-16">
            {releases.map((release) => (
              <div
                key={release.id}
                className="grid gap-12 lg:grid-cols-[1fr_2fr] items-start"
              >
                {/* Album Art */}
                <div className="relative aspect-square w-full max-w-md mx-auto lg:mx-0">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl" />
                  <div className="relative border-2 border-gold/50 p-4">
                    <div className="relative aspect-square bg-muted flex items-center justify-center">
                      <Play className="w-24 h-24 text-gold/50" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div>
                    <p className="text-gold text-sm uppercase tracking-wider mb-2">
                      {release.type} • {new Date(release.date).getFullYear()}
                    </p>
                    <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                      {release.title}
                    </h2>
                  </div>

                  {/* Streaming Links */}
                  <div className="flex flex-wrap gap-3">
                    {release.links.bandcamp && (
                      <Button variant="primary" asChild>
                        <a href={release.links.bandcamp} target="_blank" rel="noopener noreferrer">
                          Bandcamp
                        </a>
                      </Button>
                    )}
                    {release.links.youtube && (
                      <Button variant="ghost" asChild>
                        <a href={release.links.youtube} target="_blank" rel="noopener noreferrer">
                          YouTube
                        </a>
                      </Button>
                    )}
                    {release.links.spotify && (
                      <Button variant="ghost" asChild>
                        <a href={release.links.spotify} target="_blank" rel="noopener noreferrer">
                          Spotify
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Tracklist */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Tracklist</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-2">
                        {release.tracks.map((track) => (
                          <li
                            key={track.n}
                            className="flex items-baseline gap-3 text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                          >
                            <span className="text-gold font-mono text-sm min-w-[24px]">
                              {String(track.n).padStart(2, "0")}
                            </span>
                            <span>{track.title}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

