import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Frame from "@/models/Frame";
import { generateSlug } from "@/lib/utils";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const body = await req.json();
    
    if (body.title) {
      body.slug = generateSlug(body.title);
    }

    const { id } = await params;
    const frame = await Frame.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const frame = await Frame.findByIdAndDelete(id);

    if (!frame) {
      return NextResponse.json(
        { success: false, error: "Frame not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
