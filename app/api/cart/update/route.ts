import { NextRequest, NextResponse } from "next/server";
import { updateCartLine, getCart } from "@/lib/shopify";
import { transformShopifyCart } from "@/lib/cart-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, lineId, quantity } = body;

    if (!cartId || !lineId || quantity === undefined) {
      return NextResponse.json(
        { error: "cartId, lineId, and quantity are required" },
        { status: 400 }
      );
    }

    // Update the line and get back the updated cart directly
    const shopifyCart = await updateCartLine(cartId, lineId, quantity);

    if (!shopifyCart) {
      return NextResponse.json(
        { error: "Cart not found after update" },
        { status: 404 }
      );
    }

    // Transform using utility function
    const cart = transformShopifyCart(shopifyCart);

    return NextResponse.json(cart);
  } catch (error: any) {
    console.error("[API /api/cart/update] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update cart" },
      { status: 500 }
    );
  }
}

