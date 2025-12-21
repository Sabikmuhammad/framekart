import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    console.log("🔔 Cashfree Webhook received");
    
    const body = await req.text();
    const signature = req.headers.get("x-webhook-signature");
    const timestamp = req.headers.get("x-webhook-timestamp");

    if (!signature || !timestamp) {
      console.error("❌ Missing signature or timestamp");
      return NextResponse.json(
        { success: false, error: "Missing webhook headers" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const signedPayload = timestamp + body;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.CASHFREE_CLIENT_SECRET!)
      .update(signedPayload)
      .digest("base64");

    if (signature !== expectedSignature) {
      console.error("❌ Invalid webhook signature");
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 401 }
      );
    }

    console.log("✅ Webhook signature verified");

    // Parse the webhook data
    const data = JSON.parse(body);
    console.log("📦 Webhook data:", data);

    const { type, data: eventData } = data;

    // Handle different webhook events
    if (type === "PAYMENT_SUCCESS_WEBHOOK") {
      const { order: cashfreeOrder } = eventData;
      const cashfreeOrderId = cashfreeOrder?.order_id;

      if (!cashfreeOrderId) {
        console.error("❌ No order_id in webhook data");
        return NextResponse.json(
          { success: false, error: "Missing order_id" },
          { status: 400 }
        );
      }

      await dbConnect();

      // Find order by cashfreeOrderId
      const order = await Order.findOne({ cashfreeOrderId });

      if (!order) {
        console.error("❌ Order not found for cashfreeOrderId:", cashfreeOrderId);
        return NextResponse.json(
          { success: false, error: "Order not found" },
          { status: 404 }
        );
      }

      // Get payment details
      const payment = eventData.payment;
      
      console.log("💰 Processing successful payment for order:", order._id);

      // Check if order is already processed to prevent duplicates
      if (order.paymentStatus === "completed") {
        console.log("⚠️ Order already processed, skipping update");
        return NextResponse.json({
          success: true,
          message: "Order already processed",
        });
      }

      // Update order status
      await Order.findByIdAndUpdate(order._id, {
        paymentStatus: "completed",
        paymentId: payment?.cf_payment_id,
        status: "Processing",
      });

      console.log("✅ Order updated successfully via webhook");

      // Send confirmation email (optional)
      try {
        const { sendOrderConfirmationEmail } = await import("@/lib/email");
        await sendOrderConfirmationEmail(order);
        console.log("📧 Confirmation email sent");
      } catch (emailError) {
        console.error("⚠️ Failed to send email:", emailError);
        // Don't fail the webhook if email fails
      }

      return NextResponse.json({
        success: true,
        message: "Webhook processed successfully",
      });
    } 
    
    else if (type === "PAYMENT_FAILED_WEBHOOK") {
      const { order: cashfreeOrder } = eventData;
      const cashfreeOrderId = cashfreeOrder?.order_id;

      if (cashfreeOrderId) {
        await dbConnect();
        const order = await Order.findOne({ cashfreeOrderId });

        if (order) {
          await Order.findByIdAndUpdate(order._id, {
            paymentStatus: "failed",
          });
          console.log("❌ Order marked as failed:", order._id);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Payment failed webhook processed",
      });
    }

    // Return success for other webhook types (so Cashfree doesn't retry)
    console.log("ℹ️ Unhandled webhook type:", type);
    return NextResponse.json({
      success: true,
      message: "Webhook received",
    });

  } catch (error: any) {
    console.error("💥 Webhook processing error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Cashfree expects a 200 OK response, so handle GET requests too
export async function GET() {
  return NextResponse.json({
    message: "Cashfree webhook endpoint is active",
    status: "ok",
  });
}
