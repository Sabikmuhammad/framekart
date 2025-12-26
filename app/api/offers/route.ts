import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import OfferSetting from "@/models/OfferSetting";
import User from "@/models/User";

// GET - Fetch launch offer settings
export async function GET() {
  try {
    await connectDB();
    
    // Fetch any active offer (first one found)
    let offer = await OfferSetting.findOne().sort({ createdAt: -1 }).lean();
    
    // If no offer exists, create default one
    if (!offer) {
      offer = await OfferSetting.create({
        name: "Launch Offer",
        active: true,
        discountType: "PERCENT",
        discountValue: 15,
        maxOrdersPerUser: 3,
        minOrderValue: 0,
      });
    }

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    console.error("Error fetching offer settings:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update launch offer settings (Admin only)
export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // Check if user is admin
    const user = await User.findOne({ clerkId: userId }).lean() as any;
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, active, discountValue, maxOrdersPerUser, minOrderValue, validUntil, _id } = body;

    // Update existing offer by ID or create new one
    let offer;
    if (_id) {
      offer = await OfferSetting.findByIdAndUpdate(
        _id,
        {
          name: name || "Launch Offer",
          active: active ?? true,
          discountValue: discountValue ?? 15,
          maxOrdersPerUser: maxOrdersPerUser ?? 3,
          minOrderValue: minOrderValue ?? 0,
          ...(validUntil && { validUntil: new Date(validUntil) }),
        },
        { new: true }
      );
    } else {
      // Create new offer if none exists
      offer = await OfferSetting.create({
        name: name || "Launch Offer",
        active: active ?? true,
        discountValue: discountValue ?? 15,
        maxOrdersPerUser: maxOrdersPerUser ?? 3,
        minOrderValue: minOrderValue ?? 0,
        ...(validUntil && { validUntil: new Date(validUntil) }),
      });
    }

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    console.error("Error updating offer settings:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
