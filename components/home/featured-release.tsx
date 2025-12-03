import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Play, Sparkles } from "lucide-react";
import { getLatestRelease } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { PlayReleaseButton } from "./play-release-button";

export async function FeaturedRelease() {
  const release = await getLatestRelease();

  if (!release) {
    return null;
  }

  const releaseDate = formatDate(release.date);
  
  // Get the first track's slug for immersive experience link
  const firstTrack = release.tracks?.[0];
  const firstTrackSlug = firstTrack?.slug || firstTrack?.title?.toLowerCase().replace(/\s+/g, "-");

  return (
    <Section className="bg-muted/30">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Album Art */}
          <div className="relative aspect-square w-full max-w-lg mx-auto lg:mx-0">
            <div className="absolute inset-0 bg-primary/20 blur-3xl" />
            <div className="relative border-2 border-gold/50 p-4">
              <div className="relative aspect-square bg-muted overflow-hidden">
                {release.cover ? (
                  <Image
                    src={release.cover}
                    alt={release.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gold/50">
                    <Play className="w-24 h-24" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-gold text-sm uppercase tracking-wider mb-2">Latest Release</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                {release.title}
              </h2>
              {release.description && (
                <p className="text-foreground/70 text-lg mb-6">
                  {release.description}
                </p>
              )}
            </div>

            {/* Action Links */}
            <div className="flex flex-wrap gap-3">
              {firstTrack && (
                <PlayReleaseButton 
                  release={release} 
                  track={firstTrack} 
                  trackIndex={0} 
                />
              )}
              {firstTrackSlug && (
                <Button variant="primary" asChild>
                  <Link href={`/music/experience/${firstTrackSlug}`} className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Immersive Experience
                  </Link>
                </Button>
              )}
              <Button variant="ghost" asChild>
                <Link href="/music" className="flex items-center gap-2">
                  View All Music
                </Link>
              </Button>
            </div>

            {/* Release Info */}
            <div className="pt-6 border-t border-line">
              <p className="text-sm uppercase tracking-wider text-gold mb-2">Release Date</p>
              <p className="text-foreground/70">{releaseDate}</p>
              <p className="text-sm uppercase tracking-wider text-gold mb-2 mt-4">Type</p>
              <p className="text-foreground/70">{release.type}</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

