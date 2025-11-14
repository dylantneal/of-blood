"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/cart-context";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Plus, Minus, ShoppingCart } from "lucide-react";

// Custom event to open cart drawer
const CART_ITEM_ADDED_EVENT = "cart-item-added";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem, isLoading } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants?.find((v) => v.available)?.id || null
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

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
    console.log('[Product Detail] Add to cart clicked');
    console.log('[Product Detail] Selected variant ID:', selectedVariantId);
    console.log('[Product Detail] Quantity:', quantity);
    console.log('[Product Detail] Variant available:', selectedVariant?.available);
    
    if (!selectedVariantId || !selectedVariant?.available) {
      console.warn('[Product Detail] Cannot add - no variant selected or not available');
      return;
    }

    setIsAdding(true);
    try {
      console.log('[Product Detail] Calling addItem...');
      await addItem(selectedVariantId, quantity);
      console.log('[Product Detail] Item added successfully, dispatching event');
      // Dispatch event to open cart drawer
      window.dispatchEvent(new CustomEvent(CART_ITEM_ADDED_EVENT));
      console.log('[Product Detail] Event dispatched');
    } catch (error) {
      console.error("[Product Detail] Failed to add to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      {/* Product Images */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square bg-muted rounded-sm overflow-hidden border border-line">
          {selectedImage?.url ? (
            <Image
              src={selectedImage.url}
              alt={selectedImage.altText || product.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gold/30 text-6xl font-display">
              OB
            </div>
          )}
        </div>

        {/* Thumbnail Images */}
        {availableImages.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {availableImages.map((image, index) => (
              <button
                key={image.id || index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative aspect-square bg-muted rounded-sm overflow-hidden border transition-all ${
                  selectedImageIndex === index
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-line hover:border-primary/50"
                }`}
              >
                {image.url ? (
                  <Image
                    src={image.url}
                    alt={image.altText || `${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
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
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {product.title}
          </h1>
          <p className="text-gold font-mono text-2xl mb-6">
            {formatPrice(displayPrice)}
          </p>
          {product.description && (
            <div
              className="text-foreground/70 prose prose-invert max-w-none mb-6"
              dangerouslySetInnerHTML={{
                __html: product.descriptionHtml || product.description,
              }}
            />
          )}
        </div>

        {/* Variant Selection */}
        {Object.keys(variantOptions).length > 0 && (
          <div className="space-y-4">
            {Object.entries(variantOptions).map(([optionName, values]) => {
              const currentValue = selectedVariant?.selectedOptions?.find(
                (opt) => opt.name === optionName
              )?.value;

              return (
                <div key={optionName}>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wider">
                    {optionName}
                  </label>
                  <div className="flex flex-wrap gap-2">
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
                          className={`px-4 py-2 border rounded-sm transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary"
                              : isAvailable
                              ? "border-line hover:border-primary/50"
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
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium uppercase tracking-wider">Quantity</label>
          <div className="flex items-center gap-2 border border-line rounded-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-muted transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-mono">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 hover:bg-muted transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleAddToCart}
          disabled={!selectedVariantId || !selectedVariant?.available || isAdding || isLoading}
        >
          {isAdding || isLoading ? (
            "Adding..."
          ) : !selectedVariant?.available ? (
            "Out of Stock"
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </>
          )}
        </Button>

        {!selectedVariant?.available && (
          <p className="text-sm text-foreground/50 text-center">
            This variant is currently out of stock
          </p>
        )}
      </div>
    </div>
  );
}

