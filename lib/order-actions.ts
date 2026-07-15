"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { checkAdminAuth } from "./admin-auth";
import { sendOrderStatusUpdateEmail } from "@/lib/email";

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
  return await sendOrderStatusUpdateEmail(order, newStatus);
}
