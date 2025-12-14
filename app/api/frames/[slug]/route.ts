import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Frame from "@/models/Frame";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();

    const { slug } = await params;
    const frame = await Frame.findOne({ slug });

    if (!frame) {
      return NextResponse.json(
        { success: false, error: "Frame not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: frame });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
