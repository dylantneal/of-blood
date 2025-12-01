import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { getProducts } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/lib/types";

export async function FeaturedMerch() {
  // Fetch real products from Shopify (limit to 3 for homepage)
  let products: Product[] = [];
  try {
    products = await getProducts(3);
  } catch (error) {
    console.error('Error loading featured products:', error);
    // If there's an error, we'll just show empty state
  }

  return (
    <Section>
      <Container>
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">Merch</h2>
          <p className="text-foreground/60 max-w-xl mx-auto font-light leading-relaxed">
            Premium apparel and collectibles for metalheads.
          </p>
        </div>

        {products.length > 0 ? (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {products.map((product) => {
                // Get secondary image for hover swap
                const secondaryImage = product.images && product.images.length > 1 
                  ? product.images[1].url 
                  : null;
                
                return (
                  <Card 
                    key={product.id} 
                    className="group overflow-visible corner-ornaments transition-all duration-400 artifact-glow"
                  >
                    <CardContent className="p-0">
                      <Link href={`/merch/${product.handle}`}>
                        <div className="metal-frame">
                          <div className={`relative aspect-square bg-muted ${secondaryImage ? 'image-swap-container' : ''}`}>
                            {product.image ? (
                              <>
                                {/* Primary Image */}
                                <Image
                                  src={product.image}
                                  alt={product.title}
                                  fill
                                  className="object-cover primary-image"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                                
                                {/* Secondary Image (shows on hover if available) */}
                                {secondaryImage && (
                                  <Image
                                    src={secondaryImage}
                                    alt={`${product.title} - Detail`}
                                    fill
                                    className="object-cover secondary-image"
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
                          </p>
                        </div>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <Button variant="primary" size="lg" asChild>
                <Link href="/merch">View All Merch</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/60 mb-6">New merch drops coming soon.</p>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/merch">Browse Store</Link>
            </Button>
          </div>
        )}
      </Container>
    </Section>
  );
}

