import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/authorization";
import { revokeAllUserSessions } from "@/lib/auth/session";

export async function POST() {
  try {
    const user = await requireAuth();
    await revokeAllUserSessions(user._id.toString());
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout All Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error or unauthorized." }, { status: 500 });
  }
}
