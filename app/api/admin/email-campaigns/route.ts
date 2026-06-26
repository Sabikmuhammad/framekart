import { NextRequest, NextResponse } from "next/server";
import { CampaignPayloadSchema } from "@/lib/email/campaignValidation";
import { createCampaign, listCampaignSummaries } from "@/lib/email/campaignService";
import { requireAdminApiUser } from "@/lib/admin-api";

export async function GET() {
  const authResult = await requireAdminApiUser();
  if ("error" in authResult) {
    return authResult.error;
  }

  try {
    const campaigns = await listCampaignSummaries();
    return NextResponse.json({ success: true, data: campaigns });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to load campaigns" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminApiUser();
  if ("error" in authResult) {
    return authResult.error;
  }

  try {
    const body = await request.json();
    const payload = CampaignPayloadSchema.parse(body);

    if (payload.sendMode === "schedule" && !payload.scheduledAt) {
      return NextResponse.json(
        { success: false, error: "Please choose a scheduled date and time" },
        { status: 400 }
      );
    }

    const result = await createCampaign(payload, authResult.user.clerkId);

    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, campaignId: result.campaignId });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create campaign" },
      { status: 500 }
    );
  }
}
