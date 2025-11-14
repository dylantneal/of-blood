"use client";

import { useState, useEffect, useRef } from "react";
import { InstagramPost } from "@/lib/types";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, ChevronDown } from "lucide-react";

interface InstagramFeedProps {
  posts: InstagramPost[];
}

export function InstagramFeed({ posts }: InstagramFeedProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const currentPost = selectedIndex !== null ? posts[selectedIndex] : null;

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < posts.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setIsVideoPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setIsVideoPlaying(false);
    }
  };

  const handleClose = () => {
    setSelectedIndex(null);
    setIsVideoPlaying(false);
    // Pause all videos
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") handleNext();
      if (e.key === "ArrowUp") handlePrevious();
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  // Mouse wheel navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    let lastScrollTime = 0;

      const handleWheel = (e: Event) => {
        const wheelEvent = e as WheelEvent;
      // Prevent default scrolling
      e.preventDefault();
      
      const now = Date.now();
      // Throttle to prevent rapid scrolling (max once per 300ms)
      if (now - lastScrollTime < 300) return;
      lastScrollTime = now;
      
      // Small threshold to prevent accidental scrolling
      const scrollThreshold = 30;
      
      if (Math.abs(wheelEvent.deltaY) > scrollThreshold) {
        if (wheelEvent.deltaY > 0) {
          // Scrolling down - next post
          if (selectedIndex !== null && selectedIndex < posts.length - 1) {
            setSelectedIndex(selectedIndex + 1);
            setIsVideoPlaying(false);
          }
        } else {
          // Scrolling up - previous post
          if (selectedIndex !== null && selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
            setIsVideoPlaying(false);
          }
        }
      }
    };

    const container = document.querySelector('[data-lightbox-container]');
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, [selectedIndex, posts.length]);

  // Swipe gestures for mobile (vertical)
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > 50; // Swiping up (finger moving down) = next
    const isDownSwipe = distance < -50; // Swiping down (finger moving up) = previous

    if (isUpSwipe) handleNext();
    if (isDownSwipe) handlePrevious();
  };

  const toggleVideoPlay = () => {
    if (!currentPost || currentPost.type !== "video") return;
    
    const video = videoRefs.current[currentPost.id];
    if (video) {
      if (isVideoPlaying) {
        video.pause();
        setIsVideoPlaying(false);
      } else {
        video.play();
        setIsVideoPlaying(true);
      }
    }
  };

  if (posts.length === 0) {
    return (
      <div className="p-16 border border-line/50 bg-muted/20 rounded-lg text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-primary/5" />
        <div className="relative z-10">
          <p className="font-display text-xl font-semibold mb-2 text-foreground/90">
            No Posts Available
          </p>
          <p className="text-foreground/70">
            Add images and videos by editing <code className="bg-muted px-2 py-1 rounded text-sm border border-line/50">data/instagram-posts.json</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group relative aspect-[4/5] bg-muted overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all duration-300 cursor-pointer rounded-sm hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1"
            onClick={() => {
              setSelectedIndex(index);
              setIsVideoPlaying(false);
            }}
          >
            {post.type === "image" ? (
              <Image
                src={post.mediaUrl}
                alt={post.caption || "Instagram post"}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : post.type === "youtube" ? (
              <>
                <Image
                  src={post.thumbnailUrl || `https://img.youtube.com/vi/${post.mediaUrl}/maxresdefault.jpg`}
                  alt={post.caption || "YouTube video"}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  unoptimized
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" fill="currentColor" />
                  </div>
                </div>
              </>
            ) : (
              <video
                ref={(el) => {
                  videoRefs.current[post.id] = el;
                  // Force autoplay when element is ready
                  if (el) {
                    el.muted = true;
                    el.loop = true;
                    el.playsInline = true;
                    el.setAttribute('autoplay', '');
                    el.setAttribute('muted', '');
                    el.setAttribute('loop', '');
                    el.setAttribute('playsinline', '');
                    // Try to play immediately
                    el.play().catch(() => {
                      // Will retry on load events
                    });
                  }
                }}
                src={post.mediaUrl}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                autoPlay
                controls={false}
                onLoadedMetadata={(e) => {
                  const video = e.currentTarget;
                  video.muted = true;
                  video.play().catch(() => {});
                }}
                onLoadedData={(e) => {
                  const video = e.currentTarget;
                  if (video.paused) {
                    video.play().catch(() => {});
                  }
                }}
                onCanPlay={(e) => {
                  const video = e.currentTarget;
                  if (video.paused) {
                    video.play().catch(() => {});
                  }
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {post.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                <p className="text-sm text-white line-clamp-2 drop-shadow-lg">
                  {post.caption}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Full-Screen Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && currentPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={handleClose}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 p-3 bg-black/60 hover:bg-black/80 rounded-full backdrop-blur-sm transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Post Counter - Moved to top */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
              <div className="px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full">
                <span className="text-white text-sm">
                  {selectedIndex + 1} / {posts.length}
                </span>
              </div>
            </div>

            {/* Scroll Indicators */}
            <div className="absolute inset-0 pointer-events-none z-10">
              {/* Down Arrow - Show if not last post - Positioned above caption area */}
              {selectedIndex < posts.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
                >
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ChevronDown className="w-5 h-5 text-white/60" />
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* Content */}
            <div
              data-lightbox-container
              className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative max-w-4xl w-full h-full flex flex-col items-center justify-center"
              >
                {currentPost.type === "image" ? (
                  <div className="relative w-full h-full max-h-[90vh]">
                    <Image
                      src={currentPost.mediaUrl}
                      alt={currentPost.caption || "Post"}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : currentPost.type === "youtube" ? (
                  <div className="relative w-full h-full max-h-[90vh] bg-black">
                    <div className="relative w-full h-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${currentPost.mediaUrl}?autoplay=1&rel=0&modestbranding=1`}
                        className="absolute top-0 left-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full max-h-[90vh] bg-black">
                    <video
                      ref={(el) => {
                        videoRefs.current[currentPost.id] = el;
                        if (el && isVideoPlaying) {
                          el.play();
                        }
                      }}
                      src={currentPost.mediaUrl}
                      className="w-full h-full object-contain"
                      controls
                      autoPlay={isVideoPlaying}
                      loop
                      playsInline
                      onPlay={() => setIsVideoPlaying(true)}
                      onPause={() => setIsVideoPlaying(false)}
                    />
                  </div>
                )}

                {/* Caption */}
                {currentPost.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                    <p className="text-white text-center max-w-2xl mx-auto">
                      {currentPost.caption}
                    </p>
                  </div>
                )}

                {/* Video Play/Pause Overlay - Only for regular videos, not YouTube */}
                {currentPost.type === "video" && (
                  <button
                    onClick={toggleVideoPlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                    aria-label={isVideoPlaying ? "Pause" : "Play"}
                  >
                    {!isVideoPlaying && (
                      <div className="w-20 h-20 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <Play className="w-10 h-10 text-white ml-1" fill="currentColor" />
                      </div>
                    )}
                  </button>
                )}
              </motion.div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

