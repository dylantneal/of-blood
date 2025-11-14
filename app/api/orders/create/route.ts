import { NextRequest, NextResponse } from "next/server";
import { getCart } from "@/lib/shopify";

/**
 * Create order and get Shopify checkout URL
 * This will redirect to Shopify's secure checkout for payment processing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, shippingInfo } = body;

    if (!cartId) {
      return NextResponse.json(
        { error: "Cart ID is required" },
        { status: 400 }
      );
    }

    // Get cart from Shopify
    const cart = await getCart(cartId);

    if (!cart || !cart.checkoutUrl) {
      return NextResponse.json(
        { error: "Cart not found or invalid" },
        { status: 404 }
      );
    }

    // Return the Shopify checkout URL
    // Shopify will handle payment processing securely
    // After payment, webhook will trigger Printful sync
    return NextResponse.json({
      checkoutUrl: cart.checkoutUrl,
      cartId: cart.id,
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

