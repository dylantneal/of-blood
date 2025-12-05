"use client";

import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/contexts/audio-context";
import { Release, Track } from "@/lib/types";

interface PlayReleaseButtonProps {
  release: Release;
  track: Track;
  trackIndex?: number;
}

export function PlayReleaseButton({ release, track, trackIndex = 0 }: PlayReleaseButtonProps) {
  const { nowPlaying, isPlaying, playTrack, playPause } = useAudio();
  
  const isCurrentTrack = 
    nowPlaying?.track.title === track.title && 
    nowPlaying?.release.id === release.id;
  
  const handleClick = () => {
    if (isCurrentTrack) {
      playPause();
    } else if (track.audioUrl) {
      playTrack(track, release, release.id, trackIndex);
    }
  };

  if (!track.audioUrl) {
    return null;
  }

  return (
    <Button 
      variant="ghost" 
      onClick={handleClick}
      className="flex items-center gap-2"
    >
      {isCurrentTrack && isPlaying ? (
        <>
          <Pause className="w-4 h-4" />
          Pause
        </>
      ) : (
        <>
          <Play className="w-4 h-4" />
          Play Now
        </>
      )}
    </Button>
  );
}


