"use client";

import { useState, useRef, useEffect } from "react";
import { Play, X, Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { YouTubeVideo } from "@/lib/types";
import Image from "next/image";

interface YouTubePlayerProps {
  video: YouTubeVideo;
  onClose?: () => void;
}

export function YouTubePlayer({ video, onClose }: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerInstanceRef = useRef<any>(null);

  // Load YouTube IFrame API
  useEffect(() => {
    // Check if script is already loaded
    if (typeof window !== "undefined" && window.YT && window.YT.Player) {
      initializePlayer();
      return;
    }

    if (typeof window === "undefined") return;

    // Check if script is already in the DOM
    const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (existingScript) {
      // Script exists, wait for API to be ready
      if (window.YT && window.YT.Player) {
        initializePlayer();
      } else {
        window.onYouTubeIframeAPIReady = () => {
          initializePlayer();
        };
      }
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Wait for API to be ready
    window.onYouTubeIframeAPIReady = () => {
      initializePlayer();
    };

    return () => {
      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.destroy();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [video.videoId]);

  const initializePlayer = () => {
    if (typeof window === "undefined" || !playerRef.current || !video.videoId) return;

    try {
      playerInstanceRef.current = new window.YT.Player(playerRef.current, {
        videoId: video.videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0, // Don't show related videos
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
          origin: typeof window !== "undefined" ? window.location.origin : "",
        },
        events: {
          onReady: (event: any) => {
            setPlayerReady(true);
            // Get thumbnail if not provided
            if (!video.thumbnail) {
              const thumbnailUrl = `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;
              // We could update the video object here if needed
            }
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING = 1
            // YT.PlayerState.PAUSED = 2
            // YT.PlayerState.ENDED = 0
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else {
              setIsPlaying(false);
            }
          },
        },
      });
    } catch (error) {
      console.error("Error initializing YouTube player:", error);
    }
  };

  const handlePlay = () => {
    if (playerInstanceRef.current) {
      playerInstanceRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const handleFullscreen = () => {
    if (!playerRef.current) return;

    if (!isFullscreen) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      } else if ((playerRef.current as any).webkitRequestFullscreen) {
        (playerRef.current as any).webkitRequestFullscreen();
      } else if ((playerRef.current as any).mozRequestFullScreen) {
        (playerRef.current as any).mozRequestFullScreen();
      } else if ((playerRef.current as any).msRequestFullscreen) {
        (playerRef.current as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!(document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).msFullscreenElement)
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  const thumbnailUrl = video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;

  return (
    <div className="relative w-full aspect-video bg-black rounded-sm overflow-hidden group">
      {/* YouTube Player Container */}
      <div ref={playerRef} className="w-full h-full" />

      {/* Thumbnail Overlay (shown before player is ready) */}
      <AnimatePresence>
        {!playerReady && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-muted"
          >
            <Image
              src={thumbnailUrl}
              alt={video.title}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button
                onClick={handlePlay}
                className="w-20 h-20 rounded-full bg-primary/90 hover:bg-primary flex items-center justify-center transition-colors group-hover:scale-110"
                aria-label="Play video"
              >
                <Play className="w-10 h-10 text-foreground ml-1" fill="currentColor" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Overlay */}
      {playerReady && (
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={handleFullscreen}
            className="p-2 bg-black/60 hover:bg-black/80 rounded backdrop-blur-sm transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 text-foreground" />
            ) : (
              <Maximize2 className="w-5 h-5 text-foreground" />
            )}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 bg-black/60 hover:bg-black/80 rounded backdrop-blur-sm transition-colors"
              aria-label="Close player"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Extend Window interface for YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

