import { NextResponse } from "next/server";
import { markAbandonedCarts } from "@/lib/cart/recovery";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const modifiedCount = await markAbandonedCarts();

    return NextResponse.json({
      success: true,
      message: `Marked ${modifiedCount} carts as abandoned`,
      modifiedCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to check abandoned carts" },
      { status: 500 }
    );
  }
}
