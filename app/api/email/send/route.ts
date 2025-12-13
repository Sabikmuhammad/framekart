import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  generateOrderConfirmationEmail,
  generateAdminOrderNotificationEmail,
} from "../../../../lib/email-templates";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

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
    // Verify environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { success: false, error: "Email service not configured" },
        { status: 500 }
      );
    }

    if (!process.env.EMAIL_FROM) {
      console.error("EMAIL_FROM is not configured");
      return NextResponse.json(
        { success: false, error: "Email sender not configured" },
        { status: 500 }
      );
    }

    const payload: OrderEmailPayload = await req.json();

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
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const results: any[] = [];

    // Send customer order confirmation email
    if (type === "order-confirmation") {
      try {
        const customerEmailResult = await resend.emails.send({
          from: process.env.EMAIL_FROM,
          to: customerEmail,
          subject: `Order Confirmation - ${orderId}`,
          html: generateOrderConfirmationEmail({
            customerName,
            orderId,
            totalAmount,
            orderItems,
            address,
          }),
        });

        console.log("Customer email sent successfully:", customerEmailResult.data?.id);
        results.push({
          type: "customer",
          success: true,
          emailId: customerEmailResult.data?.id,
        });
      } catch (error: any) {
        console.error("Failed to send customer email:", error);
        results.push({
          type: "customer",
          success: false,
          error: error.message,
        });
      }
    }

    // Send admin notification email
    if (type === "admin-notification" && process.env.ADMIN_EMAIL) {
      try {
        const adminEmailResult = await resend.emails.send({
          from: process.env.EMAIL_FROM,
          to: process.env.ADMIN_EMAIL,
          subject: `New Order Received - ${orderId}`,
          html: generateAdminOrderNotificationEmail({
            customerName,
            customerEmail,
            orderId,
            totalAmount,
            orderItems,
            address,
          }),
        });

        console.log("Admin email sent successfully:", adminEmailResult.data?.id);
        results.push({
          type: "admin",
          success: true,
          emailId: adminEmailResult.data?.id,
        });
      } catch (error: any) {
        console.error("Failed to send admin email:", error);
        results.push({
          type: "admin",
          success: false,
          error: error.message,
        });
      }
    }

    // Check if at least one email was sent successfully
    const hasSuccess = results.some((r) => r.success);
    const allSuccess = results.every((r) => r.success);

    return NextResponse.json({
      success: hasSuccess,
      allSuccess,
      results,
    });
  } catch (error: any) {
    console.error("Email API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
