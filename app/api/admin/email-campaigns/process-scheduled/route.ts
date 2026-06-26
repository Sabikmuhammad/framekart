import { NextRequest, NextResponse } from "next/server";
import { processScheduledCampaigns } from "@/lib/email/campaignService";
import { requireAdminApiUser } from "@/lib/admin-api";

export async function POST(_request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const providedSecret = _request.headers.get("x-cron-secret");

  if (!cronSecret || providedSecret !== cronSecret) {
    const authResult = await requireAdminApiUser();
    if ("error" in authResult) {
      return authResult.error;
    }
  }

  try {
    const results = await processScheduledCampaigns();
    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to process scheduled campaigns" },
      { status: 500 }
    );
  }
}
