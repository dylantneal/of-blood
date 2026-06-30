"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Play, Pause, Sparkles, Headphones, Waves, Expand, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAudio } from "@/contexts/audio-context";
import { Release, TrackLyrics, LyricLine } from "@/lib/types";
import { formatTime, cn } from "@/lib/utils";
import { AnimatedBackground } from "@/components/home/animated-background";
import { MusicReleaseSchema } from "@/components/seo/structured-data";
import { useLyricsSync, loadLyrics } from "@/hooks/use-lyrics-sync";

import releasesDataJson from "@/data/releases.json";

const releasesData = releasesDataJson as Release[];
const MUSIC_PLATFORM_LINKS = [
  {
    name: "Spotify",
    url: "https://open.spotify.com/artist/6bnYniIgW2iRKvMeMvNqfW",
  },
  {
    name: "Apple Music",
    url: "https://music.apple.com/us/artist/of-blood/6785117215",
  },
  {
    name: "YouTube Music",
    url: "https://music.youtube.com/channel/UCVS7ytVPsU3ZO9RLWyVxbng",
  },
];

function SpotifyLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0Zm5.505 17.307a.74.74 0 0 1-1.02.25 10.898 10.898 0 0 0-11 0 .74.74 0 1 1-.77-1.263 12.377 12.377 0 0 1 12.54 0 .74.74 0 0 1 .25 1.013Zm1.457-2.893a.926.926 0 0 1-1.276.313 13.645 13.645 0 0 0-13.372 0 .926.926 0 0 1-.963-1.582 15.5 15.5 0 0 1 15.31 0 .926.926 0 0 1 .301 1.27Zm.131-3.012a16.406 16.406 0 0 0-14.86 0 1.11 1.11 0 1 1-1.01-1.977 18.632 18.632 0 0 1 16.88 0 1.11 1.11 0 1 1-1.01 1.977Z" />
    </svg>
  );
}

function YouTubeMusicLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M10.015 14.97V9.03L15 12l-4.985 2.97Zm1.985 7.03A10 10 0 1 1 22 12a10.011 10.011 0 0 1-10 10Zm0-18.5A8.5 8.5 0 1 0 20.5 12 8.51 8.51 0 0 0 12 3.5Zm0 2.375A6.125 6.125 0 1 1 5.875 12 6.132 6.132 0 0 1 12 5.875Zm0 10.75A4.625 4.625 0 1 0 7.375 12 4.63 4.63 0 0 0 12 16.625Z" />
    </svg>
  );
}

function AppleMusicLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M19.665 16.537c-.286.658-.625 1.264-1.016 1.82-.533.752-.968 1.27-1.31 1.554-.53.466-1.098.704-1.706.715-.436 0-1.021-.124-1.754-.376-.736-.25-1.413-.375-2.034-.375-.65 0-1.346.124-2.086.375-.741.252-1.336.382-1.784.391-.583.024-1.167-.22-1.754-.73-.374-.327-.829-.864-1.363-1.613-.573-.8-1.044-1.726-1.414-2.78-.397-1.137-.595-2.238-.595-3.302 0-1.218.263-2.27.79-3.154.412-.709.96-1.268 1.646-1.678a4.43 4.43 0 0 1 2.224-.639c.492 0 1.138.153 1.94.457.8.305 1.314.458 1.54.458.17 0 .745-.18 1.724-.538.926-.334 1.708-.473 2.347-.416 1.732.14 3.033.824 3.902 2.054-1.55.94-2.319 2.258-2.308 3.949.01 1.32.493 2.419 1.448 3.295.433.405.916.718 1.45.94-.117.34-.24.67-.375.988ZM14.49 2.273c0 .939-.343 1.816-1.028 2.63-.826.968-1.826 1.528-2.91 1.44a2.927 2.927 0 0 1-.022-.356c0-.901.393-1.865 1.092-2.655.35-.4.795-.733 1.335-1 .54-.263 1.05-.41 1.526-.432.014.125.022.249.022.373Z" />
    </svg>
  );
}

// Scrolling text component for long titles
function ScrollingText({ 
  text, 
  className = "" 
}: { 
  text: string; 
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;

    const updateScrollState = () => {
      setShouldScroll(textEl.scrollWidth > container.offsetWidth);
    };

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(container);
    observer.observe(textEl);
    return () => observer.disconnect();
  }, [text]);

  if (!shouldScroll) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <span ref={textRef}>{text}</span>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`overflow-hidden relative ${className}`}
    >
      <motion.span
        ref={textRef}
        className="inline-block whitespace-nowrap"
        animate={{
          x: ["0%", "-100%", "-100%", "0%"],
        }}
        transition={{
          x: {
            duration: 8,
            ease: "easeInOut",
            times: [0, 0.4, 0.6, 1],
            repeat: Infinity,
            repeatDelay: 2,
          },
        }}
        style={{ paddingRight: "50px" }}
      >
        {text}
      </motion.span>
    </div>
  );
}

