import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { AnimatedBackground } from "@/components/home/animated-background";
import { AnimatedHeader } from "@/components/merch/animated-header";
import { AnimatedProductGrid } from "@/components/merch/animated-product-grid";
import { getProducts } from "@/lib/shopify";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Official Merch Store | Of Blood T-Shirts, Hoodies & Metal Apparel",
  description: "Shop official Of Blood merchandise. Premium death metal t-shirts, hoodies, vinyl, and collectibles. Limited edition cosmic death metal apparel and band merch.",
  keywords: [
    "Of Blood merch",
    "Of Blood merchandise",
    "Of Blood shirts",
    "Of Blood t-shirts",
    "Of Blood hoodie",
    "Of Blood apparel",
    "death metal merch",
    "death metal shirts",
    "black metal clothing",
    "Of Blood store",
    "Of Blood shop",
    "metal band merch"
  ],
  openGraph: {
    title: "Official Merch Store | Of Blood",
    description: "Shop official Of Blood merchandise. Premium death metal t-shirts, hoodies, vinyl, and collectibles.",
    url: "https://of-blood.com/merch",
  },
  alternates: {
    canonical: "https://of-blood.com/merch",
  },
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
    <div className="relative min-h-screen">
      {/* Full-page animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-background to-background" />
        <div className="absolute inset-0 opacity-50 mix-blend-screen">
          <AnimatedBackground />
        </div>
      </div>

      {/* Header */}
      <Section className="pt-32 pb-16 relative isolate">
        <div className="absolute inset-x-0 -top-32 blur-3xl opacity-40 pointer-events-none">
          <div className="mx-auto h-72 w-72 bg-primary/30 rounded-full" />
        </div>
        <Container size="narrow" className="relative z-10">
          <AnimatedHeader 
            title="Merch" 
            subtitle="Premium apparel and collectibles"
          />
        </Container>
      </Section>

      {/* Products Grid */}
      <Section className="!pt-8 pb-24 relative">
        <Container className="relative z-10">
          {error ? (
            <div className="p-16 border border-primary/50 bg-primary/5 rounded-lg text-center backdrop-blur-sm">
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
            <AnimatedProductGrid products={products} />
          ) : (
            <div className="p-16 border border-line bg-muted/30 rounded-lg text-center backdrop-blur-sm">
              <p className="font-display text-2xl font-semibold mb-2 text-foreground/90">
                No Products Available
              </p>
              <p className="text-foreground/70">
                Products will appear here once they&apos;re added to your Shopify store.
              </p>
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}

