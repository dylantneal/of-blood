import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { AnimatedBackground } from "@/components/home/animated-background";
import { getProducts } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Merch",
  description: "Premium apparel and collectibles for metalheads. Official Of Blood merchandise.",
};

// Revalidate this page every 60 seconds to show new products
export const revalidate = 60;

export default async function MerchPage() {
  let products: Product[] = [];
  let error: string | null = null;

  try {
    products = await getProducts(50);
  } catch (err: any) {
    console.error('Error loading products:', err);
    error = err.message || 'Failed to load products';
    products = [];
  }

  return (
    <>
      {/* Header - Clean & Premium */}
      <Section className="pt-32 pb-16 relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-background to-black" />
        <div className="absolute inset-0 opacity-70 mix-blend-screen pointer-events-none">
          <AnimatedBackground />
        </div>
        <div className="absolute inset-x-0 -top-32 blur-3xl opacity-40 pointer-events-none">
          <div className="mx-auto h-72 w-72 bg-primary/30 rounded-full" />
        </div>
        <Container size="narrow" className="text-center relative z-10">
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            Merch
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/60 max-w-xl mx-auto leading-relaxed font-light">
            Premium apparel and collectibles for metalheads.
          </p>
        </Container>
      </Section>

      {/* Products Grid */}
      <Section className="!pt-8 pb-24 relative">
        <Container className="relative z-10">
          {error ? (
            <div className="p-16 border border-primary/50 bg-primary/5 rounded-lg text-center">
              <p className="font-display text-2xl font-semibold mb-4 text-primary">
                Configuration Error
              </p>
              <p className="text-foreground/70 mb-4 whitespace-pre-line">
                {error}
              </p>
              <div className="text-sm text-foreground/60 space-y-2 mt-6">
                <p>To fix this, please:</p>
                <ol className="list-decimal list-inside space-y-1 text-left max-w-md mx-auto">
                  <li>Create a <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> file in the root directory</li>
                  <li>Add your Shopify credentials:
                    <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-x-auto">
{`NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token`}
                    </pre>
                  </li>
                  <li>Restart your development server</li>
                </ol>
              </div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                // Get secondary image for hover swap (prefer 2nd image, fallback to 1st)
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
                        {product.priceMax && product.priceMax !== product.price && (
                            <span className="text-foreground/40 ml-1">- {formatPrice(product.priceMax)}</span>
                        )}
                      </p>
                    </div>
                    </Link>
                  </CardFooter>
                </Card>
                );
              })}
            </div>
          ) : (
            <div className="p-16 border border-line bg-muted/30 rounded-lg text-center">
              <p className="font-display text-2xl font-semibold mb-2 text-foreground/90">
                No Products Available
              </p>
              <p className="text-foreground/70">
                Products will appear here once they're added to your Shopify store.
              </p>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}

