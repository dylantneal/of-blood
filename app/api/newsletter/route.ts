import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { RateLimiters } from "@/lib/rate-limit";
import { getWelcomeEmailHtml, getWelcomeEmailText } from "@/lib/email-templates";

/**
 * Newsletter subscription endpoint using Resend Audiences
 */
export async function POST(request: NextRequest) {
  // Rate limiting: 2 requests per minute
  const rateLimitResult = await RateLimiters.newsletter(request);
  if (rateLimitResult) return rateLimitResult;

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await request.json();
    const { email, name } = body;

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Check for required environment variables
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    const apiKey = process.env.RESEND_API_KEY;

    if (!audienceId) {
      console.error("RESEND_AUDIENCE_ID not configured");
      return NextResponse.json(
        { error: "Newsletter service not configured. Please contact support." },
        { status: 500 }
      );
    }

    if (!apiKey) {
      console.error("RESEND_API_KEY not configured");
      return NextResponse.json(
        { error: "Newsletter service not configured. Please contact support." },
        { status: 500 }
      );
    }

    // Add contact to Resend Audience using the API
    const response = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        first_name: name || "",
      }),
    });

    let responseData: any = {};
    try {
      const text = await response.text();
      if (text) {
        responseData = JSON.parse(text);
      }
    } catch (parseError) {
      console.error("Failed to parse Resend API response:", parseError);
    }

    if (!response.ok) {
      console.error("Resend API error:", {
        status: response.status,
        statusText: response.statusText,
        error: responseData,
        url: `https://api.resend.com/audiences/${audienceId}/contacts`,
      });
      
      // Handle specific error cases
      const errorMessage = responseData?.message || responseData?.error || response.statusText;
      
      // Handle restricted API key error
      if (errorMessage?.includes("restricted") || errorMessage?.includes("only send emails")) {
        console.error("Resend API key is restricted - needs full access for Audiences API");
        return NextResponse.json(
          { error: "Newsletter service configuration issue. The API key needs full access permissions." },
          { status: 500 }
        );
      }
      
      if (response.status === 409 || errorMessage?.includes("already exists") || errorMessage?.includes("duplicate")) {
        // Send welcome email even if already subscribed
        try {
          const fromEmailDomain = process.env.FROM_EMAIL_DOMAIN || "of-blood.com";
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://of-blood.com";
          await resend.emails.send({
            from: `Of Blood <hello@${fromEmailDomain}>`,
            to: email,
            subject: "Welcome to the Blood Pact",
            html: getWelcomeEmailHtml({ isResubscribe: true, siteUrl }),
            text: getWelcomeEmailText({ isResubscribe: true, siteUrl }),
          });
        } catch (emailError) {
          console.error("Failed to send confirmation email:", emailError);
        }
        
        return NextResponse.json(
          { success: true, message: "You're already subscribed!" },
          { status: 200 }
        );
      }

      if (response.status === 401 || response.status === 403) {
        console.error("Resend API authentication failed - check your API key");
        return NextResponse.json(
          { error: "Newsletter service authentication failed. Please contact support." },
          { status: 500 }
        );
      }

      if (response.status === 404) {
        console.error("Resend Audience not found - check your audience ID");
        return NextResponse.json(
          { error: "Newsletter service configuration error. Please contact support." },
          { status: 500 }
        );
      }

      if (response.status === 422) {
        console.error("Resend API validation error:", errorMessage);
        return NextResponse.json(
          { error: errorMessage || "Invalid email address. Please check and try again." },
          { status: 400 }
        );
      }

      throw new Error(errorMessage || `Failed to add contact: ${response.statusText}`);
    }

    // Send confirmation email to the subscriber
    try {
      const fromEmailDomain = process.env.FROM_EMAIL_DOMAIN || "of-blood.com";
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://of-blood.com";
      console.log(`[Newsletter] Sending confirmation email to ${email} from hello@${fromEmailDomain}`);
      
      const emailResult = await resend.emails.send({
        from: `Of Blood <hello@${fromEmailDomain}>`,
        to: email,
        subject: "Welcome to the Blood Pact",
        html: getWelcomeEmailHtml({ isResubscribe: false, siteUrl }),
        text: getWelcomeEmailText({ isResubscribe: false, siteUrl }),
      });
      
      console.log(`[Newsletter] Confirmation email sent successfully:`, emailResult);
    } catch (emailError: any) {
      // Log detailed email error but don't fail the subscription
      // The contact was already added to the audience successfully
      console.error("[Newsletter] Failed to send confirmation email:", {
        error: emailError?.message || emailError,
        name: emailError?.name,
        statusCode: emailError?.statusCode,
      });
    }

    return NextResponse.json(
      { success: true, message: "Successfully subscribed to newsletter" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    
    // Handle restricted API key error
    if (error?.message?.includes("restricted") || error?.message?.includes("only send emails")) {
      return NextResponse.json(
        { error: "Newsletter service configuration issue. The API key needs full access permissions." },
        { status: 500 }
      );
    }
    
    // Handle duplicate email gracefully
    if (error?.message?.includes("already exists")) {
      return NextResponse.json(
        { success: true, message: "You're already subscribed!" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Failed to subscribe to newsletter. Please try again later." },
      { status: 500 }
    );
  }
}

