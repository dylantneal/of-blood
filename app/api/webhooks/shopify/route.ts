import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Shopify Webhook Handler (Optional - For Logging/Monitoring Only)
 * 
 * ⚠️ NOTE: This webhook is OPTIONAL when using Printful's native Shopify integration.
 * 
 * Why: Printful's Shopify app automatically receives and processes orders.
 * You don't need this webhook to fulfill orders.
 * 
 * Use cases for this webhook:
 * - Log orders for analytics
 * - Send custom notifications
 * - Trigger additional business logic
 * - Monitor order flow
 * 
 * If you don't need these features, you can leave this webhook unconfigured.
 */

function verifyShopifyWebhook(rawBody: string, hmacHeader: string | null, secret: string): boolean {
  if (!hmacHeader) {
    return false;
  }

  const hash = createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('base64');

  const hashBuffer = Buffer.from(hash);
  const hmacBuffer = Buffer.from(hmacHeader);

  if (hashBuffer.length !== hmacBuffer.length) {
    return false;
  }

  return timingSafeEqual(hashBuffer, hmacBuffer);
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const topic = request.headers.get('x-shopify-topic');
    
    // If webhook secret is not configured, just log and return success
    // This allows the endpoint to exist without requiring configuration
    const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.log(`[Shopify Webhook] Received ${topic} (verification skipped - no secret configured)`);
      return NextResponse.json({ 
        received: true,
        note: "Webhook received but not verified. Configure SHOPIFY_WEBHOOK_SECRET to enable verification."
      });
    }

    // Verify webhook signature if secret is configured
    const hmacHeader = request.headers.get('x-shopify-hmac-sha256');
    const isValid = verifyShopifyWebhook(rawBody, hmacHeader, webhookSecret);

    if (!isValid) {
      console.error("[Shopify Webhook] ❌ Invalid HMAC signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse webhook payload
    let webhook: any;
    try {
      webhook = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("[Shopify Webhook] ❌ Failed to parse payload", parseError);
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    // Log webhook for monitoring
    console.log(`[Shopify Webhook] ✅ Received ${topic}`);
    
    // Handle specific webhook types for custom logic
    switch (topic) {
      case 'orders/paid':
        console.log(`[Shopify Webhook] Order paid: #${webhook.order_number || webhook.id}`);
        console.log(`[Shopify Webhook] Customer: ${webhook.email}`);
        console.log(`[Shopify Webhook] Total: ${webhook.total_price} ${webhook.currency}`);
        console.log(`[Shopify Webhook] Items: ${webhook.line_items?.length || 0}`);
        // Note: Printful app will automatically receive this order
        // Add any custom business logic here if needed
        break;
        
      case 'orders/fulfilled':
        console.log(`[Shopify Webhook] Order fulfilled: #${webhook.order_number || webhook.id}`);
        // Add custom fulfillment logic here if needed
        break;
        
      case 'orders/cancelled':
        console.log(`[Shopify Webhook] Order cancelled: #${webhook.order_number || webhook.id}`);
        // Add cancellation handling here if needed
        break;
        
      default:
        console.log(`[Shopify Webhook] Topic: ${topic}`);
    }

    return NextResponse.json({ received: true, topic });
  } catch (error: any) {
    console.error("[Shopify Webhook] ❌ Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
