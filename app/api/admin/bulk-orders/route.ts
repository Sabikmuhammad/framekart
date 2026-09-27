import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { BulkOrder } from "@/models/BulkOrder";
import { getCurrentUser } from "@/lib/auth/authorization";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const orders = await BulkOrder.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
