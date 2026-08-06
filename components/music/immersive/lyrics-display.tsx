"use client";

import { useRef, useEffect, useMemo, useCallback, useState, memo } from "react";
import { motion } from "framer-motion";
import { LyricLine, TrackTheme, TrackLyrics } from "@/lib/types";
import { cn } from "@/lib/utils";

type LyricsDisplayProps = {
  lyrics: TrackLyrics | null;
  currentLineIndex: number;
  currentLine: LyricLine | null;
  theme: TrackTheme;
  intensity: number;
  lineFocusValues?: number[];
  currentLineProgress?: number;
  onSeek?: (time: number) => void;
  className?: string;
  centered?: boolean;
};

// Memoized line component using CSS custom properties for efficient updates
const LyricLineItem = memo(function LyricLineItem({
  line,
  displayIndex,
  focus,
  theme,
  intensity,
  centered,
  onSeek,
  setLineRef,
}: {
  line: { originalIndex: number; text: string | null; time: number };
  displayIndex: number;
  focus: number;
  theme: TrackTheme;
  intensity: number;
  centered: boolean;
  onSeek?: (time: number) => void;
  setLineRef: (index: number, el: HTMLDivElement | null) => void;
}) {
  // Calculate derived values from focus
  const glowOpacity = Math.max(0, focus - 0.3) * 0.7;
  const glowSize = 15 + focus * 45;
  
  // Use CSS custom properties for values that change frequently
  // This lets the browser handle updates more efficiently
  const cssVars = {
    '--focus': focus,
    '--opacity': 0.3 + (focus * 0.7),
    '--scale': 0.95 + (focus * 0.07),
    '--glow-opacity': (0.15 + intensity * 0.15) * glowOpacity,
    '--glow-size': `${glowSize}px`,
    '--text-glow-opacity': glowOpacity * 0.5,
  } as React.CSSProperties;

  return (
    <div
      ref={(el) => setLineRef(displayIndex, el)}
      onClick={() => onSeek?.(line.time)}
      className="lyric-line cursor-pointer select-none relative will-change-transform"
      style={cssVars}
      data-focus={focus > 0.8 ? 'high' : focus > 0.3 ? 'medium' : 'low'}
      data-centered={centered}
    >
      {focus > 0.3 && (
        <div
          className="lyric-glow absolute -inset-6 rounded-2xl pointer-events-none"
          style={{
            background: centered 
              ? `radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, transparent 60%)`
              : `radial-gradient(ellipse at left center, rgba(255,255,255,0.2) 0%, transparent 60%)`,
          }}
        />
      )}
      
      <p
        className="lyric-text font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-relaxed relative"
        data-theme-primary={theme.colors.primary}
        data-theme-glow={theme.colors.glow}
      >
        {line.text}
      </p>
      
      {/* Inject scoped styles using CSS custom properties */}
      <style>{`
        .lyric-line {
          opacity: var(--opacity);
          transform: scale(var(--scale));
          transform-origin: ${centered ? 'center center' : 'left center'};
          transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1), 
                      transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .lyric-glow {
          opacity: var(--glow-opacity);
          transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .lyric-text {
          transition: color 250ms cubic-bezier(0.4, 0, 0.2, 1), 
                      text-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* High focus - white text with glow */
        .lyric-line[data-focus="high"] .lyric-text {
          color: #FFFFFF;
          font-weight: 700;
          text-shadow: 0 0 var(--glow-size) rgba(255,255,255,var(--text-glow-opacity)), 
                       0 0 calc(var(--glow-size) * 2) ${theme.colors.glow};
        }
        
        /* Medium focus - theme color */
        .lyric-line[data-focus="medium"] .lyric-text {
          color: ${theme.colors.primary};
          font-weight: 500;
          text-shadow: 0 0 15px ${theme.colors.glow};
        }
        
        /* Low focus - muted */
        .lyric-line[data-focus="low"] .lyric-text {
          color: ${theme.colors.primary}66;
          font-weight: 400;
        }
      `}</style>
    </div>
  );
});

export function LyricsDisplay({
  lyrics,
  currentLineIndex,
  currentLine,
  theme,
  intensity,
  lineFocusValues = [],
  currentLineProgress = 0,
  onSeek,
  className,
  centered = false,
}: LyricsDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const targetScrollRef = useRef<number>(0);
  const currentScrollRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

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

  // Smooth scroll using spring-like interpolation
  useEffect(() => {
    const container = containerRef.current;
    if (!container || currentDisplayIndex < 0) return;

    const currentElement = lineRefs.current.get(currentDisplayIndex);
    if (!currentElement) return;

    // Calculate target scroll position
    const containerHeight = container.clientHeight;
    const elementTop = currentElement.offsetTop;
    const elementHeight = currentElement.offsetHeight;
    const baseTarget = Math.max(0, elementTop - (containerHeight / 2) + (elementHeight / 2));

    // Interpolate toward next line based on progress
    const nextElement = lineRefs.current.get(currentDisplayIndex + 1);
    let targetScroll = baseTarget;
    
    if (nextElement && currentLineProgress > 0.3) {
      const nextTop = nextElement.offsetTop;
      const nextTarget = Math.max(0, nextTop - (containerHeight / 2) + (nextElement.offsetHeight / 2));
      const easedProgress = (currentLineProgress - 0.3) / 0.7;
      targetScroll = baseTarget + (nextTarget - baseTarget) * easedProgress * 0.5;
    }

    targetScrollRef.current = targetScroll;

    // Only start animation if not already running
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

        // Spring-like interpolation with damping
        const smoothing = 0.08;
        const newScroll = current + diff * smoothing;

        // Stop when close enough
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

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [currentDisplayIndex, currentLineProgress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Render nothing rather than a placeholder. `lyrics` is also null while the
  // lyrics file is still loading, so a message here would flash on every track change.
  if (!lyrics) {
    return null;
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
      {/* Spacer for initial scroll position */}
      <div className="h-[35vh] md:h-[40vh]" />
      
      <div className={cn(
        "space-y-6 md:space-y-8 px-4 md:px-8",
        centered && "text-center"
      )}>
        {linesWithText.map((line, displayIndex) => (
          <LyricLineItem
            key={`${line.originalIndex}-${line.text}`}
            line={line}
            displayIndex={displayIndex}
            focus={lineFocusValues[line.originalIndex] ?? 0}
            theme={theme}
            intensity={intensity}
            centered={centered}
            onSeek={onSeek}
            setLineRef={setLineRef}
          />
        ))}
      </div>
      
      {/* Spacer for final scroll position */}
      <div className="h-[40vh] md:h-[50vh]" />
    </div>
  );
}
