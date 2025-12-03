"use client";

import { useAudio } from "@/contexts/audio-context";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Minimize2, Maximize2, X, Expand } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { formatTime } from "@/lib/utils";

export function AudioPlayer() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    nowPlaying,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMinimized,
    playPause,
    seek,
    setVolume,
    toggleMinimize,
    playNext,
    playPrevious,
  } = useAudio();

  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);

  // Check if we're already in immersive mode
  const isInImmersiveMode = pathname?.startsWith("/music/experience");

  // Don't render if nothing is playing or if in immersive mode
  if (!nowPlaying || isInImmersiveMode) return null;

  // Get track slug for experience URL
  const getTrackSlug = () => {
    const track = nowPlaying.track as any;
    return track.slug || track.title.toLowerCase().replace(/\s+/g, "-");
  };

  // Navigate to immersive experience
  const enterExperience = () => {
    const slug = getTrackSlug();
    router.push(`/music/experience/${slug}`);
  };

  const handleVolumeClick = () => {
    if (isMuted) {
      setVolume(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const progress = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    seek(newTime);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-background/95 backdrop-blur-xl shadow-2xl pb-safe ${
          isMinimized ? "h-16" : "h-28 md:h-32"
        } transition-all duration-300`}
      >
        {/* Minimized View */}
        {isMinimized ? (
          <div className="flex items-center justify-between h-full px-4 md:px-8">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Album Art Thumbnail */}
              <div className="w-12 h-12 flex-shrink-0 bg-muted border border-line rounded-sm overflow-hidden">
                {nowPlaying.release.cover ? (
                  <img
                    src={nowPlaying.release.cover}
                    alt={nowPlaying.release.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gold/50 text-xs">
                    OB
                  </div>
                )}
              </div>

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{nowPlaying.track.title}</p>
                <p className="text-xs text-foreground/60 truncate">{nowPlaying.release.title}</p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={playPrevious}
                  className="p-2 hover:text-primary transition-colors"
                  aria-label="Previous track"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={playPause}
                  className="p-2 hover:text-primary transition-colors"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button
                  onClick={playNext}
                  className="p-2 hover:text-primary transition-colors"
                  aria-label="Next track"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Enter Immersive Experience Button */}
              <button
                onClick={enterExperience}
                className="p-2 hover:text-primary hover:bg-primary/10 rounded transition-all"
                aria-label="Enter immersive experience"
                title="Enter Immersive Experience"
              >
                <Expand className="w-4 h-4" />
              </button>

              {/* Expand Player Button */}
              <button
                onClick={toggleMinimize}
                className="p-2 hover:text-primary transition-colors"
                aria-label="Expand player"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Expanded View */
          <div className="flex flex-col h-full">
            {/* Progress Bar */}
            <div className="flex items-center gap-4 px-4 md:px-8 py-3">
              <span className="font-mono text-xs text-foreground/60 w-12">
                {formatTime(currentTime)}
              </span>
              <div className="relative flex-1 h-2">
                <div className="absolute inset-0 rounded-full bg-line/60" />
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-primary/90 to-red-600 shadow-[0_0_15px_rgba(179,10,10,0.5)]"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step="0.1"
                  value={duration ? Math.min(currentTime, duration) : 0}
                  onChange={handleProgressChange}
                  disabled={!duration}
                  className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(179,10,10,0.8)]
                    [&::-moz-range-thumb]:appearance-none
                    [&::-moz-range-thumb]:w-3
                    [&::-moz-range-thumb]:h-3
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-white
                    [&::-moz-range-thumb]:border-none
                  "
                />
              </div>
              <span className="font-mono text-xs text-foreground/60 w-12 text-right">
                {formatTime(duration)}
              </span>
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-between flex-1 px-4 md:px-8 pb-3 md:pb-4 gap-4 md:gap-8">
              {/* Left: Album Art & Track Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-muted border border-line rounded-sm overflow-hidden">
                  {nowPlaying.release.cover ? (
                    <img
                      src={nowPlaying.release.cover}
                      alt={nowPlaying.release.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gold/50 text-lg">
                      OB
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base font-medium truncate">{nowPlaying.track.title}</p>
                  <p className="text-xs md:text-sm text-foreground/60 truncate">{nowPlaying.release.title}</p>
                  <p className="text-xs text-foreground/50 mt-1">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </p>
                </div>
              </div>

              {/* Center: Playback Controls */}
              <div className="flex items-center gap-2 md:gap-4">
                <button
                  onClick={playPrevious}
                  className="p-2 hover:text-primary transition-colors"
                  aria-label="Previous track"
                >
                  <SkipBack className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <button
                  onClick={playPause}
                  className="p-3 md:p-4 rounded-full bg-primary hover:bg-primary/90 transition-colors"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
                  ) : (
                    <Play className="w-5 h-5 md:w-6 md:h-6 text-foreground ml-0.5" />
                  )}
                </button>
                <button
                  onClick={playNext}
                  className="p-2 hover:text-primary transition-colors"
                  aria-label="Next track"
                >
                  <SkipForward className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              {/* Right: Volume, Immersive & Minimize */}
              <div className="flex items-center gap-2 md:gap-4">
                {/* Volume Control */}
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={handleVolumeClick}
                    className="p-2 hover:text-primary transition-colors"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-line rounded-lg appearance-none cursor-pointer accent-primary"
                    aria-label="Volume"
                  />
                </div>

                {/* Enter Immersive Experience Button */}
                <button
                  onClick={enterExperience}
                  className="p-2 hover:text-primary hover:bg-primary/10 rounded transition-all group"
                  aria-label="Enter immersive experience"
                  title="Enter Immersive Experience"
                >
                  <Expand className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>

                {/* Minimize Button */}
                <button
                  onClick={toggleMinimize}
                  className="p-2 hover:text-primary transition-colors"
                  aria-label="Minimize player"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Volume Control */}
            <div className="md:hidden px-4 pb-4 flex items-center gap-2">
              <button
                onClick={handleVolumeClick}
                className="p-1 hover:text-primary transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1 bg-line rounded-lg appearance-none cursor-pointer accent-primary"
                aria-label="Volume"
              />
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

