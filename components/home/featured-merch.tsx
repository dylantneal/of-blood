import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { AnimatedProductGridInView } from "@/components/merch/animated-product-grid-inview";
import { getProducts } from "@/lib/shopify";
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
            Premium apparel and collectibles.
          </p>
        </div>

        {products.length > 0 ? (
          <>
            <AnimatedProductGridInView products={products} />

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

