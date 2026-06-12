"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Play, X } from "lucide-react";
import { YouTubeVideo } from "@/lib/types";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface YouTubeVideoCardProps {
  video: YouTubeVideo;
}

export function YouTubeVideoCard({ video }: YouTubeVideoCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const thumbnailUrl = video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;

  // Guards against closeModal firing more than once per open (e.g. a click
  // that hits both the X button and the backdrop): popping two history
  // entries would navigate away from the page entirely.
  const isClosingRef = useRef(false);

  // Close via X button, backdrop click, or Escape: pop the history entry we
  // pushed on open, which triggers the popstate handler below.
  const closeModal = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    if (window.history.state?.videoModal) {
      window.history.back();
    } else {
      setIsModalOpen(false);
    }
  };

  // While open: pushed history entry makes the browser back button close the
  // player instead of leaving the page. Also handles Escape + scroll lock.
  useEffect(() => {
    if (!isModalOpen) return;

    isClosingRef.current = false;
    window.history.pushState({ videoModal: true }, "");

    const handlePopState = () => {
      isClosingRef.current = true;
      setIsModalOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <Card
          className="group overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1"
          onClick={() => setIsModalOpen(true)}
        >
          <CardContent className="p-0">
            <div className="relative aspect-video bg-muted overflow-hidden">
              <Image
                src={thumbnailUrl}
                alt={video.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-20 h-20 rounded-full bg-primary/90 group-hover:bg-primary flex items-center justify-center transition-all shadow-lg shadow-primary/50"
                >
                  <Play className="w-10 h-10 text-foreground ml-1" fill="currentColor" />
                </motion.div>
              </div>
            </div>
            <div className="p-5 bg-gradient-to-b from-muted/40 to-muted/20 group-hover:from-muted/60 group-hover:to-muted/40 transition-all border-t border-line/30">
              <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors mb-2 leading-tight">
                {video.title}
              </h3>
              {video.description && (
                <p className="text-xs text-foreground/50 line-clamp-2 uppercase tracking-wide">
                  {video.description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Fullscreen autoplay player */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            onClick={closeModal}
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className="absolute top-4 right-4 z-10 p-3 bg-black/60 hover:bg-black/80 rounded-full backdrop-blur-sm transition-colors"
              aria-label="Close video"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div
              className="w-full h-full flex items-center justify-center p-4 md:p-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full max-w-7xl aspect-video max-h-full">
                <iframe
                  src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&fs=1`}
                  title={video.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
