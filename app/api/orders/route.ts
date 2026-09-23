import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth/authorization";
import { OrderSchema } from "@/lib/validation";
import { ZodError } from "zod";
import { calculateOrderTotal } from "@/lib/launchOffer";
import { validateCartItems } from "@/lib/cartValidation";
import crypto from "crypto";

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

    // Check if user is admin
    const dbUser = await User.findById(userId);
    
    if (!dbUser || dbUser.role !== "admin") {
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
    const user = await getCurrentUser();
    const userId = user?._id?.toString() || undefined;

    await dbConnect();

    const body = await req.json();
    
    // Validate input
    const validatedData = OrderSchema.parse(body);
    const { items: clientItems, address, customerEmail, discount } = validatedData;

    // Securely validate items and calculate true subtotal on the server
    const { subtotal: validatedSubtotal, validatedItems } = await validateCartItems(clientItems);

    // Calculate order total server-side with eligibility check
    const calculatedTotal = await calculateOrderTotal(
      validatedSubtotal,
      userId,
      false // userId, not email
    );

    // Use server-calculated total, not frontend total
    const finalAmount = calculatedTotal.total;

    // Generate tracking token
    const trackingToken = crypto.randomBytes(32).toString('hex');
    const trackingTokenHash = crypto.createHash('sha256').update(trackingToken).digest('hex');

    // Generate human readable order number
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const randomStr = crypto.randomBytes(2).toString('hex').toUpperCase();
    const orderNumber = `FK-${dateStr}-${randomStr}`;

    const order = await Order.create({
      userId: userId || null,
      orderNumber,
      trackingTokenHash,
      customer: {
        name: address.fullName,
        phone: address.phone,
        email: customerEmail,
      },
      items: validatedItems,
      totalAmount: finalAmount,
      subtotal: calculatedTotal.subtotal,
      shipping: calculatedTotal.shipping,
      ...(calculatedTotal.eligible && calculatedTotal.discount > 0 && discount && {
        discount,
      }),
      address,
      customerEmail, // Keeping for backward compatibility
      paymentStatus: "pending",
      status: "Pending",
    });

    return NextResponse.json({ success: true, data: order, trackingToken }, { status: 201 });
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
