import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import Address from "@/models/Address";

// GET all addresses for the logged-in user
export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: addresses,
    });
  } catch (error: any) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create a new address
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fullName, phone, addressLine1, addressLine2, landmark, city, state, pincode, isDefault } = body;

    // Validate required fields
    if (!fullName || !phone || !addressLine1 || !addressLine2 || !city || !state || !pincode) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    const address = await Address.create({
      userId,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      pincode,
      isDefault: isDefault || false,
    });

    return NextResponse.json({
      success: true,
      data: address,
    });
  } catch (error: any) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
