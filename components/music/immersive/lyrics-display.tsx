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
  centered?: boolean; // New prop for centered layout
};

export function LyricsDisplay({
  lyrics,
  currentLineIndex,
  currentLine,
  theme,
  intensity,
  onSeek,
  className,
  centered = false,
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

  // Auto-scroll to current line - fast, snappy animation
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
    const finalTarget = Math.max(0, scrollTarget);
    
    // Use fast custom scroll animation instead of native smooth scroll
    const startScroll = container.scrollTop;
    const distance = finalTarget - startScroll;
    const duration = 150; // 150ms - much faster than native smooth
    const startTime = performance.now();
    
    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic for snappy feel
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      container.scrollTop = startScroll + (distance * easeOut);
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
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
        "overflow-y-auto scrollbar-hide relative touch-pan-y",
        className
      )}
      style={{
        maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      {/* Spacer for initial scroll position - smaller on mobile */}
      <div className="h-[35vh] md:h-[40vh]" />
      
      <div className={cn(
        "space-y-6 md:space-y-8 px-4 md:px-8",
        centered && "text-center"
      )}>
        {linesWithText.map((line, displayIndex) => {
          const isCurrentLine = displayIndex === currentDisplayIndex;
          const isPastLine = displayIndex < currentDisplayIndex;
          const isFutureLine = displayIndex > currentDisplayIndex;
          const isAdjacentLine = Math.abs(displayIndex - currentDisplayIndex) === 1;
          
          // Calculate distance from current line for opacity
          // Adjacent lines (prev/next) are more visible to account for timing variations
          const distance = Math.abs(displayIndex - currentDisplayIndex);
          const opacityFactor = isAdjacentLine 
            ? 0.85 // Adjacent lines very visible
            : Math.max(0.3, 1 - distance * 0.15); // Slower falloff for others

          return (
            <div
              key={`${line.originalIndex}-${line.text}`}
              ref={(el) => setLineRef(displayIndex, el)}
              onClick={() => onSeek?.(line.time)}
              className={cn(
                "transition-all duration-200 cursor-pointer select-none relative",
                "hover:opacity-100",
              )}
              style={{
                opacity: isCurrentLine ? 1 : opacityFactor,
                transform: isCurrentLine ? "scale(1.02)" : "scale(0.95)",
                transformOrigin: centered ? "center center" : "left center",
              }}
            >
              {/* Current line glow effect - subtle white glow */}
              {isCurrentLine && (
                <motion.div
                  className="absolute -inset-6 rounded-2xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.15 + intensity * 0.15 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: centered 
                      ? `radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, transparent 60%)`
                      : `radial-gradient(ellipse at left center, rgba(255,255,255,0.2) 0%, transparent 60%)`,
                  }}
                />
              )}
              
              <p
                className={cn(
                  "font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-relaxed relative",
                  "transition-all duration-200",
                )}
                style={{
                  // REVERSED: Current line is WHITE, others are theme-colored
                  // Adjacent lines are brighter to account for timing variations
                  color: isCurrentLine 
                    ? "#FFFFFF" 
                    : isAdjacentLine
                      ? `${theme.colors.primary}CC` // 80% opacity for adjacent
                      : isPastLine 
                        ? `${theme.colors.primary}66` // 40% opacity
                        : `${theme.colors.primary}88`, // 53% opacity
                  textShadow: isCurrentLine 
                    ? `0 0 30px rgba(255,255,255,0.5), 0 0 60px ${theme.colors.glow}` 
                    : isAdjacentLine
                      ? `0 0 15px ${theme.colors.glow}` // Subtle glow for adjacent
                      : undefined,
                  fontWeight: isCurrentLine ? 700 : isAdjacentLine ? 500 : 400,
                }}
              >
                {line.text}
              </p>
            </div>
          );
        })}
      </div>
      
      {/* Spacer for final scroll position - smaller on mobile */}
      <div className="h-[40vh] md:h-[50vh]" />
    </div>
  );
}
