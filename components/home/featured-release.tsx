import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Play } from "lucide-react";

export function FeaturedRelease() {
  return (
    <Section className="bg-muted/30">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Album Art */}
          <div className="relative aspect-square w-full max-w-lg mx-auto lg:mx-0">
            <div className="absolute inset-0 bg-primary/20 blur-3xl" />
            <div className="relative border-2 border-gold/50 p-4">
              <div className="relative aspect-square bg-muted">
                {/* Replace with actual album art */}
                <div className="absolute inset-0 flex items-center justify-center text-gold/50">
                  <Play className="w-24 h-24" />
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-gold text-sm uppercase tracking-wider mb-2">Latest Release</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Tendrils of Descending Divinity
              </h2>
              <p className="text-foreground/70 text-lg mb-6">
                Our debut single. As its reach descended from above, the city descended into chaos. A Chicago metal anthem that scores the death of creation—where atmosphere, rage, and awe collapse into something vast and visceral.
              </p>
            </div>

            {/* Streaming Links */}
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" asChild>
                <a href="https://ofblood.bandcamp.com/track/tendrils-of-descending-divinity" target="_blank" rel="noopener noreferrer">
                  Bandcamp
                </a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="https://www.youtube.com/@OfBloodBand" target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
              </Button>
            </div>

            {/* Release Info */}
            <div className="pt-6 border-t border-line">
              <p className="text-sm uppercase tracking-wider text-gold mb-2">Release Date</p>
              <p className="text-foreground/70">November 8, 2025</p>
              <p className="text-sm uppercase tracking-wider text-gold mb-2 mt-4">Genre</p>
              <p className="text-foreground/70">Black Metal / Death Metal / Metalcore</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

