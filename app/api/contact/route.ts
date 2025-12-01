import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Escape HTML entities to prevent XSS attacks
 */
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, (char) => htmlEntities[char] || char);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, venue, date, message, type } = body;

    // Validate required fields
    if (!name || !email || !message || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get email configuration from environment variables
    const contactEmail = process.env.CONTACT_EMAIL || "ofbloodband@gmail.com";
    const fromEmailDomain = process.env.FROM_EMAIL_DOMAIN || "of-blood.com";

    // Sanitize all user inputs to prevent XSS
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeVenue = venue ? escapeHtml(venue) : "";
    const safeDate = date ? escapeHtml(date) : "";
    // Escape message and then convert newlines to <br> tags
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

    // Prepare email content based on inquiry type
    let subject = "";
    let htmlContent = "";

    switch (type) {
      case "booking":
        subject = `🎸 Booking Inquiry from ${safeName}`;
        htmlContent = `
          <h2>New Booking Inquiry</h2>
          <p><strong>From:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          ${safeVenue ? `<p><strong>Venue:</strong> ${safeVenue}</p>` : ""}
          ${safeDate ? `<p><strong>Preferred Date:</strong> ${safeDate}</p>` : ""}
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        `;
        break;
      case "press":
        subject = `📰 Press Inquiry from ${safeName}`;
        htmlContent = `
          <h2>New Press/Media Inquiry</h2>
          <p><strong>From:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        `;
        break;
      default:
        subject = `✉️ Contact Form: ${safeName}`;
        htmlContent = `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        `;
    }

    // Send email using Resend
    await resend.emails.send({
      from: `Of Blood Website <website@${fromEmailDomain}>`,
      to: contactEmail,
      replyTo: email,
      subject: subject,
      html: htmlContent,
    });

    // Send auto-reply to the user
    await resend.emails.send({
      from: `Of Blood <newsletter@${fromEmailDomain}>`,
      to: email,
      subject: "We received your message",
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${safeName},</p>
        <p>We've received your message and will get back to you within 48 hours.</p>
        <p>In blood,<br>Of Blood</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          This is an automated response. Please do not reply to this email.
        </p>
      `,
    });

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

