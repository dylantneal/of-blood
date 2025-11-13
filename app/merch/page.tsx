import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Merch",
  description: "Official Of Blood merchandise. Limited drops of occult apparel and artifacts.",
};

// Mock products - replace with Shopify integration
const products = [
  { id: "1", title: "Blood Sigil T-Shirt", price: 2999, tags: ["apparel"] },
  { id: "2", title: "Tendrils Hoodie", price: 4999, tags: ["apparel"] },
  { id: "3", title: "Limited Vinyl", price: 3499, tags: ["music"] },
  { id: "4", title: "Occult Patch Set", price: 1299, tags: ["accessories"] },
  { id: "5", title: "Crown of Thorns Cap", price: 2499, tags: ["apparel"] },
  { id: "6", title: "Blood Oath Tote", price: 1999, tags: ["accessories"] },
];

export default function MerchPage() {
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
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden hover:border-primary/50 transition-colors"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square bg-muted">
                    {/* Placeholder - replace with actual product images */}
                    <div className="absolute inset-0 flex items-center justify-center text-gold/30 text-6xl font-display">
                      OB
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-3 p-6">
                  <div className="flex-1 w-full">
                    <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-gold font-mono">
                      ${(product.price / 100).toFixed(2)}
                    </p>
                  </div>
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href={`/merch/${product.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

