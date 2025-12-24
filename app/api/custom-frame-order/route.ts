import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { 
      imageUrl, 
      frameStyle, 
      frameSize, 
      customerNotes,
      occasion,
      occasionMetadata, 
      totalAmount,
      subtotal,
      shipping,
      discount,
      address,
      customerEmail 
    } = body;

    // Validate required fields
    if (!imageUrl || !frameStyle || !frameSize || !totalAmount || !address || !customerEmail) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create custom frame order
    const order = await Order.create({
      userId,
      type: "custom",
      items: [{
        productId: null,
        title: `${occasion === "birthday" ? "Birthday" : occasion === "wedding" ? "Wedding" : "Custom"} Frame - ${frameSize} ${frameStyle}`,
        price: totalAmount,
        quantity: 1,
        imageUrl: imageUrl,
      }],
      totalAmount,
      subtotal,
      shipping,
      ...(discount && { discount }),
      address,
      customerEmail,
      paymentStatus: "pending",
      customFrame: {
        imageUrl,
        frameStyle,
        frameSize,
        customerNotes: customerNotes || "",
        occasion: occasion || "custom",
        ...(occasionMetadata && { occasionMetadata }),
      },
      status: "Pending",
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    console.error("Custom frame order error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Get all custom frame orders (Admin only)
export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const orders = await Order.find({ type: "custom" }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    console.error("Fetch custom orders error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
