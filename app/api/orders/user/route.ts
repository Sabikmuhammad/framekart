import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    console.log("Fetching orders for userId:", userId);
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    console.log(`Found ${orders.length} orders for user ${userId}`);

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
