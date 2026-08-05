import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { verifyToken } from "@/lib/token";
import { trackEvent } from "@/lib/analytics";

const VALID_EVENTS = [
  "page_opened",
  "modal_displayed",
  "modal_submitted",
  "modal_cancelled",
  "returning_visit",
  "first_time_visit",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event } = body;

    if (!VALID_EVENTS.includes(event)) {
      return NextResponse.json({ success: false, error: "Invalid event type" }, { status: 400 });
    }

    const cookieStore = cookies();
    const token = cookieStore.get("framekart_custom_user")?.value;

    let visitorId: string | undefined = undefined;
    if (token) {
      const secret = process.env.CUSTOM_FRAME_COOKIE_SECRET || "default_framekart_cookie_secret_fallback_key_length_32";
      const payload = await verifyToken(token, secret);
      if (payload) {
        visitorId = payload.visitorId;
      }
    }

    const reqHeaders = headers();
    const userAgent = reqHeaders.get("user-agent") || "Unknown";
    const referrer = reqHeaders.get("referer") || "Direct";
    const ipAddress = reqHeaders.get("x-forwarded-for")?.split(",")[0] || reqHeaders.get("x-real-ip") || "127.0.0.1";

    await trackEvent({
      visitorId,
      event: event as any,
      ipAddress,
      userAgent,
      referrer,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST /api/custom-frame/track error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
