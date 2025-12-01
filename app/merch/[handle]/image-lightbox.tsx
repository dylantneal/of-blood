"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageLightboxProps {
  images: Array<{ id: string; url: string; altText: string | null }>;
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageLightbox({ images, initialIndex, isOpen, onClose }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (initialIndex >= 0 && initialIndex < images.length) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, images.length]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  const handlePrevious = () => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose, handlePrevious, handleNext]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-foreground hover:text-primary transition-colors bg-background/20 backdrop-blur-sm rounded-sm border border-line/30"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-foreground hover:text-primary transition-colors bg-background/20 backdrop-blur-sm rounded-sm border border-line/30"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-foreground hover:text-primary transition-colors bg-background/20 backdrop-blur-sm rounded-sm border border-line/30"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* Main Image */}
        <div
          className="flex items-center justify-center w-full h-full p-4 md:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full max-w-5xl max-h-full"
          >
            <Image
              src={images[currentIndex].url}
              alt={images[currentIndex].altText || "Product image"}
              fill
              className="object-contain"
              priority
              sizes="100vw"
            />
          </motion.div>
        </div>

        {/* Image Counter & Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex justify-center items-center gap-2 mb-4">
              <span className="text-sm text-foreground/70 font-mono">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
            
            {/* Thumbnail Strip */}
            <div className="flex justify-center gap-2 overflow-x-auto pb-2 max-w-4xl mx-auto">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-sm overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? 'border-primary shadow-[0_0_15px_rgba(179,10,10,0.6)]'
                      : 'border-line/30 hover:border-primary/50'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.altText || `Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

