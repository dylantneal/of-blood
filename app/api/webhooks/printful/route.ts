import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { getResendClient } from "@/lib/resend-client";

/**
 * Printful Webhook Handler
 * 
 * This webhook receives shipping notifications from Printful and sends
 * branded tracking emails to customers.
 * 
 * Setup:
 * 1. Go to Printful Dashboard → Settings → Webhooks
 * 2. Add URL: https://your-domain.com/api/webhooks/printful
 * 3. Select events: package_shipped, package_returned (optional)
 * 4. Copy webhook secret and add to .env.local as PRINTFUL_WEBHOOK_SECRET
 * 
 * Events handled:
 * - package.shipped → Send customer tracking email
 * - package.returned → Log return (optional)
 */

const PRINTFUL_SIGNATURE_HEADER = "x-printful-signature";

function safeCompareSignature(expected: string, received: string): boolean {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

function normalizeCandidate(signature: string): string[] {
  const trimmed = signature.trim();
  if (!trimmed.includes("=")) {
    return [trimmed];
  }

  const firstEquals = trimmed.indexOf("=");
  const value = trimmed.slice(firstEquals + 1);
  return [trimmed, value];
}

function verifyPrintfulSignature(rawBody: string, headerSignature: string | null, secret: string): boolean {
  if (!headerSignature) {
    return false;
  }

  const candidates = normalizeCandidate(headerSignature);
  const algorithms: Array<"sha256" | "sha1"> = ["sha256", "sha1"];

  for (const algorithm of algorithms) {
    const digestBuffer = createHmac(algorithm, secret).update(rawBody).digest();
    const digestHex = digestBuffer.toString("hex");
    const digestBase64 = digestBuffer.toString("base64");

    for (const candidate of candidates) {
      if (safeCompareSignature(digestHex, candidate) || safeCompareSignature(digestBase64, candidate)) {
        return true;
      }
    }
  }

  return false;
}

export async function POST(request: NextRequest) {
  console.log("[Printful Webhook] ========== WEBHOOK RECEIVED ==========");
  
  try {
    const rawBody = await request.text();
    const webhookSecret = process.env.PRINTFUL_WEBHOOK_SECRET;

    // Allow webhook to work without secret for initial testing
    // but log a warning
    if (!webhookSecret) {
      console.warn("[Printful Webhook] ⚠️ PRINTFUL_WEBHOOK_SECRET not configured - signature verification skipped");
      console.warn("[Printful Webhook] ⚠️ Configure this in production for security!");
    } else {
      // Verify signature if secret is configured
      const signature = request.headers.get(PRINTFUL_SIGNATURE_HEADER);
      const isValid = verifyPrintfulSignature(rawBody, signature, webhookSecret);

      if (!isValid) {
        console.error("[Printful Webhook] ❌ Invalid signature");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
      console.log("[Printful Webhook] ✅ Signature verified");
    }

    // Parse webhook payload
    let webhook: any;
    try {
      webhook = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("[Printful Webhook] ❌ Failed to parse payload", parseError);
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    const { type, data } = webhook;
    console.log(`[Printful Webhook] Event type: ${type}`);

    // Handle package shipped event
    if (type === "package_shipped" || type === "package.shipped") {
      const order = data?.order;
      const shipment = data?.shipment;

      console.log(`[Printful Webhook] Order ID: ${order?.id || 'unknown'}`);
      console.log(`[Printful Webhook] External ID: ${order?.external_id || 'none'}`);
      console.log(`[Printful Webhook] Tracking: ${shipment?.tracking_number || 'none'}`);

      if (order?.recipient?.email && shipment) {
        try {
          console.log(`[Printful Webhook] Sending tracking email to: ${order.recipient.email}`);
          
          const resend = getResendClient();
          const emailResult = await resend.emails.send({
            from: "Of Blood <orders@of-blood.com>",
            to: order.recipient.email,
            subject: `Your Order Has Shipped! 📦`,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                  
                  <!-- Header -->
                  <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="color: #B30A0A; font-size: 36px; margin: 0 0 10px 0; letter-spacing: 2px;">
                      OF BLOOD
                    </h1>
                    <div style="height: 2px; background: linear-gradient(90deg, transparent, #B30A0A, transparent); margin: 20px auto; width: 200px;"></div>
                  </div>

                  <!-- Main Content -->
                  <div style="background-color: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 40px; color: #ffffff;">
                    <h2 style="color: #B30A0A; font-size: 28px; margin: 0 0 20px 0; text-align: center;">
                      Your Order Has Shipped! 📦
                    </h2>
                    
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px; color: #cccccc;">
                      Great news! Your order has been shipped and is on its way to you.
                    </p>
                    
                    <!-- Shipping Info Box -->
                    <div style="background-color: #2a2a2a; border-left: 4px solid #B30A0A; padding: 20px; border-radius: 4px; margin-bottom: 30px;">
                      <h3 style="color: #ffffff; font-size: 18px; margin: 0 0 15px 0;">Shipping Information</h3>
                      
                      <div style="margin-bottom: 12px;">
                        <span style="color: #888888; display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Tracking Number</span>
                        <span style="color: #ffffff; font-size: 16px; font-family: 'Courier New', monospace;">${shipment.tracking_number}</span>
                      </div>
                      
                      <div style="margin-bottom: 12px;">
                        <span style="color: #888888; display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Carrier</span>
                        <span style="color: #ffffff; font-size: 16px;">${shipment.carrier}</span>
                      </div>
                      
                      <div style="margin-bottom: 20px;">
                        <span style="color: #888888; display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Service</span>
                        <span style="color: #ffffff; font-size: 16px;">${shipment.service}</span>
                      </div>
                      
                      ${shipment.tracking_url ? `
                        <div style="text-align: center; margin-top: 20px;">
                          <a href="${shipment.tracking_url}" 
                             style="display: inline-block; background-color: #B30A0A; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-weight: bold; font-size: 16px; letter-spacing: 1px;">
                            TRACK YOUR PACKAGE →
                          </a>
                        </div>
                      ` : ''}
                    </div>

                    <p style="font-size: 14px; line-height: 1.6; color: #888888; margin-bottom: 0;">
                      Expected delivery time varies by location. You can track your package using the tracking number above.
                    </p>
                  </div>

                  <!-- Footer -->
                  <div style="text-align: center; margin-top: 40px; color: #666666; font-size: 14px;">
                    <p style="margin: 0 0 10px 0;">
                      In blood,<br>
                      <strong style="color: #B30A0A;">Of Blood</strong>
                    </p>
                    <div style="height: 1px; background-color: #333; margin: 20px auto; width: 100px;"></div>
                    <p style="margin: 0; font-size: 12px;">
                      Questions? Contact us at <a href="mailto:ofbloodband@gmail.com" style="color: #B30A0A; text-decoration: none;">ofbloodband@gmail.com</a>
                    </p>
                  </div>

                </div>
              </body>
              </html>
            `,
          });

          console.log(`[Printful Webhook] ✅ Email sent successfully (ID: ${emailResult.id})`);
        } catch (emailError: any) {
          console.error("[Printful Webhook] ❌ Failed to send email:", emailError);
          // Don't fail the webhook - return success so Printful doesn't retry
        }
      } else {
        console.warn("[Printful Webhook] ⚠️ Missing email or shipment data, skipping email");
      }
    } else if (type === "package_returned" || type === "package.returned") {
      console.log("[Printful Webhook] 📮 Package returned");
      const order = data?.order;
      if (order) {
        console.log(`[Printful Webhook] Order ID: ${order.id}, External ID: ${order.external_id}`);
      }
      // Add custom return handling logic here if needed
    } else {
      console.log(`[Printful Webhook] ℹ️ Unhandled event type: ${type}`);
    }

    console.log("[Printful Webhook] ========== WEBHOOK PROCESSED ==========");
    return NextResponse.json({ received: true, type });
  } catch (error: any) {
    console.error("[Printful Webhook] ❌ Error processing webhook:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

