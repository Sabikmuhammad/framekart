import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const {
      customerEmail,
      occasion,
      templateImage,
      uploadedPhoto,
      frameStyle,
      metadata,
      price,
      totalAmount,
      subtotal,
      shipping,
      discount,
      address,
    } = body;

    // Validate required fields
    if (!occasion || !templateImage || !metadata || !address || !customerEmail) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate occasion-specific metadata
    if (occasion === "birthday") {
      if (!metadata.name || !metadata.age || !metadata.date) {
        return NextResponse.json(
          { success: false, error: "Birthday details (name, age, date) are required" },
          { status: 400 }
        );
      }
    } else if (occasion === "wedding") {
      if (!metadata.brideName || !metadata.groomName || !metadata.weddingDate) {
        return NextResponse.json(
          { success: false, error: "Wedding details (bride name, groom name, date) are required" },
          { status: 400 }
        );
      }
    }

    // Create order in database
    const order = await Order.create({
      userId,
      customerEmail,
      items: [
        {
          productId: null,
          title: `${occasion === "birthday" ? "Birthday" : "Wedding"} Frame - A4`,
          price: price,
          quantity: 1,
          imageUrl: templateImage,
        },
      ],
      totalAmount,
      paymentStatus: "pending",
      address,
      productType: "TEMPLATE",
      templateFrame: {
        occasion,
        templateImage,
        uploadedPhoto: uploadedPhoto || undefined,
        frameSize: "A4",
        frameStyle: frameStyle || "Black",
        metadata,
        designStatus: "PENDING",
      },
      subtotal,
      shipping,
      ...(discount && { discount }),
      status: "Pending",
    });

    return NextResponse.json({
      success: true,
      data: order,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Template order creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

// Get all template orders (Admin only)
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

    const orders = await Order.find({ productType: "TEMPLATE" }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    console.error("Fetch template orders error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
