import { NextRequest, NextResponse } from "next/server";
import {
  sendEmail,
  verifyEmailConfig,
  sendOrderConfirmationEmail,
} from "@/lib/email-service";

export const dynamic = "force-dynamic";

/**
 * Email Test & Debug Endpoint
 * Use this to verify your Resend configuration
 */
export async function GET(req: NextRequest) {
  try {
    // Check configuration
    const configCheck = verifyEmailConfig();

    console.log("🔍 Email Configuration Check:", configCheck);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      config: {
        configured: configCheck.configured,
        issues: configCheck.issues,
        env: {
          RESEND_API_KEY: process.env.RESEND_API_KEY ? "✅ Set" : "❌ Missing",
          EMAIL_FROM: process.env.EMAIL_FROM || "❌ Missing",
          ADMIN_EMAIL: process.env.ADMIN_EMAIL || "⚠️ Not set",
        },
      },
    });
  } catch (error: any) {
    console.error("❌ Email test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Send test email
 * POST with { "email": "your-email@example.com", "testType": "simple" | "order" }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, testType = "simple" } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email address required" },
        { status: 400 }
      );
    }

    console.log(`📧 Sending test email (${testType}) to:`, email);

    let result;

    if (testType === "order") {
      // Test order confirmation email
      result = await sendOrderConfirmationEmail(email, {
        customerName: "Test Customer",
        orderId: `TEST-${Date.now()}`,
        totalAmount: 2499,
        orderItems: [
          {
            title: "Elegant Wooden Frame - 8x10",
            quantity: 1,
            price: 1499,
          },
          {
            title: "Modern Metal Frame - 6x8",
            quantity: 1,
            price: 1000,
          },
        ],
        address: {
          fullName: "Test Customer",
          phone: "9876543210",
          addressLine1: "123 Test Street",
          addressLine2: "Apartment 4B",
          city: "Bangalore",
          state: "Karnataka",
          pincode: "560001",
        },
      });
    } else {
      // Simple test email
      result = await sendEmail({
        to: email,
        subject: "FrameKart Email Test - Configuration Working! ✅",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: #f3f4f6;">
              <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; margin-top: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">FrameKart</h1>
                  <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Email Configuration Test</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 40px 30px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <div style="width: 80px; height: 80px; background: #10b981; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                      <span style="font-size: 40px;">✅</span>
                    </div>
                    <h2 style="margin: 0; color: #1f2937; font-size: 24px;">Email System Working!</h2>
                  </div>
                  
                  <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
                    <p style="margin: 0; color: #374151; line-height: 1.6;">
                      <strong>✓ Resend API:</strong> Connected<br>
                      <strong>✓ Domain:</strong> framekart.co.in (Verified)<br>
                      <strong>✓ Sender:</strong> ${process.env.EMAIL_FROM}<br>
                      <strong>✓ Timestamp:</strong> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                    </p>
                  </div>
                  
                  <p style="margin: 20px 0; color: #6b7280; line-height: 1.6;">
                    Your Resend email configuration is working correctly. You can now send transactional emails from your Next.js application.
                  </p>
                  
                  <div style="margin: 30px 0; padding: 20px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0; color: #92400e; font-size: 14px;">
                      <strong>⚠️ Test Email:</strong> This is a test email from your development/production environment. If you received this, your email system is configured correctly.
                    </p>
                  </div>
                  
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="https://framekart.co.in" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                      Visit FrameKart
                    </a>
                  </div>
                </div>
                
                <!-- Footer -->
                <div style="background: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                    © ${new Date().getFullYear()} FrameKart. All rights reserved.
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    Legal Business Name: DASARABETTU ABDUL RAHIMAN
                  </p>
                  <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
                    This is an automated test email from FrameKart
                  </p>
                </div>
              </div>
            </body>
          </html>
        `,
        tags: [
          { name: "category", value: "test-email" },
          { name: "environment", value: process.env.NODE_ENV || "development" },
        ],
      });
    }

    return NextResponse.json({
      success: result.success,
      emailId: result.emailId,
      error: result.error,
      testType,
      sentTo: email,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Test email error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
