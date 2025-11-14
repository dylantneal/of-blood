import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { getProducts } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Merch",
  description: "Official Of Blood merchandise. Limited drops of occult apparel and artifacts.",
};

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
      {/* Header */}
      <Section className="pt-32 pb-16">
        <Container size="narrow" className="text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">Merch</h1>
          <p className="text-xl text-foreground/70">
            Wear the symbols. Limited drops of occult apparel and artifacts.
          </p>
        </Container>
      </Section>

      {/* Products Grid */}
      <Section>
        <Container>
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
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden hover:border-primary/50 transition-colors"
                >
                  <CardContent className="p-0">
                    <Link href={`/merch/${product.handle}`}>
                      <div className="relative aspect-square bg-muted">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gold/30 text-6xl font-display">
                            OB
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start gap-3 p-6">
                    <div className="flex-1 w-full">
                      <Link href={`/merch/${product.handle}`}>
                        <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                      <p className="text-gold font-mono">
                        {formatPrice(product.price)}
                        {product.priceMax && product.priceMax !== product.price && (
                          <span className="text-foreground/50"> - {formatPrice(product.priceMax)}</span>
                        )}
                      </p>
                    </div>
                    <Button variant="ghost" className="w-full" asChild>
                      <Link href={`/merch/${product.handle}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
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

