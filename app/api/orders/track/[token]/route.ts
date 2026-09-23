import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import crypto from "crypto";

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const { token } = params;
    
    if (!token) {
      return NextResponse.json({ success: false, error: "Tracking token is required" }, { status: 400 });
    }

    await dbConnect();

    // Hash the provided token to look it up in the database
    const trackingTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find the order matching the hash
    // We only select the fields that are safe to expose to a guest user
    const order: any = await Order.findOne({ trackingTokenHash }).select(
      'orderNumber status paymentStatus items totalAmount subtotal shipping discount createdAt customer address.city address.state'
    ).lean();

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found or invalid token" }, { status: 404 });
    }

    // Format the response safely
    const safeOrder = {
      orderNumber: order.orderNumber || order._id, // Fallback for old orders if any
      status: order.status,
      paymentStatus: order.paymentStatus,
      items: order.items,
      totalAmount: order.totalAmount,
      subtotal: order.subtotal,
      shipping: order.shipping,
      discount: order.discount,
      createdAt: order.createdAt,
      customerName: order.customer?.name || "Customer",
      shippingLocation: `${order.address?.city || ''}, ${order.address?.state || ''}`.trim().replace(/^,|,$/g, ''),
    };

    return NextResponse.json({ success: true, data: safeOrder });
  } catch (error: any) {
    console.error("Order tracking error:", error);
    return NextResponse.json({ success: false, error: "Failed to retrieve order" }, { status: 500 });
  }
}
