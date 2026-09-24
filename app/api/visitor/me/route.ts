import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import VisitorLead from "@/models/VisitorLead";

const VISITOR_COOKIE_NAME = "framekart_visitor_token";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get(VISITOR_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return NextResponse.json({ success: true, data: null });
    }

    await dbConnect();

    const visitor = await VisitorLead.findOne({ sessionToken }).select("name phone status");

    if (!visitor) {
      return NextResponse.json({ success: true, data: null });
    }

    return NextResponse.json({
      success: true,
      data: {
        name: visitor.name || "",
        phone: visitor.phone || "",
        status: visitor.status,
      },
    });
  } catch (error: any) {
    console.error("Error in /api/visitor/me:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
