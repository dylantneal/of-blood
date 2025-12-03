"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AudioAnalysis } from "@/lib/types";

type UseAudioAnalyzerOptions = {
  fftSize?: number;        // FFT size for frequency analysis (default: 256)
  smoothingTimeConstant?: number; // 0-1, smoothing (default: 0.8)
  enabled?: boolean;       // Whether analysis is active
};

export function useAudioAnalyzer(
  audioElement: HTMLAudioElement | null,
  options: UseAudioAnalyzerOptions = {}
) {
  const {
    fftSize = 256,
    smoothingTimeConstant = 0.8,
    enabled = true,
  } = options;

  const [analysis, setAnalysis] = useState<AudioAnalysis>({
    bass: 0,
    mids: 0,
    highs: 0,
    overall: 0,
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const connectedRef = useRef(false);

  // Analyze frequency data and extract bass, mids, highs
  const analyze = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current || !enabled) {
      rafRef.current = requestAnimationFrame(analyze);
      return;
    }

    analyserRef.current.getByteFrequencyData(dataArrayRef.current as Uint8Array<ArrayBuffer>);
    const data = dataArrayRef.current;
    const bufferLength = data.length;

    // Split frequency bands (approximate for 44.1kHz sample rate)
    // Bass: 0-250Hz, Mids: 250-4000Hz, Highs: 4000Hz+
    const bassEnd = Math.floor(bufferLength * 0.1);      // ~0-250Hz
    const midsEnd = Math.floor(bufferLength * 0.5);      // ~250-4000Hz

    let bassSum = 0;
    let midsSum = 0;
    let highsSum = 0;

    for (let i = 0; i < bufferLength; i++) {
      const value = data[i] / 255; // Normalize to 0-1
      if (i < bassEnd) {
        bassSum += value;
      } else if (i < midsEnd) {
        midsSum += value;
      } else {
        highsSum += value;
      }
    }

    // Normalize by count and apply some scaling for visual impact
    const bass = Math.min(1, (bassSum / bassEnd) * 1.2);
    const mids = Math.min(1, (midsSum / (midsEnd - bassEnd)) * 1.1);
    const highs = Math.min(1, (highsSum / (bufferLength - midsEnd)) * 1.3);
    
    // Overall is weighted average (bass has more visual impact)
    const overall = bass * 0.5 + mids * 0.3 + highs * 0.2;

    setAnalysis({ bass, mids, highs, overall });

    rafRef.current = requestAnimationFrame(analyze);
  }, [enabled]);

  // Setup audio context and analyzer
  useEffect(() => {
    if (!audioElement || !enabled) return;

    // Create audio context on first interaction
    const setupAudio = () => {
      if (connectedRef.current) return;

      try {
        // Create or resume audio context
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const audioContext = audioContextRef.current;

        // Resume if suspended
        if (audioContext.state === "suspended") {
          audioContext.resume();
        }

        // Create analyzer node
        analyserRef.current = audioContext.createAnalyser();
        analyserRef.current.fftSize = fftSize;
        analyserRef.current.smoothingTimeConstant = smoothingTimeConstant;

        // Create data array
        dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);

        // Connect audio element to analyzer (only once)
        // Note: MediaElementAudioSourceNode can only be created once per audio element
        if (!sourceRef.current) {
          try {
            sourceRef.current = audioContext.createMediaElementSource(audioElement);
            sourceRef.current.connect(analyserRef.current);
            analyserRef.current.connect(audioContext.destination);
          } catch (sourceError: any) {
            // If source already exists (from another component), we can still analyze
            // by using a workaround - just run without visual reactivity
            if (sourceError.name === "InvalidStateError") {
              console.warn("Audio element already has a source. Visual reactivity may be limited.");
              connectedRef.current = true;
              rafRef.current = requestAnimationFrame(analyze);
              return;
            }
            throw sourceError;
          }
        }

        connectedRef.current = true;

        // Start analysis loop
        rafRef.current = requestAnimationFrame(analyze);
      } catch (error) {
        console.warn("Audio analyzer setup failed:", error);
      }
    };

    // Setup on play event (requires user interaction)
    audioElement.addEventListener("play", setupAudio);

    // If already playing, setup immediately
    if (!audioElement.paused) {
      setupAudio();
    }

    return () => {
      audioElement.removeEventListener("play", setupAudio);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [audioElement, fftSize, smoothingTimeConstant, enabled, analyze]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      // Don't close audio context - it's shared with the audio element
    };
  }, []);

  return analysis;
}

