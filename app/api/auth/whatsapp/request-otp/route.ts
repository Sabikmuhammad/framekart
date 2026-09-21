import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import OtpVerification from "@/models/OtpVerification";
import { generateOTP, hashOTP, isValidIndianPhoneNumber, normalizePhoneNumber } from "@/lib/auth/otp";
import { sendWhatsAppOtp } from "@/lib/whatsapp/client";

export async function POST(req: Request) {
  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json({ success: false, error: "Phone number is required." }, { status: 400 });
    }

    const normalizedPhone = normalizePhoneNumber(phoneNumber);

    if (!isValidIndianPhoneNumber(normalizedPhone)) {
      return NextResponse.json({ success: false, error: "Invalid Indian phone number." }, { status: 400 });
    }

    await dbConnect();

    // Check rate limit and cooldown
    const existingOtp = await OtpVerification.findOne({
      phoneNumber: normalizedPhone,
      purpose: "LOGIN",
      consumedAt: { $exists: false },
    }).sort({ createdAt: -1 });

    if (existingOtp) {
      const now = new Date();
      const timeSinceLastSent = now.getTime() - existingOtp.lastSentAt.getTime();
      const cooldownMs = 60 * 1000; // 60 seconds

      if (timeSinceLastSent < cooldownMs) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Please wait ${Math.ceil((cooldownMs - timeSinceLastSent) / 1000)}s before requesting a new OTP.` 
          },
          { status: 429 }
        );
      }

      if (existingOtp.resendCount >= 5) {
         return NextResponse.json(
          { success: false, error: "Maximum OTP attempts reached. Please try again later." },
          { status: 429 }
        );
      }
    }

    // Generate new OTP
    const otp = generateOTP();
    const codeHash = hashOTP(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store in database
    if (existingOtp) {
      // Invalidate old OTP
      existingOtp.consumedAt = new Date();
      await existingOtp.save();
    }

    await OtpVerification.create({
      phoneNumber: normalizedPhone,
      codeHash,
      purpose: "LOGIN",
      expiresAt,
      attempts: 0,
      maxAttempts: 5,
      resendCount: existingOtp ? existingOtp.resendCount + 1 : 0,
    });

    // Send via WhatsApp
    const result = await sendWhatsAppOtp({
      phoneNumber: normalizedPhone,
      otp,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Failed to send WhatsApp OTP. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      expiresIn: 300,
      resendAfter: 60,
    });
  } catch (error) {
    console.error("Request OTP Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