// Inline lyrics display component for tracklist
function InlineLyrics({ 
  lyrics, 
  currentTime 
}: { 
  lyrics: TrackLyrics; 
  currentTime: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetScrollRef = useRef<number>(0);
  const currentScrollRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const hasInitialScrolled = useRef(false);
  
  // Use the lyrics sync hook for consistent timing logic and focus values
  const { currentLineIndex, lineFocusValues, currentLineProgress } = useLyricsSync({
    currentTime,
    lyrics,
    offset: 0,
    anticipationWindow: 0.6,
    lingerWindow: 0.4,
  });

  // Filter to lines with text
  const linesWithText = useMemo(() => 
    lyrics.lines
      .map((line, index) => ({ ...line, originalIndex: index }))
      .filter((line) => line.text !== null),
    [lyrics.lines]
  );

  // Find current display index
  const currentDisplayIndex = useMemo(() => 
    linesWithText.findIndex((l) => l.originalIndex === currentLineIndex),
    [linesWithText, currentLineIndex]
  );

  // Scroll to current line - helper function
  const scrollToCurrentLine = useCallback((immediate = false) => {
    if (!containerRef.current || currentDisplayIndex < 0) return;
    
    const container = containerRef.current;
    const lineElements = container.querySelectorAll('[data-lyric-line]');
    const currentElement = lineElements[currentDisplayIndex] as HTMLElement;
    
    if (!currentElement) return;

    const elementRect = currentElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const relativeTop = elementRect.top - containerRect.top;
    const desiredPosition = 40;
    const scrollAdjustment = relativeTop - desiredPosition;
    
    const newScrollTop = Math.max(0, container.scrollTop + scrollAdjustment);
    
    if (immediate) {
      // Immediate scroll (for initial mount)
      container.scrollTop = newScrollTop;
      currentScrollRef.current = newScrollTop;
      targetScrollRef.current = newScrollTop;
      return;
    }
    
    targetScrollRef.current = newScrollTop;

    // Start animation if not running
    if (rafRef.current === null) {
      currentScrollRef.current = container.scrollTop;
      
      const animate = () => {
        const container = containerRef.current;
        if (!container) {
          rafRef.current = null;
          return;
        }

        const current = currentScrollRef.current;
        const target = targetScrollRef.current;
        const diff = target - current;

        // Spring-like smoothing
        const smoothing = 0.1;
        const newScroll = current + diff * smoothing;

        if (Math.abs(diff) < 0.5) {
          container.scrollTop = target;
          rafRef.current = null;
          currentScrollRef.current = target;
          return;
        }

        container.scrollTop = newScroll;
        currentScrollRef.current = newScroll;
        rafRef.current = requestAnimationFrame(animate);
      };

      rafRef.current = requestAnimationFrame(animate);
    }
  }, [currentDisplayIndex]);

  // Initial scroll on mount - immediate scroll to current position
  useEffect(() => {
    if (!hasInitialScrolled.current && currentDisplayIndex >= 0) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        scrollToCurrentLine(true);
        hasInitialScrolled.current = true;
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentDisplayIndex, scrollToCurrentLine]);

  // Smooth scroll when line changes (after initial)
  useEffect(() => {
    if (hasInitialScrolled.current) {
      scrollToCurrentLine(false);
    }
  }, [currentDisplayIndex, scrollToCurrentLine]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div 
        ref={containerRef}
        className="max-h-96 overflow-y-auto scrollbar-hide px-4 bg-black/40 border-t border-line/30"
      >
        <div className="space-y-3 py-6">
          {linesWithText.map((line, displayIndex) => {
            const focus = lineFocusValues[line.originalIndex] ?? 0;
            const isPast = displayIndex < currentDisplayIndex;
            
            // Smoother opacity calculation
            let opacity: number;
            if (focus > 0.8) {
              opacity = 1;
            } else if (focus > 0.3) {
              opacity = 0.5 + focus * 0.5;
            } else if (isPast) {
              opacity = 0.3;
            } else {
              opacity = 0.5;
            }
            
            const scale = focus > 0.5 ? 1 + focus * 0.05 : 1;
            
            return (
              <p
                key={`${line.originalIndex}-${line.text}`}
                data-lyric-line
                className={cn(
                  "font-display text-sm md:text-base origin-left will-change-transform",
                  focus > 0.8 && "text-primary font-semibold",
                  focus > 0.3 && focus <= 0.8 && "text-primary/80 font-medium",
                  focus <= 0.3 && isPast && "text-foreground/30",
                  focus <= 0.3 && !isPast && "text-foreground/50"
                )}
                style={{
                  opacity,
                  transform: `scale(${scale})`,
                  textShadow: focus > 0.5 
                    ? `0 0 ${10 + focus * 15}px rgba(179, 10, 10, ${focus * 0.5})` 
                    : undefined,
                  transition: "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1), color 300ms cubic-bezier(0.4, 0, 0.2, 1), text-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {line.text}
              </p>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
export default function MusicPage() {
  const router = useRouter();
  const { nowPlaying, isPlaying, currentTime, playTrack, playPause } = useAudio();
  const [lyrics, setLyrics] = useState<TrackLyrics | null>(null);

  // Load lyrics when track changes
  useEffect(() => {
    let cancelled = false;
    const lyricsUrl = nowPlaying?.track.lyricsUrl;

    if (!lyricsUrl) {
      void Promise.resolve().then(() => {
        if (!cancelled) setLyrics(null);
      });
      return () => {
        cancelled = true;
      };
    }

    loadLyrics(lyricsUrl).then((loadedLyrics) => {
      if (!cancelled) setLyrics(loadedLyrics);
    });

    return () => {
      cancelled = true;
    };
  }, [nowPlaying?.track.lyricsUrl]);

  // Get track slug for experience URL
  const getTrackSlug = (track: any) => {
    return track.slug || track.title.toLowerCase().replace(/\s+/g, "-");
  };

  // Navigate to immersive experience
  const enterExperience = (track: any) => {
    const slug = getTrackSlug(track);
    router.push(`/music/experience/${slug}`);
  };

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
      <Section className="relative isolate overflow-hidden pt-32 pb-8 md:pb-10">
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
                Discography
              </p>
              <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight">
                Music
              </h1>
              <p className="text-lg md:text-xl text-foreground/70 max-w-2xl">
                Stream, download, and enter the immersive experience.
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleHeroPlay}
                  disabled={!firstPlayableRelease || firstPlayableIndex === -1}
                  className="uppercase tracking-widest"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Play Latest Release
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative border border-primary/30 bg-black/40 p-6 rounded-sm backdrop-blur-xl w-[420px] lg:w-[500px]"
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
                  <div className="space-y-4">
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
                      <div className="min-w-0 flex-1">
                        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-1">
                          {nowPlaying.release.type}
                        </p>
                        <ScrollingText 
                          text={nowPlaying.track.title}
                          className="font-display text-xl text-foreground"
                        />
                        <ScrollingText 
                          text={nowPlaying.release.title}
                          className="text-sm text-foreground/60"
                        />
                      </div>
                    </div>
                    {/* Enter Experience Button */}
                    <button
                      onClick={() => enterExperience(nowPlaying.track)}
                      className="w-full py-3 px-4 bg-primary hover:bg-primary/90 rounded-sm text-sm uppercase tracking-[0.2em] text-white font-medium transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(179,10,10,0.4)] hover:shadow-[0_0_30px_rgba(179,10,10,0.6)]"
                    >
                      <Expand className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Enter Immersive
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center text-foreground/60 py-8 gap-3">
                    <Headphones className="w-8 h-8 text-gold/60" />
                    <p className="font-display text-lg">Nothing Playing</p>
                    <p className="text-sm">
                      Select a track below to start listening.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      <Section id="releases" className="pb-32 pt-6 md:pt-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(179,10,10,0.08),_transparent_55%)] pointer-events-none" />
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-2 md:-mt-10 flex items-start justify-center gap-8 md:gap-14 pb-12 md:pb-14"
          >
            {MUSIC_PLATFORM_LINKS.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
              >
                <Link
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Listen on ${platform.name}`}
                  className="group w-32 md:w-36 flex flex-col items-center gap-3 text-center"
                >
                  <motion.span
                    animate={{
                      boxShadow: [
                        "0 0 0 1px rgba(179,10,10,0.24), 0 0 12px rgba(179,10,10,0.16)",
                        "0 0 0 1px rgba(179,10,10,0.30), 0 0 18px rgba(179,10,10,0.22)",
                        "0 0 0 1px rgba(179,10,10,0.42), 0 0 28px rgba(179,10,10,0.32)",
                        "0 0 0 1px rgba(179,10,10,0.30), 0 0 18px rgba(179,10,10,0.22)",
                        "0 0 0 1px rgba(179,10,10,0.24), 0 0 12px rgba(179,10,10,0.16)",
                      ],
                      scale: [1, 1.006, 1.012, 1.006, 1],
                      color: [
                        "rgba(229, 229, 229, 0.86)",
                        "rgba(206, 120, 120, 0.9)",
                        "rgba(179, 10, 10, 0.96)",
                        "rgba(206, 120, 120, 0.9)",
                        "rgba(229, 229, 229, 0.86)",
                      ],
                    }}
                    transition={{
                      duration: 7.2,
                      repeat: Infinity,
                      ease: [0.4, 0, 0.2, 1],
                      times: [0, 0.25, 0.5, 0.75, 1],
                    }}
                    className="inline-flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-md border border-line/70 bg-black/40 text-foreground/80 group-hover:text-foreground group-hover:border-primary/60 group-hover:bg-primary/10 transition-all"
                  >
                    {platform.name === "Spotify" ? (
                      <SpotifyLogo className="h-8 w-8 md:h-10 md:w-10 drop-shadow-[0_0_10px_rgba(179,10,10,0.28)]" />
                    ) : platform.name === "Apple Music" ? (
                      <AppleMusicLogo className="h-8 w-8 md:h-10 md:w-10 translate-x-[0.5px] -translate-y-[1px] drop-shadow-[0_0_10px_rgba(179,10,10,0.28)]" />
                    ) : (
                      <YouTubeMusicLogo className="h-8 w-8 md:h-10 md:w-10 drop-shadow-[0_0_10px_rgba(179,10,10,0.28)]" />
                    )}
                  </motion.span>
                  <span className="text-xs md:text-sm uppercase tracking-[0.2em] text-foreground/70 group-hover:text-foreground transition-colors">
                    {platform.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
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
                    {hasAudio && (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap gap-3">
                          <Button variant="ghost" onClick={() => handlePlayRelease(release, playableIndex)} className="uppercase tracking-[0.3em] flex items-center gap-2 border border-primary/50 hover:bg-primary/10">
                            <Play className="w-4 h-4" />
                            Play Release
                          </Button>
                        </div>
                        <button
                          onClick={() => {
                            window.location.href = `/api/download/${release.id}`;
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold/10 hover:bg-gold/20 border border-gold/30 hover:border-gold/50 rounded-sm text-gold hover:text-gold-light text-xs uppercase tracking-[0.2em] transition-all group w-fit"
                        >
                          <Download className="w-4 h-4 group-hover:animate-bounce" />
                          Download Release (Free)
                        </button>
                      </div>
                    )}
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
                        const showLyrics = active && lyrics && track.lyricsUrl;

                        const displayIndex =
                          typeof track.n === "number"
                            ? track.n
                            : index + 1;

                        return (
                          <div key={`${release.id}-${track.title}`}>
                            <button
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
                            
                            {/* Inline lyrics - appears when track is playing */}
                            <AnimatePresence>
                              {showLyrics && (
                                <InlineLyrics 
                                  lyrics={lyrics} 
                                  currentTime={currentTime} 
                                />
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Immersive Experience CTA */}
          {releasesData[0]?.tracks?.[0] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-24 flex flex-col items-center"
            >
              {/* The button - matching site style but larger */}
              <button
                onClick={() => enterExperience(releasesData[0].tracks![0])}
                className="group relative"
              >
                {/* Pulsing red glow behind */}
                <div className="absolute -inset-6 bg-primary/50 rounded-sm blur-2xl animate-pulse" />
                <div className="absolute -inset-10 bg-primary/30 rounded-sm blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                
                {/* Button - matching the site's primary button style */}
                <div className="relative px-16 md:px-24 py-5 bg-primary hover:bg-primary/90 rounded-sm text-lg md:text-xl uppercase tracking-[0.2em] text-white font-medium transition-all flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(179,10,10,0.5)] hover:shadow-[0_0_50px_rgba(179,10,10,0.7)] hover:scale-105 active:scale-100 border border-primary/50">
                  <Expand className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-display whitespace-nowrap">Enter Immersive View</span>
                  <Expand className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
              </button>
            </motion.div>
          )}
        </Container>
      </Section>
    </>
  );
}
