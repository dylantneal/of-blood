"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface AnimatedProductGridProps {
  products: Product[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 0.8,
    },
  },
};

export function AnimatedProductGrid({ products }: AnimatedProductGridProps) {
  return (
    <motion.div
      className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product, index) => {
        // Get secondary image for hover swap (prefer 2nd image, fallback to 1st)
        const secondaryImage =
          product.images && product.images.length > 1
            ? product.images[1].url
            : null;

        return (
          <motion.div
            key={product.id}
            variants={itemVariants}
            whileHover={{ 
              y: -8,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
          >
            <Card className="group overflow-visible corner-ornaments transition-all duration-400 artifact-glow h-full">
              <CardContent className="p-0">
                <Link href={`/merch/${product.handle}`}>
                  <div className="metal-frame">
                    <div
                      className={`relative aspect-square bg-muted overflow-hidden ${
                        secondaryImage ? "image-swap-container" : ""
                      }`}
                    >
                      {product.image ? (
                        <>
                          {/* Primary Image */}
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-105 primary-image"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />

                          {/* Secondary Image (shows on hover if available) */}
                          {secondaryImage && (
                            <Image
                              src={secondaryImage}
                              alt={`${product.title} - Detail`}
                              fill
                              className="object-cover transition-all duration-500 secondary-image"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          )}
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gold/30 text-6xl font-display">
                          OB
                        </div>
                      )}

                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                </Link>
              </CardContent>
              <CardFooter className="p-6 bg-gradient-to-b from-muted/30 to-muted/60">
                <Link href={`/merch/${product.handle}`} className="w-full">
                  <div>
                    <h3 className="font-display text-xl font-semibold mb-3 product-title">
                      {product.title}
                    </h3>
                    <p className="font-mono text-lg price-antique">
                      <span className="occult-glyph">✦</span>
                      {formatPrice(product.price)}
                      {product.priceMax && product.priceMax !== product.price && (
                        <span className="text-foreground/40 ml-1">
                          - {formatPrice(product.priceMax)}
                        </span>
                      )}
                    </p>
                  </div>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

