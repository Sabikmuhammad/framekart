import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/admin-api";
import dbConnect from "@/lib/db";
import CustomFrameVisitor from "@/models/CustomFrameVisitor";

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate admin user
    const { error } = await requireAdminApiUser();
    if (error) {
      return error;
    }

    // 2. Extract search query
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    // 3. Connect to Database
    await dbConnect();

    // 4. Build query
    const query: any = {};
    if (search) {
      const trimmedSearch = search.trim();
      const searchRegex = new RegExp(trimmedSearch, "i");
      query.$or = [
        { name: searchRegex },
        { phone: searchRegex },
      ];
    }

    // 5. Fetch visitors sorted by lastVisitedAt (most recent first)
    const visitors = await CustomFrameVisitor.find(query)
      .sort({ lastVisitedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: visitors,
    });
  } catch (error: any) {
    console.error("GET /api/admin/visitor-tracking error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
