import { NextRequest, NextResponse } from "next/server";
import { addToCart } from "@/lib/shopify";
import { transformShopifyCart } from "@/lib/cart-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, variantId, quantity } = body;

    if (!cartId || !variantId || !quantity) {
      return NextResponse.json(
        { error: "cartId, variantId, and quantity are required" },
        { status: 400 }
      );
    }

    const shopifyCart = await addToCart(cartId, variantId, quantity);
    
    // Transform using utility function
    const cart = transformShopifyCart(shopifyCart);
    
    return NextResponse.json(cart);
  } catch (error: any) {
    console.error("[API /api/cart/add] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

