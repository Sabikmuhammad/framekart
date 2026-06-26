import { NextRequest, NextResponse } from "next/server";
import { getCampaignById, getCampaignLogs } from "@/lib/email/campaignService";
import { requireAdminApiUser } from "@/lib/admin-api";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAdminApiUser();
  if ("error" in authResult) {
    return authResult.error;
  }

  try {
    const { id } = params;
    const [campaign, logs] = await Promise.all([getCampaignById(id), getCampaignLogs(id)]);

    if (!campaign) {
      return NextResponse.json({ success: false, error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { campaign, logs } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load campaign" },
      { status: 500 }
    );
  }
}
