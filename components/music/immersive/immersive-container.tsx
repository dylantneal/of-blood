"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useAudio } from "@/contexts/audio-context";
import { useLyricsSync, loadLyrics } from "@/hooks/use-lyrics-sync";
import { useAudioAnalyzer } from "@/hooks/use-audio-analyzer";
import { ReactiveBackground } from "./reactive-background";
import { LyricsDisplay } from "./lyrics-display";
import { ImmersiveControls } from "./immersive-controls";
import { Track, Release, TrackTheme, TrackLyrics, AudioAnalysis } from "@/lib/types";
import { cn } from "@/lib/utils";

// Default theme if track doesn't have one
const DEFAULT_THEME: TrackTheme = {
  colors: {
    primary: "#B30A0A",
    secondary: "#4A1A6B",
    background: "#0A0A0A",
    text: "#E8E8E8",
    highlight: "#FF2020",
    glow: "rgba(179, 10, 10, 0.6)",
  },
  background: {
    gradient: "radial-gradient(ellipse at top, #1a0a20 0%, #0d0510 40%, #0A0A0A 100%)",
    overlay: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)",
  },
  particles: {
    type: "tendrils",
    density: 0.5,
    speed: 0.8,
    direction: "down",
    audioReactivity: 0.6,
  },
  albumArt: {
    effect: "breathe",
    audioReactivity: 0.5,
  },
};

// Default audio analysis when analyzer not available
const DEFAULT_ANALYSIS: AudioAnalysis = {
  bass: 0,
  mids: 0,
  highs: 0,
  overall: 0,
};

type ImmersiveContainerProps = {
  track: Track;
  release: Release;
};

