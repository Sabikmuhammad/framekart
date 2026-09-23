import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, cashfreeOrderId } = body;

    // Verify signature (if provided by Cashfree webhook)
    const signature = req.headers.get("x-webhook-signature");
    const timestamp = req.headers.get("x-webhook-timestamp");

    // Choose correct credentials based on environment
    const environment = process.env.CASHFREE_ENV || "sandbox";
    const isProd = environment === "production";
    const clientSecret = isProd 
      ? process.env.CASHFREE_CLIENT_SECRET 
      : (process.env.CASHFREE_TEST_CLIENT_SECRET || process.env.CASHFREE_CLIENT_SECRET);
      
    if (signature && timestamp) {
      const signedPayload = timestamp + JSON.stringify(body);
      const expectedSignature = crypto
        .createHmac("sha256", clientSecret!)
        .update(signedPayload)
        .digest("base64");

      if (signature !== expectedSignature) {
        return NextResponse.json(
          { success: false, error: "Invalid signature" },
          { status: 400 }
        );
      }
    }

    const clientId = isProd 
      ? process.env.CASHFREE_CLIENT_ID 
      : (process.env.CASHFREE_TEST_CLIENT_ID || process.env.CASHFREE_CLIENT_ID);

    // Fetch payment details from Cashfree
    const apiUrl = isProd
      ? "https://api.cashfree.com/pg/orders"
      : "https://sandbox.cashfree.com/pg/orders";

    const response = await fetch(`${apiUrl}/${cashfreeOrderId}/payments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": clientId!,
        "x-client-secret": clientSecret!,
        "x-api-version": "2023-08-01",
      },
    });

    const data = await response.json();

    if (response.ok && data && data.length > 0) {
      const payment = data[0];
      
      await dbConnect();

      if (payment.payment_status === "SUCCESS") {
        // Check if order is already processed
        const existingOrder = await Order.findById(orderId);
        if (existingOrder && existingOrder.paymentStatus === "completed") {
          return NextResponse.json({
            success: true,
            message: "Payment already verified",
          });
        }
        
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: "completed",
          paymentId: payment.cf_payment_id,
          cashfreeOrderId: cashfreeOrderId,
          status: "Processing",
        });

        return NextResponse.json({
          success: true,
          message: "Payment verified successfully",
        });
      } else {
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: "failed",
        });

        return NextResponse.json(
          { success: false, error: "Payment failed" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Payment not found" },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("Cashfree verification error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
