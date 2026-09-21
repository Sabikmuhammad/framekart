import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/authorization";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        phoneVerified: user.phoneVerified,
        whatsappVerified: user.whatsappVerified,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("GET /auth/me Error:", error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
