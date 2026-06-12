"use client";

import { useMemo } from "react";
import { TrackLyrics, LyricLine, LyricSection } from "@/lib/types";

type UseLyricsSyncOptions = {
  currentTime: number;
  lyrics: TrackLyrics | null;
  offset?: number;
  anticipationWindow?: number;
  lingerWindow?: number;
};

type LyricsSyncResult = {
  currentLine: LyricLine | null;
  currentLineIndex: number;
  currentSection: LyricSection | null;
  currentSectionIndex: number;
  upcomingLines: LyricLine[];
  progress: number;
  intensity: number;
  lineFocusValues: number[];
  currentLineProgress: number;
};

// Smooth easing functions
function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

function easeInCubic(x: number): number {
  return x * x * x;
}

export function useLyricsSync({
  currentTime,
  lyrics,
  offset = 0,
  anticipationWindow = 0.8,
  lingerWindow = 0.6,
}: UseLyricsSyncOptions): LyricsSyncResult {
  const adjustedTime = currentTime + offset;
  
  // Get current line index (this can update frequently - it's cheap)
  const currentLineIndex = useMemo(() => {
    if (!lyrics?.lines.length) return -1;

    let index = -1;
    for (let i = 0; i < lyrics.lines.length; i++) {
      if (lyrics.lines[i].time <= adjustedTime) {
        index = i;
      } else {
        break;
      }
    }
    return index;
  }, [lyrics, adjustedTime]);

  // Get current line
  const currentLine = useMemo(() => {
    if (!lyrics || currentLineIndex < 0) return null;
    return lyrics.lines[currentLineIndex];
  }, [lyrics, currentLineIndex]);

  // Get upcoming lines (next 3 with text)
  const upcomingLines = useMemo(() => {
    if (!lyrics || currentLineIndex < 0) return [];
    
    const upcoming: LyricLine[] = [];
    for (let i = currentLineIndex + 1; i < lyrics.lines.length && upcoming.length < 3; i++) {
      if (lyrics.lines[i].text) {
        upcoming.push(lyrics.lines[i]);
      }
    }
    return upcoming;
  }, [lyrics, currentLineIndex]);

  // Calculate progress through current line (0-1)
  const progress = useMemo(() => {
    if (!lyrics || currentLineIndex < 0) return 0;
    
    const currentLineTime = lyrics.lines[currentLineIndex].time;
    const nextLineTime = lyrics.lines[currentLineIndex + 1]?.time ?? currentLineTime + 5;
    const lineDuration = nextLineTime - currentLineTime;
    
    if (lineDuration <= 0) return 1;
    
    const elapsed = adjustedTime - currentLineTime;
    return Math.min(1, Math.max(0, elapsed / lineDuration));
  }, [lyrics, currentLineIndex, adjustedTime]);

  const lineFocusValues = useMemo(() => {
    if (!lyrics?.lines.length) return [];

    const newValues = lyrics.lines.map((line, index) => {
      const nextLine = lyrics.lines[index + 1];
      
      const lineStart = line.time;
      const lineEnd = nextLine?.time ?? lineStart + 5;
      const lineDuration = lineEnd - lineStart;
      
      const scaledAnticipation = Math.min(anticipationWindow, lineDuration * 0.4);
      const scaledLinger = Math.min(lingerWindow, lineDuration * 0.3);
      
      if (adjustedTime < lineStart - scaledAnticipation) {
        return 0;
      }
      
      if (adjustedTime < lineStart) {
        const anticipationProgress = (adjustedTime - (lineStart - scaledAnticipation)) / scaledAnticipation;
        return easeOutCubic(Math.max(0, anticipationProgress));
      }
      
      if (adjustedTime <= lineEnd) {
        return 1;
      }
      
      if (adjustedTime <= lineEnd + scaledLinger) {
        const lingerProgress = (adjustedTime - lineEnd) / scaledLinger;
        return easeInCubic(1 - Math.min(1, lingerProgress));
      }
      
      return 0;
    });

    return newValues;
  }, [lyrics, adjustedTime, anticipationWindow, lingerWindow]);

  // Current line progress for smooth scroll interpolation
  const currentLineProgress = useMemo(() => {
    if (!lyrics || currentLineIndex < 0) return 0;
    
    const currentLineTime = lyrics.lines[currentLineIndex].time;
    const nextLine = lyrics.lines[currentLineIndex + 1];
    const nextLineTime = nextLine?.time ?? currentLineTime + 5;
    const lineDuration = nextLineTime - currentLineTime;
    
    if (lineDuration <= 0) return 1;
    
    const elapsed = adjustedTime - currentLineTime;
    const rawProgress = Math.min(1, Math.max(0, elapsed / lineDuration));
    
    const eased = rawProgress < 0.5
      ? 2 * rawProgress * rawProgress
      : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;
    
    return eased;
  }, [lyrics, currentLineIndex, adjustedTime]);

  // Get current section
  const currentSectionIndex = useMemo(() => {
    if (!lyrics?.sections.length) return -1;

    let index = -1;
    for (let i = 0; i < lyrics.sections.length; i++) {
      if (lyrics.sections[i].time <= adjustedTime) {
        index = i;
      } else {
        break;
      }
    }
    return index;
  }, [lyrics, adjustedTime]);

  const currentSection = useMemo(() => {
    if (!lyrics || currentSectionIndex < 0) return null;
    return lyrics.sections[currentSectionIndex];
  }, [lyrics, currentSectionIndex]);

  // Get intensity (from section or interpolated)
  const intensity = useMemo(() => {
    if (!lyrics || currentSectionIndex < 0) return 0.5;

    const section = lyrics.sections[currentSectionIndex];
    const nextSection = lyrics.sections[currentSectionIndex + 1];

    if (!nextSection) return section.intensity;

    const sectionDuration = nextSection.time - section.time;
    const elapsed = adjustedTime - section.time;
    const sectionProgress = Math.min(1, elapsed / sectionDuration);

    const eased = sectionProgress < 0.5
      ? 2 * sectionProgress * sectionProgress
      : 1 - Math.pow(-2 * sectionProgress + 2, 2) / 2;

    return section.intensity + (nextSection.intensity - section.intensity) * eased;
  }, [lyrics, currentSectionIndex, adjustedTime]);

  return {
    currentLine,
    currentLineIndex,
    currentSection,
    currentSectionIndex,
    upcomingLines,
    progress,
    intensity,
    lineFocusValues,
    currentLineProgress,
  };
}

// Utility function to load lyrics from JSON file
export async function loadLyrics(url: string): Promise<TrackLyrics | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load lyrics: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading lyrics:", error);
    return null;
  }
}
