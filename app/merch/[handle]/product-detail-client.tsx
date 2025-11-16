"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/cart-context";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { ImageLightbox } from "./image-lightbox";

// Custom event to open cart drawer
const CART_ITEM_ADDED_EVENT = "cart-item-added";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem, isLoading } = useCart();
  
  // Helper to find default variant - prefer Medium size if available
  const findDefaultVariant = () => {
    if (!product.variants) return null;
    
    // Try to find Medium or M size first
    const mediumVariant = product.variants.find((v) => 
      v.available && v.selectedOptions?.some(
        (opt) => opt.name.toLowerCase() === 'size' && 
        (opt.value.toLowerCase() === 'medium' || opt.value.toLowerCase() === 'm')
      )
    );
    
    if (mediumVariant) return mediumVariant.id;
    
    // Fall back to first available variant
    return product.variants.find((v) => v.available)?.id || null;
  };
  
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(findDefaultVariant());
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const displayPrice = selectedVariant?.price || product.price;
  const availableImages = product.images || [{ id: 'fallback', url: product.image, altText: product.title }];
  const selectedImage = availableImages[selectedImageIndex] || availableImages[0];

  // Group variants by option (e.g., Size, Color)
  const variantOptions = product.variants?.reduce((acc, variant) => {
    variant.selectedOptions?.forEach((option) => {
      if (!acc[option.name]) {
        acc[option.name] = new Set<string>();
      }
      acc[option.name].add(option.value);
    });
    return acc;
  }, {} as Record<string, Set<string>>) || {};

  const handleAddToCart = async () => {
    console.log('[Product Detail] ========== ADD TO CART CLICKED ==========');
    console.log('[Product Detail] Selected variant ID:', selectedVariantId);
    console.log('[Product Detail] Quantity being added:', quantity);
    console.log('[Product Detail] Product title:', product.title);
    console.log('[Product Detail] Variant available:', selectedVariant?.available);
    
    if (!selectedVariantId || !selectedVariant?.available) {
      console.warn('[Product Detail] Cannot add - no variant selected or not available');
      return;
    }

    setIsAdding(true);
    try {
      console.log('[Product Detail] Calling addItem with quantity:', quantity);
      await addItem(selectedVariantId, quantity);
      console.log('[Product Detail] ✓ Item added successfully with quantity:', quantity);
      // Dispatch event to open cart drawer
      window.dispatchEvent(new CustomEvent(CART_ITEM_ADDED_EVENT));
      console.log('[Product Detail] ✓ Event dispatched to open cart drawer');
    } catch (error) {
      console.error("[Product Detail] ✗ Failed to add to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-[1.3fr_1fr] lg:max-h-[calc(100vh-10rem)] overflow-visible">
        {/* Product Images */}
        <div className="space-y-3">
          {/* Main Image */}
          <div 
            className="relative aspect-square bg-muted rounded-sm overflow-hidden border border-line occult-hover cursor-zoom-in group"
            onClick={() => setIsLightboxOpen(true)}
          >
            {selectedImage?.url ? (
              <Image
                src={selectedImage.url}
                alt={selectedImage.altText || product.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gold/30 text-6xl font-display">
                OB
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {availableImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {availableImages.map((image, index) => (
                <button
                  key={image.id || index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square bg-muted rounded-sm overflow-hidden border transition-all ${
                    selectedImageIndex === index
                      ? "border-primary ring-1 ring-primary/30 shadow-[0_0_12px_rgba(179,10,10,0.4)]"
                      : "border-line hover:border-primary/50 hover:shadow-[0_0_8px_rgba(179,10,10,0.2)]"
                  }`}
                >
                  {image.url ? (
                    <Image
                      src={image.url}
                      alt={image.altText || `${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gold/20 text-xs">
                      OB
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

      {/* Product Info */}
      <div className="flex flex-col lg:h-full lg:overflow-y-auto custom-scrollbar pb-8 px-2">
        <div className="space-y-4 lg:space-y-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-3 product-title" style={{ letterSpacing: '0.03em' }}>
              {product.title}
            </h1>
            <p className="font-mono text-2xl mb-4 price-antique">
              <span className="occult-glyph text-xl">✦</span>
              {formatPrice(displayPrice)}
            </p>
            {product.description && (
              <div
                className="text-foreground/70 text-sm leading-relaxed prose prose-invert prose-sm max-w-none mb-4"
                dangerouslySetInnerHTML={{
                  __html: product.descriptionHtml || product.description,
                }}
              />
            )}
          </div>

        {/* Variant Selection */}
        {Object.keys(variantOptions).length > 0 && (
          <div className="space-y-3">
            {Object.entries(variantOptions).map(([optionName, values]) => {
              // Skip "Title" option if it's just "Default Title"
              if (optionName === 'Title' && values.has('Default Title')) {
                return null;
              }
              
              const currentValue = selectedVariant?.selectedOptions?.find(
                (opt) => opt.name === optionName
              )?.value;

              return (
                <div key={optionName}>
                  <label className="block text-xs font-medium mb-2 uppercase tracking-wider text-foreground/80">
                    {optionName}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(values).map((value) => {
                      const variantForValue = product.variants?.find(
                        (v) =>
                          v.available &&
                          v.selectedOptions?.some(
                            (opt) => opt.name === optionName && opt.value === value
                          )
                      );
                      const isSelected = currentValue === value;
                      const isAvailable = !!variantForValue;

                      return (
                        <button
                          key={value}
                          onClick={() => {
                            if (variantForValue) {
                              setSelectedVariantId(variantForValue.id);
                            }
                          }}
                          disabled={!isAvailable}
                          className={`px-3 py-1.5 text-sm border rounded-sm transition-all font-display uppercase tracking-wider ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary shadow-[0_0_12px_rgba(179,10,10,0.3)]"
                              : isAvailable
                              ? "border-line hover:border-primary/50 hover:shadow-[0_0_8px_rgba(179,10,10,0.2)]"
                              : "border-line/30 text-foreground/30 cursor-not-allowed"
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium uppercase tracking-wider text-foreground/80">Quantity</label>
          <div className="flex items-center gap-1 border border-line rounded-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1.5 hover:bg-muted transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-10 text-center text-sm font-mono">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1.5 hover:bg-muted transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="primary"
          size="default"
          className="w-full mt-4"
          onClick={handleAddToCart}
          disabled={!selectedVariantId || !selectedVariant?.available || isAdding || isLoading}
        >
          {isAdding || isLoading ? (
            "Adding to Collection..."
          ) : !selectedVariant?.available ? (
            "Out of Stock"
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Collection
            </>
          )}
        </Button>

        {!selectedVariant?.available && (
          <p className="text-xs text-foreground/50 text-center mt-2">
            This variant is currently out of stock
          </p>
        )}
        </div>
      </div>
    </div>

    {/* Image Lightbox */}
    <ImageLightbox
      images={availableImages}
      initialIndex={selectedImageIndex}
      isOpen={isLightboxOpen}
      onClose={() => setIsLightboxOpen(false)}
    />
    </>
  );
}

