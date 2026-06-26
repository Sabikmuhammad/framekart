import { NextRequest, NextResponse } from "next/server";
import { verifyResendSignature } from "@/lib/email/resendWebhook";
import { updateCampaignStatsFromWebhook } from "@/lib/email/campaignService";

function getEventType(payload: any) {
  const rawType = String(payload?.type || payload?.event || payload?.name || "").toLowerCase();
  if (rawType.includes("delivered")) return "delivered";
  if (rawType.includes("opened")) return "opened";
  if (rawType.includes("clicked")) return "clicked";
  if (rawType.includes("bounced")) return "bounced";
  if (rawType.includes("failed")) return "failed";
  return null;
}

function getRecipientEmail(payload: any) {
  return (
    payload?.data?.to?.[0] ||
    payload?.data?.email?.to?.[0] ||
    payload?.data?.recipient ||
    payload?.email ||
    payload?.to?.[0] ||
    undefined
  );
}

function getResendId(payload: any) {
  return payload?.data?.email_id || payload?.data?.id || payload?.email_id || payload?.id;
}

function getCampaignId(payload: any) {
  return payload?.data?.tags?.campaignId || payload?.data?.headers?.["x-campaign-id"] || payload?.campaignId;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("svix-signature") || request.headers.get("resend-signature");

  if (!verifyResendSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody);
    const eventType = getEventType(payload);

    if (!eventType) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const result = await updateCampaignStatsFromWebhook({
      resendId: getResendId(payload),
      campaignId: getCampaignId(payload),
      email: getRecipientEmail(payload),
      eventType,
      occurredAt: payload?.created_at ? new Date(payload.created_at) : new Date(),
    });

    if (!result.ok) {
      return NextResponse.json({ success: true, ignored: true, message: result.message });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}
