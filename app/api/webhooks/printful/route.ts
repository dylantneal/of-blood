import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Printful webhook handler for order updates
 * This is called by Printful when order status changes (shipped, etc.)
 * 
 * To set up:
 * 1. Go to Printful Dashboard > Settings > Webhooks
 * 2. Add webhook URL: https://your-domain.com/api/webhooks/printful
 * 3. Select events: order.updated, package.shipped
 */
export async function POST(request: NextRequest) {
  try {
    const webhook = await request.json();
    const { type, data } = webhook;

    // Handle different webhook types
    if (type === "package.shipped") {
      const order = data.order;
      const shipment = data.shipment;

      // Send shipping confirmation email
      if (order.recipient.email) {
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
      { status: 200 }
    );
  }
}

