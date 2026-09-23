import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/admin-api";
import dbConnect from "@/lib/db";
import VisitorLead from "@/models/VisitorLead";

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAdminApiUser();
    if (error) return error;

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const filter = searchParams.get("filter"); // "all", "active", "converted", "captured"

    const query: any = {};
    
    if (search) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: searchRegex },
        { phone: searchRegex },
        { email: searchRegex },
      ];
    }

    if (filter && filter !== "all") {
      if (filter === "captured") {
        query.name = { $exists: true, $ne: null };
      } else {
        query.status = filter;
      }
    }

    const visitors = await VisitorLead.find(query)
      .sort({ lastSeenAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      success: true,
      data: visitors,
    });
  } catch (error: any) {
    console.error("GET /api/admin/visitors error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
