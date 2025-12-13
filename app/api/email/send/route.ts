import { NextRequest, NextResponse } from "next/server";
import {
  sendOrderConfirmationEmail,
  sendAdminNotificationEmail,
  verifyEmailConfig,
} from "@/lib/email-service";

export const dynamic = "force-dynamic";

interface OrderEmailPayload {
  type: "order-confirmation" | "admin-notification";
  customerEmail: string;
  customerName: string;
  orderId: string;
  totalAmount: number;
  orderItems?: Array<{
    title: string;
    quantity: number;
    price: number;
    imageUrl?: string;
  }>;
  address?: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    // Verify configuration first
    const configCheck = verifyEmailConfig();
    if (!configCheck.configured) {
      console.error("❌ Email configuration issues:", configCheck.issues);
      return NextResponse.json(
        {
          success: false,
          error: "Email service not properly configured",
          issues: configCheck.issues,
        },
        { status: 500 }
      );
    }

    const payload: OrderEmailPayload = await req.json();

    console.log("📧 Email API received request:", {
      type: payload.type,
      customerEmail: payload.customerEmail,
      orderId: payload.orderId,
      timestamp: new Date().toISOString(),
    });

    const {
      type,
      customerEmail,
      customerName,
      orderId,
      totalAmount,
      orderItems = [],
      address,
    } = payload;

    // Validate required fields
    if (!type || !customerEmail || !customerName || !orderId || !totalAmount) {
      console.error("❌ Missing required fields:", {
        type,
        customerEmail,
        customerName,
        orderId,
        totalAmount,
      });
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const results: any[] = [];

    // Send customer order confirmation email
    if (type === "order-confirmation") {
      console.log("📨 Sending customer order confirmation...");
      const customerResult = await sendOrderConfirmationEmail(customerEmail, {
        customerName,
        orderId,
        totalAmount,
        orderItems,
        address: address || {
          fullName: customerName,
          phone: "",
          addressLine1: "",
          city: "",
          state: "",
          pincode: "",
        },
      });

      results.push({
        type: "customer",
        success: customerResult.success,
        emailId: customerResult.emailId,
        error: customerResult.error,
      });

      if (customerResult.success) {
        console.log("✅ Customer email sent:", customerResult.emailId);
      } else {
        console.error("❌ Customer email failed:", customerResult.error);
      }
    }

    // Send admin notification email
    if (type === "admin-notification") {
      console.log("📨 Sending admin notification...");
      const adminResult = await sendAdminNotificationEmail({
        customerName,
        customerEmail,
        orderId,
        totalAmount,
        orderItems,
        address: address || {
          fullName: customerName,
          phone: "",
          addressLine1: "",
          city: "",
          state: "",
          pincode: "",
        },
      });

      results.push({
        type: "admin",
        success: adminResult.success,
        emailId: adminResult.emailId,
        error: adminResult.error,
      });

      if (adminResult.success) {
        console.log("✅ Admin email sent:", adminResult.emailId);
      } else {
        console.error("❌ Admin email failed:", adminResult.error);
      }
    }

    // Check if at least one email was sent successfully
    const hasSuccess = results.some((r) => r.success);
    const allSuccess = results.every((r) => r.success);

    return NextResponse.json({
      success: hasSuccess,
      allSuccess,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Email API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
