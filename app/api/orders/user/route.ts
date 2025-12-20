import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      console.log("⚠️ No userId found in auth");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    console.log("🔍 Fetching orders for userId:", userId);
    
    // First check if any orders exist in the database
    const allOrders = await Order.find({}).limit(5);
    console.log("📊 Sample orders in database:", allOrders.map(o => ({ 
      id: o._id, 
      userId: o.userId,
      email: o.customerEmail,
      status: o.status 
    })));
    
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    console.log(`✅ Found ${orders.length} orders for user ${userId}`);

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    console.error("❌ Error fetching user orders:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
