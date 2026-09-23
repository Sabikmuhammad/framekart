import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
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
