"use client";

import { motion } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, X, Maximize2, Minimize2 } from "lucide-react";
import { TrackTheme } from "@/lib/types";
import { formatTime, cn } from "@/lib/utils";
import { useState } from "react";

type ImmersiveControlsProps = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  theme: TrackTheme;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onClose: () => void;
  onToggleFullscreen: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  isFullscreen?: boolean;
};

export function ImmersiveControls({
  isPlaying,
  currentTime,
  duration,
  volume,
  theme,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onNext,
  onPrevious,
  onClose,
  onToggleFullscreen,
  hasNext = false,
  hasPrevious = false,
  isFullscreen = false,
}: ImmersiveControlsProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);
  
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    onSeek(newTime);
  };

  const handleVolumeClick = () => {
    if (isMuted || volume === 0) {
      onVolumeChange(previousVolume || 1);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      onVolumeChange(0);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
    setIsMuted(newVolume === 0);
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-background/95 backdrop-blur-xl shadow-2xl"
    >
      {/* Progress Bar - matching main player style */}
      <div className="flex items-center gap-4 px-4 md:px-8 py-3">
        <span className="font-mono text-xs text-foreground/60 w-12 tabular-nums">
          {formatTime(currentTime)}
        </span>
        
        <div className="relative flex-1 h-2 group">
          {/* Background track */}
          <div className="absolute inset-0 rounded-full bg-line/60" />
          
          {/* Progress fill with glow - matching main player */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-primary/90 to-red-600 shadow-[0_0_15px_rgba(179,10,10,0.5)]"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
          
          {/* Range input for scrubbing */}
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
        
        <span className="font-mono text-xs text-foreground/60 w-12 text-right tabular-nums">
          {formatTime(duration)}
        </span>
      </div>

      {/* Main Controls - simplified for immersive (no album art/track info since it's shown above) */}
      <div className="flex items-center justify-between px-4 md:px-8 pb-4 gap-4 md:gap-8">
        {/* Left: Empty space for balance */}
        <div className="flex-1" />

        {/* Center: Playback Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={onPrevious}
            disabled={!hasPrevious}
            className={cn(
              "p-2 hover:text-primary transition-colors",
              !hasPrevious && "text-foreground/20 cursor-not-allowed hover:text-foreground/20"
            )}
            aria-label="Previous track"
          >
            <SkipBack className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Play/Pause button - matching main player style */}
          <button
            onClick={onPlayPause}
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
            onClick={onNext}
            disabled={!hasNext}
            className={cn(
              "p-2 hover:text-primary transition-colors",
              !hasNext && "text-foreground/20 cursor-not-allowed hover:text-foreground/20"
            )}
            aria-label="Next track"
          >
            <SkipForward className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Right: Volume Control + Fullscreen + Close */}
        <div className="flex-1 flex justify-end items-center gap-1 md:gap-2">
          {/* Volume - hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={handleVolumeClick}
              className="p-2 hover:text-primary transition-colors"
              aria-label={isMuted || volume === 0 ? "Unmute" : "Mute"}
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
          
          {/* Fullscreen toggle */}
          <button
            onClick={onToggleFullscreen}
            className="p-2 text-foreground/60 hover:text-foreground hover:bg-white/5 rounded transition-all"
            aria-label={isFullscreen ? "Exit fullscreen (F)" : "Enter fullscreen (F)"}
            title={isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 text-foreground/60 hover:text-foreground hover:bg-white/5 rounded transition-all"
            aria-label="Exit immersive mode (Esc)"
            title="Exit (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
