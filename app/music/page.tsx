"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Play, Pause } from "lucide-react";
import { useAudio } from "@/contexts/audio-context";
import { Release } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import Image from "next/image";

// Note: This is a client component, so we'll fetch data differently
// For now, we'll import the JSON directly. In production, you might want
// to use a server component wrapper or API route.

const releasesData = require("@/data/releases.json") as Release[];

export default function MusicPage() {
  const { nowPlaying, isPlaying, playTrack } = useAudio();

  const handleTrackClick = (track: any, release: Release, releaseId: string, trackIndex: number) => {
    if (track.audioUrl) {
      playTrack(track, release, releaseId, trackIndex);
    }
  };

  const isTrackPlaying = (track: any, release: Release) => {
    return (
      nowPlaying?.track.title === track.title &&
      nowPlaying?.release.id === release.id
    );
  };

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
      <Section className="pb-32">
        <Container>
          <div className="space-y-16">
            {releasesData.map((release) => (
              <div
                key={release.id}
                className="grid gap-12 lg:grid-cols-[1fr_2fr] items-start"
              >
                {/* Album Art */}
                <div className="relative aspect-square w-full max-w-md mx-auto lg:mx-0">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl" />
                  <div className="relative border-2 border-gold/50 p-4">
                    <div className="relative aspect-square bg-muted flex items-center justify-center overflow-hidden">
                      {release.cover && release.cover !== "/images/covers/tendrils-single.jpg" ? (
                        <Image
                          src={release.cover}
                          alt={release.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Play className="w-24 h-24 text-gold/50" />
                      )}
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
                    {release.description && (
                      <p className="text-foreground/70 text-lg mb-6">
                        {release.description}
                      </p>
                    )}
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
                        {release.tracks?.map((track, index) => {
                          const trackIsPlaying = isTrackPlaying(track, release);
                          const hasAudio = !!track.audioUrl;

                          return (
                            <li
                              key={track.n}
                              onClick={() => hasAudio && handleTrackClick(track, release, release.id, index)}
                              className={`flex items-center gap-3 p-3 rounded-sm transition-all ${
                                hasAudio
                                  ? "cursor-pointer hover:bg-muted/50 hover:text-foreground"
                                  : "cursor-default"
                              } ${
                                trackIsPlaying
                                  ? "bg-primary/10 text-primary border-l-2 border-primary pl-2"
                                  : "text-foreground/70"
                              }`}
                            >
                              <span className="text-gold font-mono text-sm min-w-[24px]">
                                {String(track.n).padStart(2, "0")}
                              </span>
                              <span className="flex-1">{track.title}</span>
                              {hasAudio && (
                                <div className="flex items-center gap-2">
                                  {track.duration && track.duration > 0 && (
                                    <span className="text-xs text-foreground/50 font-mono">
                                      {formatTime(track.duration)}
                                    </span>
                                  )}
                                  {trackIsPlaying && isPlaying ? (
                                    <Pause className="w-4 h-4 text-primary" />
                                  ) : (
                                    <Play className="w-4 h-4" />
                                  )}
                                </div>
                              )}
                            </li>
                          );
                        })}
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
