import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const hasAppId = !!process.env.CASHFREE_APP_ID;
    const hasSecretKey = !!process.env.CASHFREE_SECRET_KEY;
    const hasAppUrl = !!process.env.NEXT_PUBLIC_APP_URL;
    const environment = process.env.CASHFREE_ENVIRONMENT || "not set";
    const mode = process.env.NEXT_PUBLIC_CASHFREE_MODE || "not set";

    return NextResponse.json({
      configured: hasAppId && hasSecretKey,
      details: {
        CASHFREE_APP_ID: hasAppId ? `Set (${process.env.CASHFREE_APP_ID?.slice(0, 10)}...)` : "❌ Not set",
        CASHFREE_SECRET_KEY: hasSecretKey ? "✅ Set (hidden)" : "❌ Not set",
        CASHFREE_ENVIRONMENT: environment,
        NEXT_PUBLIC_CASHFREE_MODE: mode,
        NEXT_PUBLIC_APP_URL: hasAppUrl ? process.env.NEXT_PUBLIC_APP_URL : "❌ Not set",
      },
      message: hasAppId && hasSecretKey 
        ? "✅ Cashfree is configured correctly" 
        : "❌ Please configure Cashfree environment variables in .env.local"
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
