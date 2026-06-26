import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import CartSession from "@/models/CartSession";

const CartAddSchema = z.object({
  sessionId: z.string().min(1),
  email: z.string().email().optional(),
  products: z.array(
    z.object({
      productId: z.string().min(1),
      name: z.string().min(1),
      price: z.number().nonnegative(),
      quantity: z.number().int().min(1),
      image: z.string().optional(),
    })
  ),
  total: z.number().nonnegative(),
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const parsed = CartAddSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid cart payload" },
        { status: 400 }
      );
    }

    const { sessionId, email, products, total } = parsed.data;

    // Upsert the cart session on every cart change so the cron jobs can work
    // without depending on frontend state being open in the browser.
    const cartSession = await CartSession.findOneAndUpdate(
      { sessionId },
      {
        $set: {
          ...(email ? { email: email.toLowerCase() } : {}),
          products,
          total,
          orderCompleted: false,
          abandoned: false,
          recoveryEmailSent: false,
        },
        $unset: {
          abandonedAt: 1,
          completedAt: 1,
          recoveryEmailSentAt: 1,
          recoveryEmailId: 1,
          recoveryEmailLockedAt: 1,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, cartSession });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to add to cart" },
      { status: 500 }
    );
  }
}
