import { NextRequest, NextResponse } from "next/server";
import { removeCartLine, getCart } from "@/lib/shopify";
import { transformShopifyCart } from "@/lib/cart-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, lineId } = body;

    if (!cartId || !lineId) {
      return NextResponse.json(
        { error: "cartId and lineId are required" },
        { status: 400 }
      );
    }

    // Remove the line and get back the updated cart directly
    const shopifyCart = await removeCartLine(cartId, lineId);

    if (!shopifyCart) {
      return NextResponse.json(
        { error: "Cart not found after removal" },
        { status: 404 }
      );
    }

    // Transform using utility function
    const cart = transformShopifyCart(shopifyCart);

    return NextResponse.json(cart);
  } catch (error: any) {
    console.error("[API /api/cart/remove] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}

