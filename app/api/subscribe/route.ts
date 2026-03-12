import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Add contact to Brevo
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        email: email,
        listIds: [parseInt(process.env.BREVO_LIST_ID || "2")],
        updateEnabled: true, // Update if contact already exists
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Brevo error:", errorData);

      // Contact already exists is not an error for us
      if (errorData.code === "duplicate_parameter") {
        return NextResponse.json({ success: true, message: "Already subscribed!" });
      }

      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Successfully subscribed!" });
  } catch (error: any) {
    console.error("Subscribe API error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
