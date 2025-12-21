import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const hasClientId = !!process.env.CASHFREE_CLIENT_ID;
    const hasClientSecret = !!process.env.CASHFREE_CLIENT_SECRET;
    const hasAppUrl = !!process.env.NEXT_PUBLIC_APP_URL;
    const environment = process.env.CASHFREE_ENV || "not set";
    const mode = process.env.NEXT_PUBLIC_CASHFREE_ENV || "not set";

    return NextResponse.json({
      configured: hasClientId && hasClientSecret,
      details: {
        CASHFREE_CLIENT_ID: hasClientId ? `Set (${process.env.CASHFREE_CLIENT_ID?.slice(0, 10)}...)` : "❌ Not set",
        CASHFREE_CLIENT_SECRET: hasClientSecret ? "✅ Set (hidden)" : "❌ Not set",
        CASHFREE_ENV: environment,
        NEXT_PUBLIC_CASHFREE_ENV: mode,
        NEXT_PUBLIC_APP_URL: hasAppUrl ? process.env.NEXT_PUBLIC_APP_URL : "❌ Not set",
      },
      message: hasClientId && hasClientSecret 
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
