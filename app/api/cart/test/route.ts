import { NextResponse } from "next/server";
import { createCart, addToCart, getCart } from "@/lib/shopify";

/**
 * Test endpoint to diagnose cart issues
 * Visit: /api/cart/test to see if Shopify integration is working
 */
export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: {},
    success: false,
  };

  try {
    // Test 1: Check environment variables
    results.tests.environmentVariables = {
      domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ? '✅ Set' : '❌ Missing',
      token: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ? '✅ Set' : '❌ Missing',
    };

    // Test 2: Create a cart
    console.log('[Cart Test] Creating cart...');
    const newCart = await createCart();
    results.tests.createCart = {
      success: !!newCart,
      cartId: newCart?.id || 'Failed',
      checkoutUrl: newCart?.checkoutUrl || 'Failed',
    };

    if (!newCart || !newCart.id) {
      throw new Error('Failed to create cart');
    }

    // Test 3: Get the cart we just created
    console.log('[Cart Test] Getting cart...');
    const retrievedCart = await getCart(newCart.id);
    results.tests.getCart = {
      success: !!retrievedCart,
      hasLines: !!retrievedCart?.lines,
      linesStructure: retrievedCart?.lines ? Object.keys(retrievedCart.lines) : [],
    };

    // Test 4: Get products to find a variant ID
    console.log('[Cart Test] Note: To test adding items, add a product to your Shopify store first');
    
    results.success = true;
    results.message = '✅ Cart system is working! Now try adding a real product from your Shopify store.';

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    results.success = false;
    results.error = error.message;
    results.stack = error.stack;
    
    console.error('[Cart Test] Error:', error);
    
    return NextResponse.json(results, { status: 500 });
  }
}

