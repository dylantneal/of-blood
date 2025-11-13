import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Prepare email content based on inquiry type
    let subject = "";
    let htmlContent = "";

    switch (type) {
      case "booking":
        subject = `🎸 Booking Inquiry from ${name}`;
        htmlContent = `
          <h2>New Booking Inquiry</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${venue ? `<p><strong>Venue:</strong> ${venue}</p>` : ""}
          ${date ? `<p><strong>Preferred Date:</strong> ${date}</p>` : ""}
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `;
        break;
      case "press":
        subject = `📰 Press Inquiry from ${name}`;
        htmlContent = `
          <h2>New Press/Media Inquiry</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `;
        break;
      default:
        subject = `✉️ Contact Form: ${name}`;
        htmlContent = `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `;
    }

    // Send email using Resend
    await resend.emails.send({
      from: "Of Blood Website <website@of-blood.com>",
      to: "ofbloodband@gmail.com",
      reply_to: email,
      subject: subject,
      html: htmlContent,
    });

    // Send auto-reply to the user
    await resend.emails.send({
      from: "Of Blood <newsletter@of-blood.com>",
      to: email,
      subject: "We received your message",
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${name},</p>
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

