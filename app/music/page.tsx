"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Play, Pause, Sparkles, Headphones, Waves } from "lucide-react";
import { useAudio } from "@/contexts/audio-context";
import { Release } from "@/lib/types";
import { formatTime, cn } from "@/lib/utils";
import { AnimatedBackground } from "@/components/home/animated-background";

const releasesData = require("@/data/releases.json") as Release[];

export default function MusicPage() {
  const { nowPlaying, isPlaying, playTrack, playPause } = useAudio();

  const firstPlayableRelease = releasesData.find((release: Release) =>
    release.tracks?.some((track) => track.audioUrl)
  );
  const firstPlayableIndex =
    firstPlayableRelease?.tracks?.findIndex((track) => track.audioUrl) ?? -1;

  const handlePlayRelease = (release: Release, trackIndex = 0) => {
    const targetTrack = release.tracks?.[trackIndex];
    if (targetTrack?.audioUrl) {
      playTrack(targetTrack, release, release.id, trackIndex);
    }
  };

  const handleTrackButton = (
    release: Release,
    trackIndex: number,
    playable: boolean,
    active: boolean
  ) => {
    if (!playable) return;
    if (active) {
      playPause();
    } else {
      handlePlayRelease(release, trackIndex);
    }
  };

  const handleHeroPlay = () => {
    if (!firstPlayableRelease || firstPlayableIndex === -1) return;
    handlePlayRelease(firstPlayableRelease, firstPlayableIndex);
  };

  const trackIsActive = (track: any, release: Release) =>
    nowPlaying?.track.title === track.title &&
    nowPlaying?.release.id === release.id;

  return (
    <>
      <Section className="relative isolate overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-background to-black" />
        <div className="absolute inset-0 opacity-70 mix-blend-screen">
          <AnimatedBackground />
        </div>
        <div className="absolute inset-x-0 -top-32 blur-3xl opacity-50 pointer-events-none">
          <div className="mx-auto h-80 w-80 bg-primary/40 rounded-full" />
        </div>
        <Container className="relative z-10">
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr] items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <p className="text-gold uppercase tracking-[0.3em] text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                Audio Archive
              </p>
              <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight">
                Music
              </h1>
              <p className="text-lg md:text-xl text-foreground/70 max-w-2xl">
                Lightning wrapped in chains. 
                Hear our songs of ruin directly from the source: no platforms, no distractions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleHeroPlay}
                  disabled={!firstPlayableRelease || firstPlayableIndex === -1}
                  className="uppercase tracking-widest"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Play Latest Ritual
                </Button>
                <Button variant="ghost" size="lg" asChild className="uppercase tracking-widest">
                  <a href="#releases">Explore Catalog</a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative border border-primary/30 bg-black/40 p-6 rounded-sm backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-gold/10 rounded-sm pointer-events-none" />
              <div className="relative flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-foreground/50">
                  <span className="flex items-center gap-2">
                    <Headphones className="w-4 h-4" />
                    Now Playing
                  </span>
                  <span className="flex items-center gap-2">
                    <Waves className="w-4 h-4" />
                    Live Feed
                  </span>
                </div>
                {nowPlaying ? (
                  <div className="flex gap-4 items-center">
                    <div className="relative w-20 h-20 flex-shrink-0 border border-line rounded-sm overflow-hidden">
                      {nowPlaying.release.cover ? (
                        <Image
                          src={nowPlaying.release.cover}
                          alt={nowPlaying.release.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gold/50">
                          <Play className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.3em] text-gold mb-1">
                        {nowPlaying.release.type}
                      </p>
                      <p className="font-display text-xl text-foreground line-clamp-1">
                        {nowPlaying.track.title}
                      </p>
                      <p className="text-sm text-foreground/60 line-clamp-1">
                        {nowPlaying.release.title}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center text-foreground/60 py-8 gap-3">
                    <Headphones className="w-8 h-8 text-gold/60" />
                    <p className="font-display text-lg">Silence Before the Storm</p>
                    <p className="text-sm">
                      Select a track below to awaken the blood streamer.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      <Section id="releases" className="pb-32 pt-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(179,10,10,0.08),_transparent_55%)] pointer-events-none" />
        <Container className="relative z-10">
          <div className="space-y-20">
            {releasesData.map((release: Release) => {
              const playableIndex =
                release.tracks?.findIndex((track) => track.audioUrl) ?? -1;
              const hasAudio = playableIndex > -1;

              return (
                <motion.article
                  key={release.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="grid gap-10 lg:grid-cols-[1fr_1.4fr] items-start border border-line/60 bg-black/40 p-4 sm:p-6 lg:p-8 relative overflow-hidden rounded-md"
                >
                  <div className="absolute inset-0 pointer-events-none opacity-40">
                    <div className="absolute -top-20 -right-10 w-72 h-72 bg-primary/20 blur-3xl" />
                    <div className="absolute -bottom-24 -left-10 w-64 h-64 bg-gold/10 blur-3xl" />
                  </div>
                  <div className="relative space-y-6">
                    <div className="relative group rounded-md overflow-hidden">
                      <div className="absolute inset-0 bg-primary/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative border border-line rounded-md overflow-hidden">
                        <div className="aspect-square w-full bg-muted flex items-center justify-center overflow-hidden">
                          {release.cover ? (
                            <Image
                              src={release.cover}
                              alt={release.title}
                              width={800}
                              height={800}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <Play className="w-12 h-12 text-gold/50" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gold text-xs uppercase tracking-[0.4em]">
                        {release.type} • {new Date(release.date).getFullYear()}
                      </p>
                      <h2 className="font-display text-3xl md:text-4xl font-bold">
                        {release.title}
                      </h2>
                      {release.description && (
                        <p className="text-foreground/70 text-base md:text-lg">
                          {release.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {hasAudio && (
                        <Button variant="ghost" onClick={() => handlePlayRelease(release, playableIndex)} className="uppercase tracking-[0.3em] flex items-center gap-2 border border-primary/50 hover:bg-primary/10">
                          <Play className="w-4 h-4" />
                          Play Release
                        </Button>
                      )}
                      {release.links.bandcamp && (
                        <Button variant="primary" asChild>
                          <a
                            href={release.links.bandcamp}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Bandcamp
                          </a>
                        </Button>
                      )}
                      {release.links.youtube && (
                        <Button variant="ghost" asChild>
                          <a
                            href={release.links.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            YouTube
                          </a>
                        </Button>
                      )}
                      {release.links.spotify && (
                        <Button variant="ghost" asChild>
                          <a
                            href={release.links.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Spotify
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="relative border border-line/70 bg-black/30">
                    <div className="border-b border-line/50 px-4 py-3 text-xs uppercase tracking-[0.4em] text-foreground/50 flex justify-between">
                      <span>Tracklist</span>
                      <span>Click to Play</span>
                    </div>
                    <div className="divide-y divide-line/40">
                      {release.tracks?.map((track, index) => {
                        const active = trackIsActive(track, release);
                        const playable = Boolean(track.audioUrl);

                        const displayIndex =
                          typeof track.n === "number"
                            ? track.n
                            : index + 1;

                        return (
                          <button
                            key={`${release.id}-${track.title}`}
                            onClick={() =>
                              handleTrackButton(release, index, playable, active)
                            }
                            disabled={!playable}
                            className={cn(
                              "w-full text-left flex items-center justify-between gap-4 px-4 py-4 transition-all",
                              playable
                                ? "hover:bg-primary/5"
                                : "opacity-50 cursor-not-allowed",
                              active && "bg-primary/10 border-l-2 border-primary"
                            )}
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <span className="text-gold font-mono text-sm min-w-[30px]">
                                {String(displayIndex).padStart(2, "0")}
                              </span>
                              <div className="min-w-0">
                                <p className="font-medium text-base text-foreground line-clamp-1">
                                  {track.title}
                                </p>
                                {track.duration && (
                                  <p className="text-xs text-foreground/60">
                                    {formatTime(track.duration)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-foreground/60">
                              {playable ? (
                                active && isPlaying ? (
                                  <Pause className="w-5 h-5 text-primary" />
                                ) : (
                                  <Play className="w-5 h-5" />
                                )
                              ) : (
                                <span className="text-xs uppercase tracking-[0.3em]">
                                  Locked
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}
