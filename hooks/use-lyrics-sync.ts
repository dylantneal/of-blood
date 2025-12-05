"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { TrackLyrics, LyricLine, LyricSection } from "@/lib/types";

type UseLyricsSyncOptions = {
  currentTime: number;      // Current playback time in seconds
  lyrics: TrackLyrics | null;
  offset?: number;          // Timing offset in seconds (default: 0)
};

type LyricsSyncResult = {
  currentLine: LyricLine | null;
  currentLineIndex: number;
  currentSection: LyricSection | null;
  currentSectionIndex: number;
  upcomingLines: LyricLine[];   // Next 3 lines
  progress: number;             // 0-1, progress through current line
  intensity: number;            // 0-1, current section intensity
};

export function useLyricsSync({
  currentTime,
  lyrics,
  offset = 0,
}: UseLyricsSyncOptions): LyricsSyncResult {
  const adjustedTime = currentTime + offset;

  // Get current line index
  const currentLineIndex = useMemo(() => {
    if (!lyrics?.lines.length) return -1;

    // Find the last line that starts before or at current time
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

    // Interpolate intensity between sections for smooth transitions
    const sectionDuration = nextSection.time - section.time;
    const elapsed = adjustedTime - section.time;
    const sectionProgress = Math.min(1, elapsed / sectionDuration);

    // Ease in/out interpolation
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


