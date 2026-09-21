import { NextResponse } from "next/server";
import { revokeSession } from "@/lib/auth/session";

export async function POST() {
  try {
    await revokeSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
