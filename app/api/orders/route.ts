import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { OrderSchema } from "@/lib/validation";
import { ZodError } from "zod";

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

    // Check if user is admin
    const user = await User.findOne({ clerkId: userId });
    
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    // Fetch all orders for admin
    const orders = await Order.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();
    
    // Validate input
    const validatedData = OrderSchema.parse(body);
    const { items, totalAmount, address, customerEmail } = validatedData;

    const order = await Order.create({
      userId,
      items,
      totalAmount,
      address,
      customerEmail,
      paymentStatus: "pending",
      status: "Pending",
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Order creation error:', error);
    }
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid input data",
          validationErrors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create order",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
