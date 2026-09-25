import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/admin-api";
import dbConnect from "@/lib/db";
import VisitorLead from "@/models/VisitorLead";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdminApiUser();
    if (authResult.error) {
      return authResult.error;
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search") || "";

    await dbConnect();

    // Build query
    const query: any = { phone: { $exists: true, $ne: null } }; // Only those with a phone number

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: searchRegex },
        { phone: searchRegex },
        { email: searchRegex },
      ];
    }

    if (status === "sent") {
      query.$or = [{ whatsappDeliveryStatus: { $in: ["SENT", "DELIVERED", "READ"] } }, { whatsappWelcomeSent: true, whatsappDeliveryStatus: { $exists: false } }];
    } else if (status === "delivered") {
      query.whatsappDeliveryStatus = { $in: ["DELIVERED", "READ"] };
    } else if (status === "read") {
      query.whatsappDeliveryStatus = "READ";
    } else if (status === "failed") {
      query.$or = [{ whatsappDeliveryStatus: "FAILED" }, { whatsappWelcomeSent: false, whatsappWelcomeError: { $exists: true, $ne: null } }];
    } else if (status === "pending") {
      query.$or = [{ whatsappDeliveryStatus: "PENDING" }, { whatsappWelcomeSent: { $ne: true }, whatsappWelcomeError: { $exists: false } }];
    }

    const skip = (page - 1) * limit;

    const [total, messages] = await Promise.all([
      VisitorLead.countDocuments(query),
      VisitorLead.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-sessionToken -__v") // Exclude sensitive fields
        .lean(),
    ]);

    // Fetch AI conversations for the returned leads
    const { default: WhatsAppConversation } = await import("@/models/WhatsAppConversation");
    const phones = messages.map((m: any) => m.phone).filter(Boolean);
    const conversations = await WhatsAppConversation.find({ phone: { $in: phones } }).lean();
    
    const messagesWithConversations = messages.map((msg: any) => {
      const convo = conversations.find((c: any) => c.phone === msg.phone);
      if (convo) {
        msg.aiConversation = convo;
      }
      return msg;
    });

    // Aggregate summary stats
    const [totalStats, sentStats, deliveredStats, readStats, failedStats] = await Promise.all([
      VisitorLead.countDocuments({ phone: { $exists: true, $ne: null } }),
      VisitorLead.countDocuments({ phone: { $exists: true, $ne: null }, $or: [{ whatsappDeliveryStatus: { $in: ["SENT", "DELIVERED", "READ"] } }, { whatsappWelcomeSent: true, whatsappDeliveryStatus: { $exists: false } }] }),
      VisitorLead.countDocuments({ phone: { $exists: true, $ne: null }, whatsappDeliveryStatus: { $in: ["DELIVERED", "READ"] } }),
      VisitorLead.countDocuments({ phone: { $exists: true, $ne: null }, whatsappDeliveryStatus: "READ" }),
      VisitorLead.countDocuments({ phone: { $exists: true, $ne: null }, $or: [{ whatsappDeliveryStatus: "FAILED" }, { whatsappWelcomeSent: false, whatsappWelcomeError: { $exists: true, $ne: null } }] })
    ]);
    const pendingStats = totalStats - sentStats - failedStats;

    return NextResponse.json({
      success: true,
      messages: messagesWithConversations,
      summary: {
        total: totalStats,
        sent: sentStats,
        delivered: deliveredStats,
        read: readStats,
        failed: failedStats,
        pending: pendingStats,
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error in /api/admin/whatsapp/messages:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
