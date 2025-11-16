import { NextRequest, NextResponse } from "next/server";
import { createCart, getCart } from "@/lib/shopify";
import { transformShopifyCart } from "@/lib/cart-utils";

/**
 * GET /api/cart - Get cart by ID
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cartId = searchParams.get("cartId");

    if (!cartId) {
      return NextResponse.json(
        { error: "Cart ID is required" },
        { status: 400 }
      );
    }

    // Decode the cartId in case it was URL encoded
    const decodedCartId = decodeURIComponent(cartId);
    
    const shopifyCart = await getCart(decodedCartId);
    
    if (!shopifyCart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    // Transform using utility function
    const cart = transformShopifyCart(shopifyCart);
    
    return NextResponse.json(cart);
  } catch (error: any) {
    console.error("[API /api/cart GET] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart - Create a new cart
 */
export async function POST() {
  try {
    const cart = await createCart();
    return NextResponse.json(cart);
  } catch (error: any) {
    console.error("Error creating cart:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create cart" },
      { status: 500 }
    );
  }
}

