import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/shopify";
import { ProductDetailClient } from "./product-detail-client";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.title,
    description: product.description || `Shop ${product.title} from Of Blood`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Section className="pt-32 pb-16">
        <Container>
          <ProductDetailClient product={product} />
        </Container>
      </Section>
    </>
  );
}

