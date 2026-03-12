import { NextRequest, NextResponse } from "next/server";
import emailjs from "@emailjs/nodejs";

// Initialize EmailJS with private key (server-side)
emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY!,
  privateKey: process.env.EMAILJS_PRIVATE_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Send email via EmailJS
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      {
        name,
        email,
        message,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("EmailJS error:", error);

    // Check if it's a quota exceeded error
    if (error?.status === 429 || error?.text?.includes("limit")) {
      return NextResponse.json(
        { error: "Monthly email limit reached. Please contact us directly at contact@mdntech.org" },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
