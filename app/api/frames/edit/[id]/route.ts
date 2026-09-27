import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Frame from "@/models/Frame";
import { generateSlug } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth/authorization";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const body = await req.json();
    
    // Explicit allowlist to prevent mass assignment
    const {
      title,
      description,
      price,
      category,
      frame_material,
      frame_size,
      tags,
      imageUrl,
      stock,
    } = body;

    const updatePayload: any = {
      title,
      description,
      price,
      category,
      frame_material,
      frame_size,
      tags,
      imageUrl,
      stock,
    };

    // Remove undefined fields
    Object.keys(updatePayload).forEach(key => {
      if (updatePayload[key] === undefined) delete updatePayload[key];
    });

    if (title) {
      updatePayload.slug = generateSlug(title);
    }

    const { id } = await params;
    const frame = await Frame.findByIdAndUpdate(id, updatePayload, {
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
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

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
