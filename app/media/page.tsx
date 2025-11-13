import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";

export const metadata: Metadata = {
  title: "Media",
  description: "Photos, videos, and press materials from Of Blood.",
};

const videos = [
  {
    id: "1",
    title: "Blood Meridian (Official Music Video)",
    thumbnail: "/placeholder-video.jpg",
    url: "#",
  },
  {
    id: "2",
    title: "Gates Opening (Lyric Video)",
    thumbnail: "/placeholder-video.jpg",
    url: "#",
  },
  {
    id: "3",
    title: "Live at The Roxy 2025",
    thumbnail: "/placeholder-video.jpg",
    url: "#",
  },
];

const photos = Array.from({ length: 9 }, (_, i) => ({
  id: String(i + 1),
  url: "/placeholder-photo.jpg",
  alt: `Of Blood photo ${i + 1}`,
}));

export default function MediaPage() {
  return (
    <>
      {/* Header */}
      <Section className="pt-32 pb-16">
        <Container size="narrow" className="text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">Media</h1>
          <p className="text-xl text-foreground/70">
            Visuals from the void. Press materials and moments from the ritual.
          </p>
        </Container>
      </Section>

      {/* Videos */}
      <Section>
        <Container>
          <h2 className="font-display text-3xl font-bold mb-8">Videos</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <Card
                key={video.id}
                className="group overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
              >
                <CardContent className="p-0">
                  <a href={video.url} target="_blank" rel="noopener noreferrer">
                    <div className="relative aspect-video bg-muted">
                      {/* Placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/40 transition-colors">
                          <Play className="w-8 h-8 text-gold" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                    </div>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Photos */}
      <Section>
        <Container>
          <h2 className="font-display text-3xl font-bold mb-8">Photos</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square bg-muted overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer"
              >
                {/* Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-gold/30 text-4xl font-display">
                  OB
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

