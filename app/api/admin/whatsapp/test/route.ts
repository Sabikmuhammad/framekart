import { NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/admin-api";
import { sendVisitorWelcomeMessage } from "@/lib/whatsapp/client";

// Simple rate limiting in-memory store
const recentTests = new Map<string, { count: number; firstAttempt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_TESTS_PER_WINDOW = 5;

export async function POST(req: Request) {
  try {
    const adminResult = await requireAdminApiUser();
    if (adminResult.error || !adminResult.user) {
      return adminResult.error || NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const admin = adminResult.user;

    // Rate Limiting check based on admin email
    const adminEmail = admin.email || "admin";
    const now = Date.now();
    const rateLimitRecord = recentTests.get(adminEmail) || { count: 0, firstAttempt: now };

    if (now - rateLimitRecord.firstAttempt > RATE_LIMIT_WINDOW_MS) {
      // Reset window
      recentTests.set(adminEmail, { count: 1, firstAttempt: now });
    } else {
      if (rateLimitRecord.count >= MAX_TESTS_PER_WINDOW) {
        return NextResponse.json(
          { success: false, error: "Rate limit exceeded. Please wait a minute before testing again." },
          { status: 429 }
        );
      }
      rateLimitRecord.count++;
      recentTests.set(adminEmail, rateLimitRecord);
    }

    const { name, phone } = await req.json();

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { success: false, error: "Valid WhatsApp number is required." },
        { status: 400 }
      );
    }

    const normalizedName = name || "Test User";

    const response = await sendVisitorWelcomeMessage({
      phoneNumber: phone,
      name: normalizedName,
    });

    if (!response.success) {
      return NextResponse.json(
        { success: false, errorCode: response.errorCode || "API_ERROR", errorMessage: response.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: response.messageId,
    });
  } catch (error: any) {
    console.error("[Test WhatsApp API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process test request." },
      { status: 500 }
    );
  }
}
