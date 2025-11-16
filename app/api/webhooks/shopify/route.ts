import { NextRequest, NextResponse } from "next/server";
import { createPrintfulOrder } from "@/lib/printful";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

function verifyShopifySignature(rawBody: string, hmacHeader: string, secret: string) {
  const generatedHash = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");

  const generatedBuffer = Buffer.from(generatedHash, "base64");
  const headerBuffer = Buffer.from(hmacHeader, "base64");

  if (generatedBuffer.length !== headerBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(generatedBuffer, headerBuffer);
}

/**
 * Shopify webhook handler for order creation
 * This is called by Shopify when an order is paid
 * 
 * To set up:
 * 1. Go to Shopify Admin > Settings > Notifications > Webhooks
 * 2. Create webhook: Event = "Order payment", Format = JSON
 * 3. URL = https://your-domain.com/api/webhooks/shopify
 * 4. Add webhook secret to SHOPIFY_WEBHOOK_SECRET env variable
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    // Verify webhook signature (required for security)
    const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET;
    if (webhookSecret) {
      const hmac = request.headers.get("x-shopify-hmac-sha256");
      if (!hmac) {
        return NextResponse.json(
          { error: "Missing Shopify HMAC signature" },
          { status: 401 }
        );
      }

      const isValid = verifyShopifySignature(rawBody, hmac, webhookSecret);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid Shopify HMAC signature" },
          { status: 401 }
        );
      }
    }

    const order = JSON.parse(rawBody);

    // Only process paid orders
    if (order.financial_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    // Extract order data
    const shopifyOrderId = order.id.toString();
    const email = order.email;
    const lineItems = order.line_items || [];

    // Map Shopify line items to Printful items
    // Note: You'll need to map Shopify variant IDs to Printful variant IDs
    // This mapping should be stored in your database or product metadata
    const printfulItems = await Promise.all(
      lineItems.map(async (item: any) => {
        // Get Printful variant ID from product metadata or mapping
        // For now, we'll need to store this mapping
        // You can add a metafield to Shopify products with Printful variant ID
        const printfulVariantId = item.properties?.find(
          (p: any) => p.name === "_printful_variant_id"
        )?.value;

        if (!printfulVariantId) {
          console.warn(`No Printful variant ID found for item ${item.variant_id}`);
          return null;
        }

        return {
          variant_id: parseInt(printfulVariantId),
          quantity: item.quantity,
        };
      })
    );

    // Filter out null items
    const validItems = printfulItems.filter((item) => item !== null);

    if (validItems.length === 0) {
      console.warn("No valid Printful items found in order");
      return NextResponse.json({ received: true });
    }

    // Create shipping address for Printful
    const shippingAddress = {
      name: `${order.shipping_address.first_name} ${order.shipping_address.last_name}`,
      company: order.shipping_address.company || undefined,
      address1: order.shipping_address.address1,
      address2: order.shipping_address.address2 || undefined,
      city: order.shipping_address.city,
      state_code: order.shipping_address.province_code || undefined,
      state_name: order.shipping_address.province || undefined,
      country_code: order.shipping_address.country_code,
      zip: order.shipping_address.zip,
      phone: order.shipping_address.phone || undefined,
      email: email,
    };

    // Create order in Printful
    const printfulOrder = await createPrintfulOrder(
      shopifyOrderId,
      shippingAddress,
      validItems,
      {
        currency: order.currency,
        subtotal: order.subtotal_price,
        shipping: order.shipping_price,
        tax: order.total_tax,
      }
    );

    // Send order confirmation email
    try {
      await resend.emails.send({
        from: "Of Blood <orders@of-blood.com>",
        to: email,
        subject: `Order Confirmation #${order.order_number}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff; padding: 40px;">
            <h1 style="font-family: serif; font-size: 32px; margin-bottom: 20px; text-align: center;">Order Confirmed</h1>
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Thank you for your order! Your order #${order.order_number} has been confirmed.
            </p>
            
            <div style="background-color: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="font-size: 20px; margin-bottom: 15px;">Order Details</h2>
              <p><strong>Order Number:</strong> #${order.order_number}</p>
              <p><strong>Total:</strong> ${order.currency} ${order.total_price}</p>
              <p><strong>Shipping Address:</strong></p>
              <p style="margin-left: 20px;">
                ${order.shipping_address.first_name} ${order.shipping_address.last_name}<br>
                ${order.shipping_address.address1}<br>
                ${order.shipping_address.address2 ? order.shipping_address.address2 + '<br>' : ''}
                ${order.shipping_address.city}, ${order.shipping_address.province} ${order.shipping_address.zip}<br>
                ${order.shipping_address.country}
              </p>
            </div>

            <div style="background-color: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="font-size: 20px; margin-bottom: 15px;">Items</h2>
              ${lineItems.map((item: any) => `
                <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #333;">
                  <p><strong>${item.title}</strong> × ${item.quantity}</p>
                  <p style="color: #999;">${item.currency} ${item.price}</p>
                </div>
              `).join('')}
            </div>

            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Your order is being processed and will ship soon. You'll receive a shipping confirmation email with tracking information once your order ships.
            </p>

            <p style="font-size: 16px; line-height: 1.6; margin-top: 30px;">
              In blood,<br>
              <strong>Of Blood</strong>
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    return NextResponse.json({
      received: true,
      printfulOrderId: printfulOrder.id,
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    // Return 200 to prevent Shopify from retrying
    // Log error for manual processing
    return NextResponse.json(
      { error: error.message },
      { status: 200 }
    );
  }
}

