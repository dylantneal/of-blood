import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createHmac, timingSafeEqual } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);
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

/**
 * Printful webhook handler for order updates
 * This is called by Printful when order status changes (shipped, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const webhookSecret = process.env.PRINTFUL_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("PRINTFUL_WEBHOOK_SECRET is not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    const signature = request.headers.get(PRINTFUL_SIGNATURE_HEADER);
    const isValid = verifyPrintfulSignature(rawBody, signature, webhookSecret);

    if (!isValid) {
      console.error("Invalid Printful signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    let webhook: any;
    try {
      webhook = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("Failed to parse Printful webhook payload", parseError);
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    const { type, data } = webhook;

    if (type === "package.shipped") {
      const order = data?.order;
      const shipment = data?.shipment;

      if (order?.recipient?.email && shipment) {
        try {
          await resend.emails.send({
            from: "Of Blood <orders@of-blood.com>",
            to: order.recipient.email,
            subject: `Your Order Has Shipped!`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff; padding: 40px;">
                <h1 style="font-family: serif; font-size: 32px; margin-bottom: 20px; text-align: center;">Your Order Has Shipped!</h1>
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                  Great news! Your order has been shipped and is on its way.
                </p>
                
                <div style="background-color: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="font-size: 20px; margin-bottom: 15px;">Shipping Information</h2>
                  <p><strong>Tracking Number:</strong> ${shipment.tracking_number}</p>
                  <p><strong>Carrier:</strong> ${shipment.carrier}</p>
                  <p><strong>Service:</strong> ${shipment.service}</p>
                  ${shipment.tracking_url ? `
                    <p style="margin-top: 15px;">
                      <a href="${shipment.tracking_url}" style="color: #B30A0A; text-decoration: none; font-weight: bold;">
                        Track Your Package →
                      </a>
                    </p>
                  ` : ''}
                </div>

                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                  You can track your package using the tracking number above. Expected delivery time varies by location.
                </p>

                <p style="font-size: 16px; line-height: 1.6; margin-top: 30px;">
                  In blood,<br>
                  <strong>Of Blood</strong>
                </p>
              </div>
            `,
          });
        } catch (emailError) {
          console.error("Failed to send shipping email:", emailError);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Printful webhook error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

