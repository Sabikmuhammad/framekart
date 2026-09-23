import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/authorization";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { calculateOrderTotal } from "@/lib/launchOffer";
import { validateCustomCart } from "@/lib/cartValidation";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const userId = user?._id?.toString() || undefined;

    await dbConnect();

    const body = await request.json();
    const {
      customerEmail,
      occasion,
      templateImage,
      uploadedPhoto,
      frameStyle,
      metadata,
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

    // Securely validate template frame price on the server
    const rawItems = [{
      productId: null,
      title: `${occasion === "birthday" ? "Birthday" : "Wedding"} Frame - A4`,
      quantity: 1,
      imageUrl: templateImage,
    }];
    const { subtotal: validatedSubtotal, validatedItems } = await validateCustomCart(rawItems, "A4");

    // Calculate order total server-side
    const calculatedTotal = await calculateOrderTotal(
      validatedSubtotal,
      userId,
      false
    );
    const finalAmount = calculatedTotal.total;

    // Generate tracking token
    const trackingToken = crypto.randomBytes(32).toString('hex');
    const trackingTokenHash = crypto.createHash('sha256').update(trackingToken).digest('hex');

    // Generate human readable order number
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const randomStr = crypto.randomBytes(2).toString('hex').toUpperCase();
    const orderNumber = `FK-${dateStr}-${randomStr}`;

    // Create order in database
    const order = await Order.create({
      userId: userId || null,
      orderNumber,
      trackingTokenHash,
      customer: {
        name: address.fullName,
        phone: address.phone,
        email: customerEmail,
      },
      customerEmail, // Keeping for backward compatibility
      items: validatedItems,
      totalAmount: finalAmount,
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
      subtotal: calculatedTotal.subtotal,
      shipping: calculatedTotal.shipping,
      ...(calculatedTotal.eligible && calculatedTotal.discount > 0 && discount && { discount }),
      status: "Pending",
    });

    return NextResponse.json({
      success: true,
      data: order,
      trackingToken,
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
    const user = await getCurrentUser();
    const userId = user?._id.toString();
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
