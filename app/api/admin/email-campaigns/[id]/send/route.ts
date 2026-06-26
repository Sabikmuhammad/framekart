import { NextRequest, NextResponse } from "next/server";
import EmailCampaign from "@/models/EmailCampaign";
import { sendEntireCampaign } from "@/lib/email/campaignSender";
import dbConnect from "@/lib/db";
import { requireAdminApiUser } from "@/lib/admin-api";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAdminApiUser();
  if ("error" in authResult) {
    return authResult.error;
  }

  try {
    await dbConnect();
    const { id } = params;
    const campaign = await EmailCampaign.findById(id);

    if (!campaign) {
      return NextResponse.json({ success: false, error: "Campaign not found" }, { status: 404 });
    }

    const sendResult = await sendEntireCampaign(String(campaign._id));
    if (!sendResult.ok) {
      await EmailCampaign.updateOne({ _id: campaign._id }, { $set: { status: "failed" } });
      return NextResponse.json({ success: false, error: sendResult.message || "Send failed" }, { status: 400 });
    }

    await EmailCampaign.updateOne(
      { _id: campaign._id },
      { $set: { status: "sent", sentAt: new Date() } }
    );

    return NextResponse.json({ success: true, sent: sendResult.sent });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to send campaign" },
      { status: 500 }
    );
  }
}
