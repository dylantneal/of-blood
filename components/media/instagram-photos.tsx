"use client";

import { useState } from "react";
import { InstagramPost } from "@/lib/types";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";

interface InstagramPhotosProps {
  posts: InstagramPost[];
}

export function InstagramPhotos({ posts }: InstagramPhotosProps) {
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);

  if (posts.length === 0) {
    return (
      <div className="p-12 border border-line bg-muted/30 text-center">
        <p className="font-display text-xl font-semibold mb-2 text-foreground/90">
          No Instagram Posts Available
        </p>
        <p className="text-foreground/70">
          Instagram posts will appear here once connected.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group relative aspect-square bg-muted overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            <Image
              src={post.mediaUrl}
              alt={post.caption || "Instagram post"}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/0 to-background/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            {post.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-sm text-foreground/90 line-clamp-2">
                  {post.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl bg-background border border-line rounded-lg overflow-hidden"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative aspect-square w-full bg-muted">
                <Image
                  src={selectedPost.mediaUrl}
                  alt={selectedPost.caption || "Instagram post"}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>

              {/* Caption and Actions */}
              {(selectedPost.caption || selectedPost.permalink) && (
                <div className="p-6 border-t border-line">
                  {selectedPost.caption && (
                    <p className="text-foreground/90 mb-4">{selectedPost.caption}</p>
                  )}
                  {selectedPost.permalink && (
                    <a
                      href={selectedPost.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                    >
                      View on Instagram
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 rounded backdrop-blur-sm transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

