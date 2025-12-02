import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

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

/**
 * Shopify webhook handler for order and product updates
 * This is called by Shopify when relevant events occur
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("SHOPIFY_WEBHOOK_SECRET is not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    const hmacHeader = request.headers.get('x-shopify-hmac-sha256');
    const isValid = verifyShopifyWebhook(rawBody, hmacHeader, webhookSecret);

    if (!isValid) {
      console.error("Invalid Shopify signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    let webhook: any;
    try {
      webhook = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("Failed to parse Shopify webhook payload", parseError);
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    // Get the webhook topic from headers
    const topic = request.headers.get('x-shopify-topic');
    
    // Log webhook for debugging
    console.log(`Received Shopify webhook: ${topic}`, webhook);

    // Handle different webhook types here as needed
    // For example: orders/create, products/update, etc.

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Shopify webhook error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
