import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Get the host dynamically from request headers
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");
    const cashfreeOrderId = searchParams.get("cf_order_id");

    if (!orderId) {
      return NextResponse.redirect(
        `${baseUrl}/checkout?error=missing_order_id`
      );
    }

    if (!cashfreeOrderId) {
      return NextResponse.redirect(
        `${baseUrl}/checkout?error=payment_failed`
      );
    }

    // Verify payment status with Cashfree
    const apiUrl = process.env.CASHFREE_ENVIRONMENT === "production"
      ? "https://api.cashfree.com/pg/orders"
      : "https://sandbox.cashfree.com/pg/orders";

    const response = await fetch(`${apiUrl}/${cashfreeOrderId}/payments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_APP_ID!,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
        "x-api-version": "2023-08-01",
      },
    });

    const data = await response.json();

    if (response.ok && data && data.length > 0) {
      const payment = data[0];
      
      if (payment.payment_status === "SUCCESS") {
        // Update order in database
        await dbConnect();
        
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: "completed",
          paymentId: payment.cf_payment_id,
          cashfreeOrderId: cashfreeOrderId,
        });

        // Redirect to success page
        return NextResponse.redirect(
          `${baseUrl}/orders/${orderId}?payment=success`
        );
      }
    }

    // Payment failed or pending
    return NextResponse.redirect(
      `${baseUrl}/checkout?error=payment_failed`
    );
  } catch (error: any) {
    console.error("Cashfree callback error:", error);
    
    // Get baseUrl for error redirect
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    
    return NextResponse.redirect(
      `${baseUrl}/checkout?error=verification_failed`
    );
  }
}
