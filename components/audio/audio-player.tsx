"use client";

import { useAudio } from "@/contexts/audio-context";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Minimize2, Maximize2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { formatTime } from "@/lib/utils";

export function AudioPlayer() {
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

  // Don't render if nothing is playing
  if (!nowPlaying) return null;

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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    seek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-background/95 backdrop-blur-xl shadow-2xl ${
          isMinimized ? "h-16" : "h-24 md:h-28"
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

              {/* Expand Button */}
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
            <div className="relative h-1 bg-line group cursor-pointer" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = x / rect.width;
              seek(percentage * duration);
            }}>
              <motion.div
                className="absolute top-0 left-0 h-full bg-primary"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-between h-full px-4 md:px-8 gap-4 md:gap-8">
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

              {/* Right: Volume & Minimize */}
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
            <div className="md:hidden px-4 pb-2 flex items-center gap-2">
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

