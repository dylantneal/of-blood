"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";
import { YouTubeVideo } from "@/lib/types";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { YouTubePlayer } from "./youtube-player";

interface YouTubeVideoCardProps {
  video: YouTubeVideo;
}

export function YouTubeVideoCard({ video }: YouTubeVideoCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const thumbnailUrl = video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;

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

      {/* Modal with YouTube Player */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl bg-background border border-line rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                  {video.title}
                </h2>
                <YouTubePlayer
                  video={video}
                  onClose={() => setIsModalOpen(false)}
                />
                {video.description && (
                  <p className="text-foreground/70 mt-4">{video.description}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

