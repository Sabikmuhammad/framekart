import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import AuthAuditLog from "@/models/AuthAuditLog";
import { checkRateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Rate Limiting (5 attempts per 15 minutes per IP)
    const ip = req.ip ?? req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "127.0.0.1";
    const isAllowed = await checkRateLimit(`login_${ip}`, 5, 15 * 60 * 1000);
    
    if (!isAllowed) {
      await dbConnect();
      await AuthAuditLog.create({
        event: "ADMIN_LOGIN_RATELIMITED",
        ipAddress: ip,
        metadata: { email }
      });
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    // Verify against environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error("❌ Admin credentials not configured in environment variables.");
      return NextResponse.json(
        { error: "Server configuration error. Contact support." },
        { status: 500 }
      );
    }

    if (email !== adminEmail || password !== adminPassword) {
      await dbConnect();
      await AuthAuditLog.create({
        event: "ADMIN_LOGIN_FAILED",
        metadata: { email, reason: "Invalid credentials" }
      });
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    // Authentication successful. Connect to DB to ensure Admin User exists.
    await dbConnect();

    // Check if an admin user with this email exists
    let adminUser = await User.findOne({ email, role: "ADMIN" });

    // If it doesn't exist, create it automatically so session works
    if (!adminUser) {
      adminUser = await User.create({
        email,
        name: "Administrator",
        role: "ADMIN",
        status: "ACTIVE",
        phoneVerified: true,
        whatsappVerified: true,
      });
      console.log("✅ Auto-created Master Admin user in database");
    }

    // Create session using existing auth architecture
    const token = await createSession(adminUser._id.toString());

    await AuthAuditLog.create({
      userId: adminUser._id.toString(),
      event: "ADMIN_LOGIN_SUCCESS",
      metadata: { email }
    });

    return NextResponse.json({
      success: true,
      message: "Admin authenticated successfully",
    });
  } catch (error: any) {
    console.error("❌ Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
