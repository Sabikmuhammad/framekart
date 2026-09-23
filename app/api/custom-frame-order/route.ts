import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth/authorization";
import { calculateOrderTotal } from "@/lib/launchOffer";
import { validateCustomCart } from "@/lib/cartValidation";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const userId = user?._id?.toString() || undefined;

    await dbConnect();

    const body = await req.json();
    const { 
      imageUrl, 
      frameStyle, 
      frameSize, 
      customerNotes,
      occasion,
      occasionMetadata, 
      discount,
      address,
      customerEmail,
    } = body;

    // Validate required fields
    if (!imageUrl || !frameStyle || !frameSize || !address || !customerEmail) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Securely validate custom frame price on the server
    const rawItems = [{
      productId: null,
      title: `${occasion === "birthday" ? "Birthday" : occasion === "wedding" ? "Wedding" : "Custom"} Frame - ${frameSize} ${frameStyle}`,
      quantity: 1,
      imageUrl: imageUrl,
    }];
    const { subtotal: validatedSubtotal, validatedItems } = await validateCustomCart(rawItems, frameSize);

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

    // Create custom frame order
    const order = await Order.create({
      userId: userId || null,
      orderNumber,
      trackingTokenHash,
      customer: {
        name: address.fullName,
        phone: address.phone,
        email: customerEmail,
      },
      type: "custom",
      items: validatedItems,
      totalAmount: finalAmount,
      subtotal: calculatedTotal.subtotal,
      shipping: calculatedTotal.shipping,
      ...(calculatedTotal.eligible && calculatedTotal.discount > 0 && discount && { discount }),
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

    return NextResponse.json({ success: true, data: order, trackingToken }, { status: 201 });
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
    const user = await getCurrentUser();
    const userId = user?._id.toString();

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