export function ImmersiveContainer({ track, release }: ImmersiveContainerProps) {
  const router = useRouter();
  const {
    nowPlaying,
    isPlaying,
    currentTime,
    duration,
    volume,
    playTrack,
    playPause,
    seek,
    setVolume,
    playNext,
    playPrevious,
  } = useAudio();

  const [lyrics, setLyrics] = useState<TrackLyrics | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const theme = track.theme || DEFAULT_THEME;

  // Get audio element from DOM (hidden element in AudioProvider)
  useEffect(() => {
    // Small delay to ensure audio element is mounted
    const timer = setTimeout(() => {
      const audio = document.querySelector("audio") as HTMLAudioElement | null;
      setAudioElement(audio);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Audio analyzer hook
  const analysis = useAudioAnalyzer(audioElement, {
    enabled: isPlaying,
    fftSize: 256,
    smoothingTimeConstant: 0.8,
  });

  // Lyrics sync hook
  const {
    currentLine,
    currentLineIndex,
    currentSection,
    intensity,
  } = useLyricsSync({
    currentTime,
    lyrics,
    offset: 0,
  });

  // Load lyrics
  useEffect(() => {
    if (track.lyricsUrl) {
      loadLyrics(track.lyricsUrl).then(setLyrics);
    }
  }, [track.lyricsUrl]);

  // Auto-play track if not already playing
  useEffect(() => {
    const trackIndex = release.tracks?.findIndex((t) => t.slug === track.slug || t.title === track.title) ?? 0;
    
    // Only auto-play if this track isn't already playing
    if (!nowPlaying || nowPlaying.track.title !== track.title || nowPlaying.release.id !== release.id) {
      if (track.audioUrl) {
        playTrack(track, release, release.id, trackIndex);
      }
    }
    
    setIsLoaded(true);
  }, [track, release, nowPlaying, playTrack]);

  // Handle seek from lyrics click
  const handleLyricsSeek = useCallback((time: number) => {
    seek(time);
  }, [seek]);

  // Handle close - return to music page
  const handleClose = useCallback(() => {
    router.push("/music");
  }, [router]);

  // Keyboard support - Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  // Check for next/previous tracks
  const currentTrackIndex = release.tracks?.findIndex((t) => t.slug === track.slug || t.title === track.title) ?? 0;
  const hasNext = (release.tracks?.length ?? 0) > currentTrackIndex + 1;
  const hasPrevious = currentTrackIndex > 0;

  // Calculate album art animation based on audio
  const albumArtScale = 1 + (analysis?.overall ?? 0) * theme.albumArt.audioReactivity * 0.05;
  const albumArtGlow = (analysis?.bass ?? 0) * theme.albumArt.audioReactivity;

  // Set CSS variables for theme
  useEffect(() => {
    document.documentElement.style.setProperty("--immersive-primary", theme.colors.primary);
    document.documentElement.style.setProperty("--immersive-secondary", theme.colors.secondary);
    document.documentElement.style.setProperty("--immersive-highlight", theme.colors.highlight);
    document.documentElement.style.setProperty("--immersive-glow", theme.colors.glow);
    
    return () => {
      document.documentElement.style.removeProperty("--immersive-primary");
      document.documentElement.style.removeProperty("--immersive-secondary");
      document.documentElement.style.removeProperty("--immersive-highlight");
      document.documentElement.style.removeProperty("--immersive-glow");
    };
  }, [theme]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-40 overflow-hidden"
        style={{ background: theme.colors.background }}
      >
        {/* Reactive Background with Particles */}
        <ReactiveBackground
          theme={theme}
          analysis={analysis || DEFAULT_ANALYSIS}
          intensity={intensity}
          isPlaying={isPlaying}
        />

        {/* Main Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Close Button - Top Right */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            onClick={handleClose}
            className="fixed top-4 right-4 md:top-6 md:right-6 z-50 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-black/60 hover:border-white/20 transition-all group"
            aria-label="Exit immersive mode (Escape)"
            title="Exit (Esc)"
          >
            <X className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform duration-200" />
          </motion.button>

          {/* Header spacer for mobile status bar */}
          <div className="h-safe-top" />

          {/* Content Area */}
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-6 md:px-12 lg:px-20 pt-8 pb-32 overflow-hidden">
            {/* Left Column: Album Art + Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-col items-center lg:items-start gap-6 flex-shrink-0"
            >
              {/* Album Art */}
              <motion.div
                className="relative w-72 h-72 md:w-[26rem] md:h-[26rem] lg:w-[32rem] lg:h-[32rem]"
                animate={{
                  scale: theme.albumArt.effect === "breathe" ? albumArtScale : 1,
                }}
                transition={{ duration: 0.1 }}
              >
                {/* Glow effect behind album art */}
                <div
                  className="absolute -inset-8 rounded-lg blur-3xl transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle, ${theme.colors.glow} 0%, transparent 70%)`,
                    opacity: 0.3 + albumArtGlow * 0.5,
                  }}
                />
                
                {/* Album art image */}
                <div className="relative w-full h-full border border-white/10 rounded-lg overflow-hidden shadow-2xl">
                  {release.cover ? (
                    <Image
                      src={release.cover}
                      alt={release.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-black/50 flex items-center justify-center">
                      <span className="font-display text-4xl text-foreground/20">OB</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Track Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-center lg:text-left"
              >
                <h1
                  className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-2"
                  style={{
                    color: theme.colors.text,
                    textShadow: `0 0 40px ${theme.colors.glow}`,
                  }}
                >
                  {track.title}
                </h1>
                <p className="text-sm md:text-base text-foreground/60">
                  {release.title}
                  <span className="mx-2">•</span>
                  {release.type}
                  <span className="mx-2">•</span>
                  {new Date(release.date).getFullYear()}
                </p>
                
                {/* Section indicator */}
                {currentSection && (
                  <motion.p
                    key={currentSection.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-xs uppercase tracking-[0.3em]"
                    style={{ color: theme.colors.primary }}
                  >
                    {currentSection.name}
                  </motion.p>
                )}
              </motion.div>
            </motion.div>

            {/* Right Column: Lyrics */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex-1 w-full max-w-xl lg:max-w-2xl h-[40vh] lg:h-[60vh]"
            >
              <LyricsDisplay
                lyrics={lyrics}
                currentLineIndex={currentLineIndex}
                currentLine={currentLine}
                theme={theme}
                intensity={intensity}
                onSeek={handleLyricsSeek}
                className="h-full"
              />
            </motion.div>
          </div>

          {/* Controls */}
          <ImmersiveControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            theme={theme}
            onPlayPause={playPause}
            onSeek={seek}
            onVolumeChange={setVolume}
            onNext={hasNext ? playNext : undefined}
            onPrevious={hasPrevious ? playPrevious : undefined}
            onClose={handleClose}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

