import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Frame from "@/models/Frame";
import { generateSlug } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const frames = await Frame.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: frames });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
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

    const slug = generateSlug(title);

    const frame = await Frame.create({
      title,
      slug,
      description,
      price,
      category,
      frame_material,
      frame_size,
      tags,
      imageUrl,
      stock,
    });

    return NextResponse.json({ success: true, data: frame }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
