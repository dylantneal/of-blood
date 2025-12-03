"use client";

import { useRef, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { LyricLine, TrackTheme, TrackLyrics } from "@/lib/types";
import { cn } from "@/lib/utils";

type LyricsDisplayProps = {
  lyrics: TrackLyrics | null;
  currentLineIndex: number;
  currentLine: LyricLine | null;
  theme: TrackTheme;
  intensity: number;
  onSeek?: (time: number) => void;
  className?: string;
};

export function LyricsDisplay({
  lyrics,
  currentLineIndex,
  currentLine,
  theme,
  intensity,
  onSeek,
  className,
}: LyricsDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Filter to only lines with text
  const linesWithText = useMemo(() => {
    if (!lyrics) return [];
    return lyrics.lines
      .map((line, index) => ({ ...line, originalIndex: index }))
      .filter((line) => line.text !== null);
  }, [lyrics]);

  // Find the display index of the current line
  const currentDisplayIndex = useMemo(() => {
    return linesWithText.findIndex(l => l.originalIndex === currentLineIndex);
  }, [linesWithText, currentLineIndex]);

  // Set ref for a line
  const setLineRef = useCallback((index: number, el: HTMLDivElement | null) => {
    if (el) {
      lineRefs.current.set(index, el);
    } else {
      lineRefs.current.delete(index);
    }
  }, []);

  // Auto-scroll to current line (Apple Music style - smooth, centered)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || currentDisplayIndex < 0) return;

    const currentElement = lineRefs.current.get(currentDisplayIndex);
    if (!currentElement) return;

    // Calculate scroll position to center the current line
    const containerHeight = container.clientHeight;
    const elementTop = currentElement.offsetTop;
    const elementHeight = currentElement.offsetHeight;
    
    // Center the element in the container
    const scrollTarget = elementTop - (containerHeight / 2) + (elementHeight / 2);
    
    container.scrollTo({
      top: Math.max(0, scrollTarget),
      behavior: "smooth",
    });
  }, [currentDisplayIndex]);

  if (!lyrics) {
    return (
      <div className={cn("flex items-center justify-center text-foreground/40", className)}>
        <p className="font-display text-xl">No lyrics available</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "overflow-y-auto scrollbar-hide relative",
        className
      )}
      style={{
        maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
      }}
    >
      {/* Spacer for initial scroll position */}
      <div className="h-[40vh]" />
      
      <div className="space-y-8 px-4 md:px-8">
        {linesWithText.map((line, displayIndex) => {
          const isCurrentLine = displayIndex === currentDisplayIndex;
          const isPastLine = displayIndex < currentDisplayIndex;
          const isFutureLine = displayIndex > currentDisplayIndex;
          
          // Calculate distance from current line for opacity
          const distance = Math.abs(displayIndex - currentDisplayIndex);
          const opacityFactor = Math.max(0.15, 1 - distance * 0.2);

          return (
            <div
              key={`${line.originalIndex}-${line.text}`}
              ref={(el) => setLineRef(displayIndex, el)}
              onClick={() => onSeek?.(line.time)}
              className={cn(
                "transition-all duration-500 cursor-pointer select-none relative",
                "hover:opacity-100",
              )}
              style={{
                opacity: isCurrentLine ? 1 : opacityFactor,
                transform: isCurrentLine ? "scale(1)" : "scale(0.92)",
                transformOrigin: "left center",
              }}
            >
              {/* Current line glow effect */}
              {isCurrentLine && (
                <motion.div
                  className="absolute -inset-6 rounded-2xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 + intensity * 0.3 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: `radial-gradient(ellipse at left center, ${theme.colors.glow} 0%, transparent 60%)`,
                  }}
                />
              )}
              
              <p
                className={cn(
                  "font-display text-2xl md:text-3xl lg:text-4xl leading-relaxed relative",
                  "transition-all duration-500",
                  isPastLine && "text-foreground/30",
                  isFutureLine && "text-foreground/40"
                )}
                style={{
                  color: isCurrentLine ? theme.colors.highlight : undefined,
                  textShadow: isCurrentLine 
                    ? `0 0 40px ${theme.colors.glow}, 0 0 80px ${theme.colors.glow}` 
                    : undefined,
                  fontWeight: isCurrentLine ? 600 : 400,
                }}
              >
                {line.text}
              </p>
            </div>
          );
        })}
      </div>
      
      {/* Spacer for final scroll position */}
      <div className="h-[50vh]" />
    </div>
  );
}
