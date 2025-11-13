import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const featuredProducts = [
  {
    id: "1",
    title: "Blood Sigil T-Shirt",
    price: 2999,
    image: "/placeholder-tshirt.jpg",
  },
  {
    id: "2",
    title: "Tendrils Hoodie",
    price: 4999,
    image: "/placeholder-hoodie.jpg",
  },
  {
    id: "3",
    title: "Limited Vinyl",
    price: 3499,
    image: "/placeholder-vinyl.jpg",
  },
];

export function FeaturedMerch() {
  return (
    <Section>
      <Container>
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Merch</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Wear the symbols. Limited drops of occult apparel and artifacts.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:border-primary/50 transition-colors">
              <CardContent className="p-0">
                <div className="relative aspect-square bg-muted">
                  {/* Replace with actual product images */}
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
                  <Link href={`/merch/${product.id}`}>Shop</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="primary" size="lg" asChild>
            <Link href="/merch">View All Merch</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}

