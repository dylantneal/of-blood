import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProduct } from "@/lib/shopify";
import { ProductDetailClient } from "./product-detail-client";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

function RitualDivider() {
  return (
    <div className="ritual-divider my-12">
      <div className="relative w-10 h-10 flex-shrink-0">
        <Image
          src="/images/logos/OfBloodSymbol.png"
          alt=""
          fill
          className="object-contain opacity-50 drop-shadow-[0_0_12px_rgba(179,10,10,0.3)]"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

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
    <div className="relative blood-spatter star-field min-h-screen overflow-visible">
      <div className="pt-24 pb-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto overflow-visible">
        <ProductDetailClient product={product} />
      </div>
    </div>
  );
}

