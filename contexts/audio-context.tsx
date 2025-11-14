"use client";

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";
import { Track, Release, NowPlaying } from "@/lib/types";

type AudioContextType = {
  // State
  nowPlaying: NowPlaying;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMinimized: boolean;
  queue: Array<{ track: Track; release: Release; releaseId: string; trackIndex: number }>;
  currentQueueIndex: number;

  // Actions
  playTrack: (track: Track, release: Release, releaseId: string, trackIndex: number) => void;
  playPause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMinimize: () => void;
  playNext: () => void;
  playPrevious: () => void;
  addToQueue: (track: Track, release: Release, releaseId: string, trackIndex: number) => void;
  clearQueue: () => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMinimized, setIsMinimized] = useState(false);
  const [queue, setQueue] = useState<Array<{ track: Track; release: Release; releaseId: string; trackIndex: number }>>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(-1);
  
  // Use refs to access latest state in event handlers
  const nowPlayingRef = useRef<NowPlaying>(null);
  const queueRef = useRef<Array<{ track: Track; release: Release; releaseId: string; trackIndex: number }>>([]);
  const currentQueueIndexRef = useRef(-1);
  
  // Keep refs in sync with state
  useEffect(() => {
    nowPlayingRef.current = nowPlaying;
  }, [nowPlaying]);
  
  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);
  
  useEffect(() => {
    currentQueueIndexRef.current = currentQueueIndex;
  }, [currentQueueIndex]);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audioRef.current = audio;

      // Event listeners
      const handleLoadedMetadata = () => {
        if (audioRef.current) {
          const duration = audioRef.current.duration;
          if (isFinite(duration) && duration > 0) {
            setDuration(duration);
          }
        }
      };

      const handleLoadedData = () => {
        if (audioRef.current) {
          const duration = audioRef.current.duration;
          if (isFinite(duration) && duration > 0) {
            setDuration(duration);
          }
        }
      };

      const handleTimeUpdate = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      };

      const handleEnded = () => {
        // Use a timeout to ensure state is up to date
        setTimeout(() => {
          handleTrackEnd();
        }, 0);
      };

      const handlePlay = () => {
        setIsPlaying(true);
      };

      const handlePause = () => {
        setIsPlaying(false);
      };

      const handleError = (e: Event) => {
        console.error("Audio error:", e);
        setIsPlaying(false);
      };

      // Add multiple listeners to ensure duration is captured
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("loadeddata", handleLoadedData);
      audio.addEventListener("canplay", handleLoadedMetadata);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("error", handleError);

      // Cleanup
      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("loadeddata", handleLoadedData);
        audio.removeEventListener("canplay", handleLoadedMetadata);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("error", handleError);
      };
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update volume when state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Note: Audio source is set in playTrack function, not here
  // This prevents conflicts and AbortError issues

  const handleTrackEnd = () => {
    // Use refs to get latest state
    const currentQueue = queueRef.current;
    const currentQueueIdx = currentQueueIndexRef.current;
    const currentNowPlaying = nowPlayingRef.current;
    
    if (currentQueue.length > 0 && currentQueueIdx < currentQueue.length - 1) {
      // Play next in queue
      playNext();
    } else if (currentNowPlaying && currentNowPlaying.release.tracks) {
      // Try to play next track in the same release
      const nextTrackIndex = currentNowPlaying.trackIndex + 1;
      if (nextTrackIndex < currentNowPlaying.release.tracks.length) {
        const nextTrack = currentNowPlaying.release.tracks[nextTrackIndex];
        if (nextTrack.audioUrl) {
          // Auto-play next track in release
          playTrack(nextTrack, currentNowPlaying.release, currentNowPlaying.releaseId, nextTrackIndex);
          return;
        }
      }
    }
    
    // No more tracks, stop
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const playTrack = async (
    track: Track,
    release: Release,
    releaseId: string,
    trackIndex: number
  ) => {
    if (!track.audioUrl) {
      console.warn("No audio URL for track:", track.title);
      return;
    }

    if (!audioRef.current) return;

    const audio = audioRef.current;
    
    // Reset time and duration when changing tracks
    setCurrentTime(0);
    setDuration(0);
    
    // Pause and reset any current playback to prevent conflicts
    audio.pause();
    audio.currentTime = 0;

    // Update state
    setNowPlaying({ track, release, releaseId, trackIndex });
    
    // Set source and load
    audio.src = track.audioUrl;
    audio.load();
    
    // Helper function to update duration when available
    const updateDuration = () => {
      if (audioRef.current) {
        const duration = audioRef.current.duration;
        if (isFinite(duration) && duration > 0) {
          setDuration(duration);
        }
      }
    };

    // Listen for duration updates
    const handleDurationUpdate = () => {
      updateDuration();
    };
    
    audio.addEventListener('loadedmetadata', handleDurationUpdate, { once: true });
    audio.addEventListener('loadeddata', handleDurationUpdate, { once: true });
    audio.addEventListener('canplay', handleDurationUpdate, { once: true });
    
    // Helper function to safely play audio
    const safePlay = () => {
      if (!audioRef.current || audioRef.current.src !== audio.src) {
        return; // Source changed, don't play
      }
      
      // Ensure duration is set before playing
      updateDuration();
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Successfully started playing - ensure state is updated
            if (audioRef.current && !audioRef.current.paused) {
              setIsPlaying(true);
            }
          })
          .catch((error) => {
            // Ignore AbortError - it's expected when source changes rapidly
            // Ignore NotAllowedError - user interaction required in some browsers
            if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
              console.error("Error playing audio:", error);
            }
            setIsPlaying(false);
          });
      } else {
        // If play() returns undefined, check if it's actually playing
        if (audioRef.current && !audioRef.current.paused) {
          setIsPlaying(true);
        }
      }
    };
    
    // Wait for audio to be ready before playing
    const handleCanPlay = () => {
      if (audioRef.current && audioRef.current.src === audio.src) {
        updateDuration();
        safePlay();
      }
    };

    // Remove any existing canplay listeners to avoid duplicates
    audio.removeEventListener('canplay', handleCanPlay);
    audio.addEventListener('canplay', handleCanPlay, { once: true });
    
    // If already ready to play, play immediately
    if (audio.readyState >= 2) {
      updateDuration();
      safePlay();
    }
  };

  const playPause = () => {
    if (!audioRef.current || !nowPlaying) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Successfully started playing
            setIsPlaying(true);
          })
          .catch((error) => {
            // Ignore AbortError - it's expected in some cases
            if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
              console.error("Error playing audio:", error);
            }
            setIsPlaying(false);
          });
      } else {
        // If play() returns undefined, check if it's actually playing
        if (audioRef.current && !audioRef.current.paused) {
          setIsPlaying(true);
        }
      }
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const playNext = () => {
    if (queue.length > 0 && currentQueueIndex < queue.length - 1) {
      const nextIndex = currentQueueIndex + 1;
      const nextItem = queue[nextIndex];
      setCurrentQueueIndex(nextIndex);
      playTrack(nextItem.track, nextItem.release, nextItem.releaseId, nextItem.trackIndex);
    } else if (nowPlaying && nowPlaying.release.tracks) {
      // Play next track in same release
      const nextTrackIndex = nowPlaying.trackIndex + 1;
      if (nextTrackIndex < nowPlaying.release.tracks.length) {
        const nextTrack = nowPlaying.release.tracks[nextTrackIndex];
        if (nextTrack.audioUrl) {
          playTrack(nextTrack, nowPlaying.release, nowPlaying.releaseId, nextTrackIndex);
        }
      }
    }
  };

  const playPrevious = () => {
    if (queue.length > 0 && currentQueueIndex > 0) {
      const prevIndex = currentQueueIndex - 1;
      const prevItem = queue[prevIndex];
      setCurrentQueueIndex(prevIndex);
      playTrack(prevItem.track, prevItem.release, prevItem.releaseId, prevItem.trackIndex);
    } else if (nowPlaying && nowPlaying.release.tracks) {
      // Play previous track in same release
      const prevTrackIndex = nowPlaying.trackIndex - 1;
      if (prevTrackIndex >= 0) {
        const prevTrack = nowPlaying.release.tracks[prevTrackIndex];
        if (prevTrack.audioUrl) {
          playTrack(prevTrack, nowPlaying.release, nowPlaying.releaseId, prevTrackIndex);
        }
      } else {
        // Restart current track
        seek(0);
      }
    }
  };

  const addToQueue = (
    track: Track,
    release: Release,
    releaseId: string,
    trackIndex: number
  ) => {
    setQueue((prev) => [...prev, { track, release, releaseId, trackIndex }]);
  };

  const clearQueue = () => {
    setQueue([]);
    setCurrentQueueIndex(-1);
  };

  return (
    <AudioContext.Provider
      value={{
        nowPlaying,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMinimized,
        queue,
        currentQueueIndex,
        playTrack,
        playPause,
        seek,
        setVolume,
        toggleMinimize,
        playNext,
        playPrevious,
        addToQueue,
        clearQueue,
      }}
    >
      {children}
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}

