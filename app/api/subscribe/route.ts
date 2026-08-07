import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, clientIp } from "@/lib/chat/rate-limit";

// Public, unauthenticated newsletter signup. "email.includes('@')" used to be
// the entire validation and there was no limit at all, so one script could
// stuff the Brevo list with junk addresses and burn the send quota.

const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
});

const SUBSCRIBE_RULE = { limit: 5, window: 3600 };

export async function POST(request: NextRequest) {
  try {
    const parsed = subscribeSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }
    const { email } = parsed.data;

    const { allowed, retryAfter } = await checkRateLimit([
      { key: `subscribe:${clientIp(request)}`, ...SUBSCRIBE_RULE },
    ]);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many signups from this address. Try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
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
