import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import VisitorLead from "@/models/VisitorLead";
import { sendVisitorWelcomeMessage } from "@/lib/whatsapp/client";

const VISITOR_COOKIE_NAME = "framekart_visitor_token";
const COOKIE_MAX_AGE_DAYS = 90;

// Helper to validate and normalize Indian phone numbers
function normalizePhone(phone: string): string | null {
  const digitsOnly = phone.replace(/\D/g, "");
  // Accept 10 digit, or 12 digit starting with 91
  if (digitsOnly.length === 10) {
    return digitsOnly;
  }
  if (digitsOnly.length === 12 && digitsOnly.startsWith("91")) {
    return digitsOnly.substring(2);
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { name, phone, productViews, cartActivity, source, trigger } = await req.json();

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ success: false, error: "Invalid name" }, { status: 400 });
    }

    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) {
      return NextResponse.json({ success: false, error: "Invalid phone number" }, { status: 400 });
    }

    await dbConnect();

    const cookieStore = cookies();
    let sessionToken = cookieStore.get(VISITOR_COOKIE_NAME)?.value;

    if (!sessionToken) {
      // Issue a new secure token for this visitor
      sessionToken = crypto.randomUUID();
      cookieStore.set(VISITOR_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: COOKIE_MAX_AGE_DAYS * 24 * 60 * 60,
      });
    }

    // Check if this visitor lead already exists by session token
    let visitor = await VisitorLead.findOne({ sessionToken });

    if (!visitor) {
      // Create a brand new lead
      visitor = await VisitorLead.create({
        sessionToken,
        name: name.trim(),
        phone: normalizedPhone,
        source: source || "organic",
        trigger: trigger || "engagement",
        firstVisitedAt: new Date(),
        lastSeenAt: new Date(),
        capturedAt: new Date(),
        pagesViewed: 1, // Minimum 1 since they are here
        productViews: productViews || 0,
        cartActivity: cartActivity || false,
        status: "active",
      });
    } else {
      // Update existing lead (if they somehow submit again, or if they had an old session)
      visitor.name = name.trim();
      visitor.phone = normalizedPhone;
      visitor.capturedAt = new Date();
      visitor.lastSeenAt = new Date();
      if (productViews !== undefined) visitor.productViews = productViews;
      if (cartActivity !== undefined) visitor.cartActivity = cartActivity;
      if (trigger) visitor.trigger = trigger;
      
      await visitor.save();
    }

    // Fire and forget WhatsApp welcome message idempotently
    if (!visitor.whatsappWelcomeSent) {
      sendVisitorWelcomeMessage({
        phoneNumber: normalizedPhone,
        name: name.trim(),
      }).then(async (result) => {
        if (result.success) {
          visitor.whatsappWelcomeSent = true;
          visitor.whatsappWelcomeSentAt = new Date();
          if (result.messageId) visitor.whatsappWelcomeMessageId = result.messageId;
        } else {
          visitor.whatsappWelcomeSent = false;
          visitor.whatsappWelcomeSentAt = new Date(); // To know when the failure occurred
          visitor.whatsappWelcomeError = result.error;
        }
        await visitor.save();
      }).catch(err => {
        console.error("[WhatsApp Welcome] Async execution failed:", err);
      });
    }

    return NextResponse.json({
      success: true,
      message: "Visitor captured successfully",
    });
  } catch (error: any) {
    console.error("Error in /api/visitor/capture:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
