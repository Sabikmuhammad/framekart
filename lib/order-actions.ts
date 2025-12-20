"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { checkAdminAuth } from "./admin-auth";

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    // Verify admin access
    await checkAdminAuth();

    await dbConnect();
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    ).lean();

    if (!order) {
      console.error("Order not found:", orderId);
      return { success: false, error: "Order not found" };
    }

    // Trigger email notification
    await sendOrderStatusEmail(order, newStatus);

    // Revalidate admin pages
    revalidatePath("/admin/orders");
    revalidatePath("/admin");

    return { success: true, data: order };
  } catch (error: any) {
    console.error("Error updating order status:", error);
    console.error("Error details:", error?.message, error?.stack);
    return { success: false, error: error?.message || "Failed to update order" };
  }
}

export async function deleteOrder(orderId: string) {
  try {
    await checkAdminAuth();
    await dbConnect();
    
    await Order.findByIdAndDelete(orderId);

    revalidatePath("/admin/orders");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, error: "Failed to delete order" };
  }
}

export async function bulkUpdateOrderStatus(orderIds: string[], newStatus: string) {
  try {
    await checkAdminAuth();
    await dbConnect();
    
    await Order.updateMany(
      { _id: { $in: orderIds } },
      { status: newStatus }
    );

    revalidatePath("/admin/orders");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error bulk updating orders:", error);
    return { success: false, error: "Failed to update orders" };
  }
}

async function sendOrderStatusEmail(order: any, newStatus: string) {
  // Email sending logic using Resend
  try {
    const statusMessages: Record<string, string> = {
      Processing: "Your order is being processed",
      Printed: "Your order has been printed and is being prepared for shipping",
      Shipped: "Your order has been shipped",
      Delivered: "Your order has been delivered",
    };

    const message = statusMessages[newStatus] || `Your order status has been updated to ${newStatus}`;

    // Get email safely
    const customerEmail = order?.customerEmail || order?.email || 'unknown';

    // TODO: Integrate with your email service (Resend)
    console.log(`Email sent to ${customerEmail}: ${message}`);
    
    // Example Resend integration:
    // await resend.emails.send({
    //   from: 'FrameKart <orders@framekart.com>',
    //   to: order.customerEmail,
    //   subject: `Order Update: ${newStatus}`,
    //   html: `<p>${message}</p>`
    // });

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false };
  }
}
