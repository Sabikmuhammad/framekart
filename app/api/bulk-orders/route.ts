import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { BulkOrder } from "@/models/BulkOrder";
import Frame from "@/models/Frame";
import { getCurrentUser } from "@/lib/auth/authorization";
import { BulkOrderValidationSchema } from "@/lib/validation";
import { ZodError } from "zod";
import { checkRateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const userId = user?._id?.toString() || undefined;

    // Rate Limiting (10 requests per 60 minutes per IP)
    const ip = req.ip ?? req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "127.0.0.1";
    const isAllowed = await checkRateLimit(`bulk_order_${ip}`, 10, 60 * 60 * 1000);
    if (!isAllowed) {
      return NextResponse.json({ success: false, error: "Too many bulk order requests. Please try again later." }, { status: 429 });
    }

    await dbConnect();
    const body = await req.json();

    // 1. Zod Validation
    const validatedData = BulkOrderValidationSchema.parse(body);
    const { items, customer, organisation, delivery, orderType, requiredDate, specialInstructions, attachments, isQuoteRequest } = validatedData;

    // 2. Security Check: Fetch real prices from database and config
    const productIds = items.filter(i => i.type === 'PRODUCT' || i.type === 'REGULAR').map(i => i.productId);
    let dbFrames: any[] = [];
    if (productIds.length > 0) {
      dbFrames = await Frame.find({ _id: { $in: productIds } });
    }

    const { calculateBulkPricing, canDirectCheckout, CUSTOM_FRAME_PRICES } = await import("@/lib/bulk-pricing");

    const secureItems = items.map(clientItem => {
      if (clientItem.type === 'CUSTOM_PHOTO' || clientItem.type === 'CUSTOM') {
        const size = clientItem.configuration?.frameSize || 'A4';
        const price = CUSTOM_FRAME_PRICES[size] || CUSTOM_FRAME_PRICES['A4'];
        return {
          ...clientItem,
          price, // STRICTLY OVERRIDE client price for custom frame
        };
      } else {
        const dbFrame = dbFrames.find(f => f._id.toString() === clientItem.productId);
        if (!dbFrame) {
          throw new Error(`Product not found: ${clientItem.productId}`);
        }
        return {
          ...clientItem,
          price: dbFrame.price, // STRICTLY OVERRIDE client price
          title: dbFrame.title, // Enforce correct title
        };
      }
    });

    // 3. Server Authoritative Pricing Calculation
    const pricing = calculateBulkPricing(secureItems);

    // 4. Server overrides client checkout intent if needed
    // The server determines if the order is eligible for direct checkout
    const eligibleForCheckout = canDirectCheckout(pricing.totalQuantity);
    
    // If client wants direct checkout but is not eligible, force quote.
    const finalIsQuoteRequest = !eligibleForCheckout || isQuoteRequest;

    const status = finalIsQuoteRequest ? "SUBMITTED" : "DRAFT"; 

    const newOrder = await BulkOrder.create({
      userId: userId || null,
      orderType,
      customer,
      organisation,
      delivery,
      items: secureItems, // Save the secure items
      totalQuantity: pricing.totalQuantity,
      pricing: {
        subtotal: pricing.subtotal,
        bulkDiscount: pricing.bulkDiscount,
        customisationFee: pricing.customisationFee,
        shipping: pricing.shipping,
        tax: pricing.tax,
        finalTotal: pricing.finalTotal,
      },
      requiredDate,
      specialInstructions,
      attachments,
      status,
      paymentStatus: "pending",
    });

    if (finalIsQuoteRequest) {
      console.log(`Bulk Quote requested: ${newOrder.orderNumber}`);
    }

    return NextResponse.json({ success: true, data: newOrder, wasForcedToQuote: !eligibleForCheckout && !isQuoteRequest }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating bulk order:", error);
    if (error instanceof ZodError) {
      return NextResponse.json({ success: false, error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to create bulk order", details: process.env.NODE_ENV === "development" ? error.message : undefined }, { status: 500 });
  }
}

