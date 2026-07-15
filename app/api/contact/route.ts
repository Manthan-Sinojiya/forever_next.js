import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { sendEmail } from "@/lib/mailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, subject, message } = body;

    if (!fullName || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Please provide all required fields." },
        { status: 400 }
      );
    }

    await dbConnect();

    const contactMsg = await ContactMessage.create({
      fullName,
      email,
      subject,
      message,
    });

    // Send acknowledgement email to user
    const userEmailHtml = `
      <div style="font-family: system-ui, -apple-system, sans-serif; padding: 24px; color: #1A202C; background-color: #F8FAFC;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 24px; padding: 32px; border: 1px solid #EEF2F7; box-shadow: 0 4px 20px rgba(30, 90, 168, 0.05);">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; padding: 12px; background-color: #EAF8F2; border-radius: 16px;">
              <span style="font-size: 32px;">✉️</span>
            </div>
            <h2 style="color: #1E5AA8; font-size: 24px; font-weight: 800; margin: 16px 0 8px 0;">Message Received</h2>
            <p style="color: #94A3B8; font-size: 14px; margin: 0;">Thanks for reaching out to us!</p>
          </div>
          
          <p style="font-size: 15px; line-height: 1.6; color: #4A5568;">Hi <strong>${fullName}</strong>,</p>
          <p style="font-size: 15px; line-height: 1.6; color: #4A5568;">We have received your message regarding "<strong>${subject}</strong>". Our support team is reviewing it and will get back to you within 24 business hours.</p>
          
          <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 20px; border-radius: 16px; margin: 24px 0; font-size: 14px; color: #4A5568;">
            <strong>Your Message:</strong>
            <p style="font-style: italic; margin-top: 8px; color: #718096; white-space: pre-wrap;">"${message}"</p>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #EEF2F7; margin: 24px 0;" />
          <p style="font-size: 11px; color: #94A3B8; text-align: center; margin-bottom: 0; font-weight: 500;">Forever Healthcare Pvt. Ltd. | Mumbai, Maharashtra, India</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: `We received your message: ${subject}`,
      html: userEmailHtml,
    });

    return NextResponse.json({ success: true, data: contactMsg }, { status: 201 });
  } catch (error: any) {
    console.error("Contact message creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit message. Please try again." },
      { status: 500 }
    );
  }
}
