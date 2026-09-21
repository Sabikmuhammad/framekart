import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import OtpVerification from "@/models/OtpVerification";
import User from "@/models/User";
import AuthAuditLog from "@/models/AuthAuditLog";
import { normalizePhoneNumber, verifyOTP } from "@/lib/auth/otp";
import { createSession } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const { phoneNumber, otp } = await req.json();

    if (!phoneNumber || !otp) {
      return NextResponse.json({ success: false, error: "Phone number and OTP are required." }, { status: 400 });
    }

    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    await dbConnect();

    // Log the verification attempt
    await AuthAuditLog.create({
      phoneNumber: normalizedPhone,
      event: "OTP_VERIFICATION_ATTEMPT",
      ipAddress: req.headers.get("x-forwarded-for") || undefined,
      userAgent: req.headers.get("user-agent") || undefined,
    });

    const otpRecord = await OtpVerification.findOne({
      phoneNumber: normalizedPhone,
      purpose: "LOGIN",
      consumedAt: { $exists: false },
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return NextResponse.json({ success: false, error: "No active OTP found. Please request a new one." }, { status: 400 });
    }

    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json({ success: false, error: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      return NextResponse.json({ success: false, error: "Maximum attempts exceeded. Please request a new OTP." }, { status: 400 });
    }

    otpRecord.attempts += 1;
    await otpRecord.save();

    const isValid = verifyOTP(otp, otpRecord.codeHash);

    if (!isValid) {
      await AuthAuditLog.create({
        phoneNumber: normalizedPhone,
        event: "OTP_FAILED",
      });
      return NextResponse.json({ success: false, error: "Invalid OTP. Please try again." }, { status: 400 });
    }

    // OTP is valid
    otpRecord.verifiedAt = new Date();
    otpRecord.consumedAt = new Date();
    await otpRecord.save();

    // Find or create the user securely without Clerk
    let user = await User.findOne({ phoneNumber: normalizedPhone });

    if (!user) {
      // For migration edge cases: Check if a user exists with this phone number somehow else or create new
      const userCount = await User.countDocuments();
      const isFirstUser = userCount === 0;
      
      user = await User.create({
        phoneNumber: normalizedPhone,
        name: "User",
        phoneVerified: true,
        whatsappVerified: true,
        role: isFirstUser ? "ADMIN" : "CUSTOMER",
        status: "ACTIVE",
      });

      await AuthAuditLog.create({
        userId: user._id.toString(),
        phoneNumber: normalizedPhone,
        event: "ACCOUNT_CREATED",
      });
    } else {
      if (user.status !== "ACTIVE") {
        return NextResponse.json({ success: false, error: "Account is suspended or deleted." }, { status: 403 });
      }
      user.phoneVerified = true;
      user.whatsappVerified = true;
      user.lastLoginAt = new Date();
      await user.save();
    }

    // Create session (sets HTTP-only cookie)
    await createSession(user._id.toString(), req);

    await AuthAuditLog.create({
      userId: user._id.toString(),
      phoneNumber: normalizedPhone,
      event: "LOGIN_SUCCESS",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        phoneNumber: user.phoneNumber,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
