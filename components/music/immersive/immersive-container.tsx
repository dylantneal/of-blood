"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAudio } from "@/contexts/audio-context";
import { useLyricsSync, loadLyrics } from "@/hooks/use-lyrics-sync";
import { useAudioAnalyzer } from "@/hooks/use-audio-analyzer";
import { ReactiveBackground } from "./reactive-background";
import { LyricsDisplay } from "./lyrics-display";
import { ImmersiveControls } from "./immersive-controls";
import { EyeEffect } from "./eye-effect";
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

export function ImmersiveContainer({ track: initialTrack, release: initialRelease }: ImmersiveContainerProps) {
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cursorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use nowPlaying for current track/release, fall back to initial props
  const currentTrack = useMemo(() => {
    return nowPlaying?.track || initialTrack;
  }, [nowPlaying?.track, initialTrack]);

  const currentRelease = useMemo(() => {
    return nowPlaying?.release || initialRelease;
  }, [nowPlaying?.release, initialRelease]);

  // Theme is derived from the CURRENT track (reactive to track changes)
  const theme = useMemo(() => {
    return currentTrack.theme || DEFAULT_THEME;
  }, [currentTrack.theme]);

  // Layout configuration with defaults
  const layout = useMemo(() => {
    return theme.layout || {
      type: 'default' as const,
      albumArt: 'always' as const,
      centerpiece: 'album' as const,
      lyricsPosition: 'right' as const,
      introEndTime: 20,
    };
  }, [theme.layout]);

  // Visual effect configuration
  const visualEffect = useMemo(() => {
    return theme.visualEffect || { type: 'none', intensity: 0.5, audioReactivity: 0.5 };
  }, [theme.visualEffect]);

  // Get audio element from DOM (hidden element in AudioProvider)
  useEffect(() => {
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
    lineFocusValues,
    currentLineProgress,
  } = useLyricsSync({
    currentTime,
    lyrics,
    offset: 0,
  });

  // Determine if album art should be visible based on layout config and section
  const showAlbumArt = useMemo(() => {
    if (layout.albumArt === 'always') return true;
    if (layout.albumArt === 'never') return false;
    if (layout.albumArt === 'intro-only') {
      return currentSection?.name?.toLowerCase().includes('intro') || currentTime < 20;
    }
    if (layout.albumArt === 'instrumental-only') {
      return currentSection?.type === 'instrumental';
    }
    return true;
  }, [layout.albumArt, currentSection, currentTime]);

  // Determine layout style based on config
  const layoutStyle = useMemo(() => {
    if (layout.centerpiece === 'eye' || visualEffect.type === 'eye') {
      return 'eye-centered';
    }
    if (layout.type === 'centered' || layout.lyricsPosition === 'center') {
      return 'centered';
    }
    if (layout.type === 'minimal') {
      return 'minimal';
    }
    return 'default';
  }, [layout, visualEffect]);

  // Load lyrics whenever the current track changes
  useEffect(() => {
    const lyricsUrl = currentTrack.lyricsUrl;
    if (lyricsUrl) {
      setLyrics(null);
      loadLyrics(lyricsUrl).then(setLyrics);
    } else {
      setLyrics(null);
    }
  }, [currentTrack.lyricsUrl, currentTrack.title]);


  // Auto-play track when entering immersive view (only on initial mount)
  useEffect(() => {
    if (isLoaded) return;
    
    // If something is already playing, just let it continue
    // Don't toggle playback state - this can cause audio glitches
    if (nowPlaying) {
      setIsLoaded(true);
      return;
    }
    
    // Nothing is playing - start playing the track from the URL
    const trackIndex = initialRelease.tracks?.findIndex(
      (t) => t.slug === initialTrack.slug || t.title === initialTrack.title
    ) ?? 0;
    
    if (initialTrack.audioUrl) {
      playTrack(initialTrack, initialRelease, initialRelease.id, trackIndex);
    }
    
    setIsLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Auto-enter fullscreen on mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch (err) {
        // User denied fullscreen or browser doesn't support it
        console.log('Fullscreen not available:', err);
      }
    };

    // Small delay to ensure smooth transition
    const timer = setTimeout(enterFullscreen, 300);
    
    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);


  // Auto-hide controls and cursor - show when mouse moves, hide after delay
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Always show cursor on mouse move
      setShowCursor(true);
      
      // Clear existing cursor timeout and set new one
      if (cursorTimeoutRef.current) {
        clearTimeout(cursorTimeoutRef.current);
      }
      cursorTimeoutRef.current = setTimeout(() => {
        setShowCursor(false);
        cursorTimeoutRef.current = null;
      }, 2500); // Hide cursor after 2.5 seconds of no movement
      
      const threshold = window.innerHeight - 150; // 150px from bottom
      
      if (e.clientY > threshold) {
        // Mouse is near bottom - show controls
        setShowControls(true);
        
        // Clear any existing hide timeout
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
          controlsTimeoutRef.current = null;
        }
      } else {
        // Mouse moved away - start hide timer if not already running
        if (!controlsTimeoutRef.current) {
          controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
            controlsTimeoutRef.current = null;
          }, 2000); // Hide after 2 seconds
        }
      }
    };

    // Also show controls on any touch (for mobile)
    const handleTouchStart = () => {
      setShowControls(true);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        controlsTimeoutRef.current = null;
      }, 3000); // Hide after 3 seconds on touch
    };

    // Initial hide after 3 seconds
    const initialHideTimer = setTimeout(() => {
      setShowControls(false);
      setShowCursor(false);
    }, 3000);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      clearTimeout(initialHideTimer);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (cursorTimeoutRef.current) {
        clearTimeout(cursorTimeoutRef.current);
      }
    };
  }, []);


  // Handle seek from lyrics click
  const handleLyricsSeek = useCallback((time: number) => {
    seek(time);
  }, [seek]);

  // Handle close - exit fullscreen and return to music page
  const handleClose = useCallback(async () => {
    // Exit fullscreen first if active
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (err) {
        // Ignore errors
      }
    }
    router.push("/music");
  }, [router]);

  // Toggle fullscreen
  const handleToggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  }, []);


  // Check for next/previous tracks based on CURRENT release and track
  const currentTrackIndex = useMemo(() => {
    return currentRelease.tracks?.findIndex(
      (t) => t.slug === currentTrack.slug || t.title === currentTrack.title
    ) ?? 0;
  }, [currentRelease.tracks, currentTrack.slug, currentTrack.title]);

  const hasNext = useMemo(() => {
    return (currentRelease.tracks?.length ?? 0) > currentTrackIndex + 1;
  }, [currentRelease.tracks?.length, currentTrackIndex]);

  const hasPrevious = useMemo(() => {
    return currentTrackIndex > 0;
  }, [currentTrackIndex]);

  // Comprehensive keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          // If in fullscreen, exit fullscreen first. Otherwise close immersive view.
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            handleClose();
          }
          break;
        case " ":
          e.preventDefault();
          playPause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (currentTime > 5) {
            seek(Math.max(0, currentTime - 10));
          } else if (hasPrevious) {
            playPrevious();
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          seek(Math.min(duration, currentTime + 10));
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
        case "m":
        case "M":
          e.preventDefault();
          setVolume(volume > 0 ? 0 : 1);
          break;
        case "f":
        case "F":
          e.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.documentElement.requestFullscreen();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose, playPause, seek, setVolume, currentTime, duration, volume, hasPrevious, playPrevious]);

  // Calculate album art animation based on audio
  const albumArtScale = 1 + (analysis?.overall ?? 0) * theme.albumArt.audioReactivity * 0.05;
  const albumArtGlow = (analysis?.bass ?? 0) * theme.albumArt.audioReactivity;

  // Set CSS variables for theme (reactive to theme changes)
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

  // Render the appropriate centerpiece based on layout
  const renderCenterpiece = () => {
    if (visualEffect.type === 'eye' || layout.centerpiece === 'eye') {
      return (
        <EyeEffect
          theme={theme}
          analysis={analysis || DEFAULT_ANALYSIS}
          intensity={intensity}
          isPlaying={isPlaying}
          sectionType={currentSection?.type}
        />
      );
    }
    return null;
  };

  // Render album art component
  const renderAlbumArt = () => (
    <motion.div
      className="relative"
      style={{
        width: layoutStyle === 'eye-centered' ? '16rem' : undefined,
        height: layoutStyle === 'eye-centered' ? '16rem' : undefined,
      }}
      animate={{
        scale: theme.albumArt.effect === "breathe" || theme.albumArt.effect === "pulse" ? albumArtScale : 1,
        opacity: showAlbumArt ? 1 : 0,
      }}
      transition={{ duration: 0.5 }}
    >
      {/* Glow effect behind album art */}
      <motion.div
        className="absolute -inset-8 rounded-lg blur-3xl"
        animate={{
          opacity: showAlbumArt ? 0.3 + albumArtGlow * 0.5 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(circle, ${theme.colors.glow} 0%, transparent 70%)`,
        }}
      />
      
      {/* Album art image */}
      <div className={cn(
        "relative border border-white/10 rounded-lg overflow-hidden shadow-2xl",
        layoutStyle === 'eye-centered' ? "w-64 h-64" : "w-72 h-72 md:w-[26rem] md:h-[26rem] lg:w-[32rem] lg:h-[32rem]"
      )}>
        {currentRelease.cover ? (
          <Image
            src={currentRelease.cover}
            alt={currentRelease.title}
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
  );

  return (
    <>
      {/* Persistent background to prevent flash during transitions */}
      <div 
        className="fixed inset-0 z-40 bg-black"
        style={{ background: theme.colors.background }}
      />
      
      <AnimatePresence mode="sync">
        <motion.div
          key={currentTrack.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 overflow-hidden"
          style={{ cursor: showCursor ? 'auto' : 'none' }}
        >
        {/* Reactive Background with Particles */}
        <ReactiveBackground
          key={`bg-${currentTrack.title}`}
          theme={theme}
          analysis={analysis || DEFAULT_ANALYSIS}
          intensity={intensity}
          isPlaying={isPlaying}
        />

        {/* Background Image (like space monster for Tendrils) */}
        {theme.background?.image && (
          <motion.div
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ 
              opacity: 0.55,
              scale: [1.2, 1.28, 1.2],
              y: [0, -30, 0],
              x: [0, 15, 0],
            }}
            transition={{ 
              opacity: { duration: 2 },
              scale: { duration: 20, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 15, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 18, repeat: Infinity, ease: "easeInOut" },
            }}
            className="fixed inset-0 z-[1] pointer-events-none flex items-center justify-center overflow-hidden"
          >
            <Image
              src={theme.background.image}
              alt=""
              width={3000}
              height={2000}
              className="w-[400%] sm:w-[300%] md:w-[200%] h-auto min-h-[160vh] sm:min-h-[140vh] object-contain"
              style={{
                filter: `drop-shadow(0 0 80px ${theme.colors.glow}) drop-shadow(0 0 120px ${theme.colors.glow})`,
                opacity: 0.75,
              }}
              priority
            />
          </motion.div>
        )}

        {/* Custom Visual Effect (like Eye) */}
        {renderCenterpiece()}

        {/* Main Content */}
        <div className="relative z-10 h-full flex flex-col">

          <div className="h-safe-top" />

          {/* Content Area - Layout varies based on layoutStyle */}
          {layoutStyle === 'eye-centered' ? (
            // EYE-CENTERED LAYOUT: Eye in background, lyrics centered, small album art in corner
            (() => {
              // Determine if we're in the intro (before lyrics really start)
              // Transition happens 0.5s before the intro section ends
              const isIntroSection = currentSection?.name?.toLowerCase() === 'intro';
              const isIntro = isIntroSection && currentTime < 19;
              
              // Calculate intro title opacity - starts fading at 18s, shorter fade
              const introTitleOpacity = currentTime < 18 
                ? 1 
                : currentTime < 19 
                  ? Math.max(0, 1 - (currentTime - 18)) // Fade from 1 to 0 over 1 second
                  : 0;
              
              return (
                <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 pt-6 sm:pt-8 pb-28 sm:pb-32 overflow-hidden relative">
                  {/* LARGE INTRO TITLE - centered, dramatic */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: isIntro ? introTitleOpacity : 0,
                      scale: isIntro ? 1 : 0.8,
                      y: isIntro ? 0 : -100,
                    }}
                    transition={{ duration: 0.15, ease: "linear" }}
                    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30 px-4"
                    style={{ display: isIntro ? 'flex' : 'none' }}
                  >
                    <motion.h1 
                      className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-center px-4 sm:px-8 leading-tight"
                      style={{
                        color: theme.colors.text,
                        textShadow: `0 0 40px ${theme.colors.glow}, 0 0 80px ${theme.colors.glow}`,
                      }}
                      animate={{
                        textShadow: isPlaying 
                          ? [
                              `0 0 40px ${theme.colors.glow}, 0 0 80px ${theme.colors.glow}`,
                              `0 0 60px ${theme.colors.glow}, 0 0 120px ${theme.colors.glow}`,
                              `0 0 40px ${theme.colors.glow}, 0 0 80px ${theme.colors.glow}`,
                            ]
                          : `0 0 40px ${theme.colors.glow}, 0 0 80px ${theme.colors.glow}`,
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {currentTrack.title}
                    </motion.h1>
                    <motion.p 
                      className="text-sm sm:text-lg md:text-xl text-white/40 mt-4 sm:mt-6 tracking-widest uppercase"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    >
                      {currentRelease.title}
                    </motion.p>
                  </motion.div>

                  {/* Centered Lyrics - appears when intro ends */}
                  <motion.div
                    key={`lyrics-${currentTrack.title}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: isIntro ? 0 : 1, 
                      y: isIntro ? 20 : 0 
                    }}
                    transition={{ delay: 0, duration: 0.3 }}
                    className="w-full max-w-4xl h-[55vh] sm:h-[60vh]"
                  >
                    <LyricsDisplay
                      lyrics={lyrics}
                      currentLineIndex={currentLineIndex}
                      currentLine={currentLine}
                      theme={theme}
                      intensity={intensity}
                      lineFocusValues={lineFocusValues}
                      currentLineProgress={currentLineProgress}
                      onSeek={handleLyricsSeek}
                      className="h-full"
                      centered={true}
                    />
                  </motion.div>

                  {/* Small album art in bottom left - hidden on very small screens */}
                  <AnimatePresence>
                    {showAlbumArt && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="fixed bottom-28 sm:bottom-32 left-4 sm:left-6 z-20 hidden sm:block"
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border border-white/10 shadow-xl">
                          {currentRelease.cover && (
                            <Image
                              src={currentRelease.cover}
                              alt={currentRelease.title}
                              width={96}
                              height={96}
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Track info overlay at top - only shows when NOT in intro */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ 
                      opacity: isIntro ? 0 : 1, 
                      y: isIntro ? -10 : 0 
                    }}
                    transition={{ duration: 0.25 }}
                    className="fixed top-16 sm:top-20 left-0 right-0 text-center z-20 px-4"
                  >
                    <h1 className="font-display text-base sm:text-xl md:text-2xl font-bold text-white/90 truncate max-w-[90vw] mx-auto">
                      {currentTrack.title}
                    </h1>
                    <p className="text-xs sm:text-sm text-white/50 mt-1">
                      {currentRelease.title}
                    </p>
                    {currentSection && !isIntro && (
                      <motion.p
                        key={currentSection.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 sm:mt-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em]"
                        style={{ color: theme.colors.primary }}
                      >
                        {currentSection.name}
                      </motion.p>
                    )}
                  </motion.div>
                </div>
              );
            })()
          ) : layoutStyle === 'centered' ? (
            // CENTERED LAYOUT with intro title support
            (() => {
              // Get intro end time from layout config, default to checking section
              const introEndTime = layout.introEndTime ?? 20;
              const isIntroSection = currentSection?.name?.toLowerCase() === 'intro';
              const isIntro = (isIntroSection || currentTime < introEndTime) && currentTime < introEndTime;
              
              // Calculate intro title opacity - starts fading 1 second before intro ends
              const fadeStartTime = introEndTime - 1;
              const introTitleOpacity = currentTime < fadeStartTime 
                ? 1 
                : currentTime < introEndTime 
                  ? Math.max(0, 1 - (currentTime - fadeStartTime))
                  : 0;
              
              return (
                <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 pt-6 sm:pt-8 pb-28 sm:pb-32 overflow-hidden relative">
                  {/* LARGE INTRO TITLE - centered, dramatic */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: isIntro ? introTitleOpacity : 0,
                      scale: isIntro ? 1 : 0.8,
                      y: isIntro ? 0 : -100,
                    }}
                    transition={{ duration: 0.15, ease: "linear" }}
                    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30 px-4"
                    style={{ display: isIntro ? 'flex' : 'none' }}
                  >
                    <motion.h1 
                      className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-center px-4 sm:px-8 leading-tight"
                      style={{
                        color: theme.colors.text,
                        textShadow: `0 0 40px ${theme.colors.glow}, 0 0 80px ${theme.colors.glow}`,
                      }}
                      animate={{
                        textShadow: isPlaying 
                          ? [
                              `0 0 40px ${theme.colors.glow}, 0 0 80px ${theme.colors.glow}`,
                              `0 0 60px ${theme.colors.glow}, 0 0 120px ${theme.colors.glow}`,
                              `0 0 40px ${theme.colors.glow}, 0 0 80px ${theme.colors.glow}`,
                            ]
                          : `0 0 40px ${theme.colors.glow}, 0 0 80px ${theme.colors.glow}`,
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {currentTrack.title}
                    </motion.h1>
                    <motion.p 
                      className="text-sm sm:text-lg md:text-xl text-white/40 mt-4 sm:mt-6 tracking-widest uppercase"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    >
                      {currentRelease.title}
                    </motion.p>
                  </motion.div>

                  {/* Centered Lyrics - appears when intro ends */}
                  <motion.div
                    key={`lyrics-${currentTrack.title}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: isIntro ? 0 : 1, 
                      y: isIntro ? 20 : 0 
                    }}
                    transition={{ delay: 0, duration: 0.3 }}
                    className="w-full max-w-4xl h-[55vh] sm:h-[60vh]"
                  >
                    <LyricsDisplay
                      lyrics={lyrics}
                      currentLineIndex={currentLineIndex}
                      currentLine={currentLine}
                      theme={theme}
                      intensity={intensity}
                      lineFocusValues={lineFocusValues}
                      currentLineProgress={currentLineProgress}
                      onSeek={handleLyricsSeek}
                      className="h-full"
                      centered={true}
                    />
                  </motion.div>

                  {/* Small album art in bottom left - only during intro */}
                  <AnimatePresence>
                    {showAlbumArt && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="fixed bottom-28 sm:bottom-32 left-4 sm:left-6 z-20 hidden sm:block"
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border border-white/10 shadow-xl">
                          {currentRelease.cover && (
                            <Image
                              src={currentRelease.cover}
                              alt={currentRelease.title}
                              width={96}
                              height={96}
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Track info overlay at top - only shows when NOT in intro */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ 
                      opacity: isIntro ? 0 : 1, 
                      y: isIntro ? -10 : 0 
                    }}
                    transition={{ duration: 0.25 }}
                    className="fixed top-16 sm:top-20 left-0 right-0 text-center z-20 px-4"
                  >
                    <h1 className="font-display text-base sm:text-xl md:text-2xl font-bold text-white/90 truncate max-w-[90vw] mx-auto">
                      {currentTrack.title}
                    </h1>
                    <p className="text-xs sm:text-sm text-white/50 mt-1">
                      {currentRelease.title}
                    </p>
                    {currentSection && !isIntro && (
                      <motion.p
                        key={currentSection.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 sm:mt-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em]"
                        style={{ color: theme.colors.primary }}
                      >
                        {currentSection.name}
                      </motion.p>
                    )}
                  </motion.div>
                </div>
              );
            })()
          ) : (
            // DEFAULT LAYOUT: Album art left, lyrics right
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-6 md:px-12 lg:px-20 pt-8 pb-32 overflow-hidden">
              {/* Left Column: Album Art + Info */}
              <motion.div
                key={`info-${currentTrack.title}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex flex-col items-center lg:items-start gap-6 flex-shrink-0"
              >
                {renderAlbumArt()}

                {/* Track Info */}
                <motion.div
                  key={`title-${currentTrack.title}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="text-center lg:text-left"
                >
                  <h1
                    className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-2"
                    style={{
                      color: theme.colors.text,
                      textShadow: `0 0 40px ${theme.colors.glow}`,
                    }}
                  >
                    {currentTrack.title}
                  </h1>
                  <p className="text-sm md:text-base text-foreground/60">
                    {currentRelease.title}
                    <span className="mx-2">•</span>
                    {currentRelease.type}
                    <span className="mx-2">•</span>
                    {new Date(currentRelease.date).getFullYear()}
                  </p>
                  
                  <AnimatePresence mode="wait">
                    {currentSection && (
                      <motion.p
                        key={currentSection.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 text-xs uppercase tracking-[0.3em]"
                        style={{ color: theme.colors.primary }}
                      >
                        {currentSection.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>

              {/* Right Column: Lyrics */}
              <motion.div
                key={`lyrics-${currentTrack.title}`}
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
                  lineFocusValues={lineFocusValues}
                  currentLineProgress={currentLineProgress}
                  onSeek={handleLyricsSeek}
                  className="h-full"
                />
              </motion.div>
            </div>
          )}

          {/* Controls - auto-hide when mouse not near bottom */}
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ 
              opacity: showControls ? 1 : 0,
              y: showControls ? 0 : 20,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="pointer-events-auto"
            style={{ pointerEvents: showControls ? 'auto' : 'none' }}
          >
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
              onToggleFullscreen={handleToggleFullscreen}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
              isFullscreen={isFullscreen}
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
    </>
  );
}
