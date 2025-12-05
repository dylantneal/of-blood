"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { ImmersiveContainer } from "@/components/music/immersive";
import { Track, Release } from "@/lib/types";

// Load releases data
const releasesData = require("@/data/releases.json") as Release[];

// Find track by slug across all releases
function findTrackAndRelease(trackId: string): { track: Track; release: Release } | null {
  for (const release of releasesData) {
    const track = release.tracks?.find(
      (t) => t.slug === trackId || t.title.toLowerCase().replace(/\s+/g, "-") === trackId
    );
    if (track) {
      return { track, release };
    }
  }
  return null;
}

export default function ImmersiveExperiencePage() {
  const params = useParams();
  const trackId = params.trackId as string;
  
  const [mounted, setMounted] = useState(false);
  const result = findTrackAndRelease(trackId);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle not found
  if (!result) {
    // Return loading state on first render to avoid hydration mismatch
    if (!mounted) {
      return (
        <div className="fixed inset-0 bg-black flex items-center justify-center">
          <div className="animate-pulse text-foreground/50">Loading...</div>
        </div>
      );
    }
    notFound();
  }

  const { track, release } = result;

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="animate-pulse text-foreground/50">
          <span className="font-display text-xl">Loading...</span>
        </div>
      </div>
    );
  }

  return <ImmersiveContainer track={track} release={release} />;
}


