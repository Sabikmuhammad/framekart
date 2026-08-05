import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import dbConnect from "@/lib/db";
import CustomFrameVisitor from "@/models/CustomFrameVisitor";
import { VisitorSchema } from "@/lib/validation";
import { signToken } from "@/lib/token";
import { trackEvent } from "@/lib/analytics";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const result = VisitorSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0]?.message || "Invalid input data" },
        { status: 400 }
      );
    }

    const { name, phone } = result.data;

    await dbConnect();

    const reqHeaders = headers();
    const userAgent = reqHeaders.get("user-agent") || "Unknown";
    const referrer = reqHeaders.get("referer") || "Direct";
    const ipAddress = reqHeaders.get("x-forwarded-for")?.split(",")[0] || reqHeaders.get("x-real-ip") || "127.0.0.1";

    const sessionId = crypto.randomUUID();

    // Check if phone number already exists
    let visitor = await CustomFrameVisitor.findOne({ phone });
    let isReturning = false;

    if (visitor) {
      isReturning = true;
      // Update details for returning visitor
      visitor.visitCount += 1;
      visitor.lastVisitedAt = new Date();
      visitor.sessionId = sessionId;
      visitor.ipAddress = ipAddress;
      visitor.userAgent = userAgent;
      if (name) {
        visitor.name = name;
      }
      await visitor.save();
    } else {
      // Create new visitor
      const visitorId = "cfv_" + crypto.randomUUID().replace(/-/g, "");
      visitor = await CustomFrameVisitor.create({
        visitorId,
        name: name || undefined,
        phone,
        source: "custom-frame",
        firstVisitedAt: new Date(),
        lastVisitedAt: new Date(),
        visitCount: 1,
        sessionId,
        ipAddress,
        userAgent,
        referrer,
      });
    }

    // Generate signed token (JWT)
    const secret = process.env.CUSTOM_FRAME_COOKIE_SECRET || "default_framekart_cookie_secret_fallback_key_length_32";
    const validityDays = 365;
    const expirationTime = Date.now() + validityDays * 24 * 60 * 60 * 1000;

    const token = await signToken(
      {
        visitorId: visitor.visitorId,
        exp: expirationTime,
      },
      secret
    );

    // Set secure HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set({
      name: "framekart_custom_user",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: validityDays * 24 * 60 * 60, // 365 Days in seconds
      path: "/",
    });

    // Track onboarding submission events
    await trackEvent({
      visitorId: visitor.visitorId,
      event: "modal_submitted",
      sessionId,
      ipAddress,
      userAgent,
      referrer,
    });

    await trackEvent({
      visitorId: visitor.visitorId,
      event: isReturning ? "returning_visit" : "first_time_visit",
      sessionId,
      ipAddress,
      userAgent,
      referrer,
    });

    return NextResponse.json({
      success: true,
      data: {
        visitorId: visitor.visitorId,
        name: visitor.name,
      },
    });
  } catch (error: any) {
    console.error("POST /api/custom-frame/visitor error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
