import { Resend } from "resend";
import EmailCampaign from "@/models/EmailCampaign";
import EmailSendLog from "@/models/EmailSendLog";
import type { CampaignPayload } from "./campaignTemplates";
import { renderCampaignHtml } from "./campaignTemplates";

const resend = new Resend(process.env.RESEND_API_KEY);

const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || "FrameKart <orders@framekart.co.in>";
const BATCH_SIZE = Number(process.env.EMAIL_SEND_BATCH_SIZE || 50);
const BATCH_DELAY_MS = Number(process.env.EMAIL_SEND_BATCH_DELAY_MS || 250);

export async function sendCampaignBatch(campaignId: string, limit = BATCH_SIZE) {
  const campaign = await EmailCampaign.findById(campaignId).lean<any>();
  if (!campaign) {
    return { ok: false, message: "Campaign not found", sent: 0 };
  }

  const logs = await EmailSendLog.find({ campaignId, status: "queued" })
    .sort({ createdAt: 1 })
    .limit(limit)
    .lean();

  if (logs.length === 0) {
    return { ok: true, sent: 0 };
  }

  const payload: CampaignPayload = {
    subject: campaign.subject,
    previewText: campaign.previewText,
    bodyHtml: campaign.bodyHtml,
    couponCode: campaign.couponCode,
    ctaText: campaign.ctaText,
    ctaUrl: campaign.ctaUrl,
    bannerImage: campaign.bannerImage,
    campaignType: campaign.campaignType,
    productHighlights: campaign.productHighlights || [],
  };

  let sentCount = 0;

  for (const log of logs) {
    const html = renderCampaignHtml(payload, { name: log.name, email: log.email });

    await EmailSendLog.updateOne(
      { _id: log._id },
      { $set: { status: "sending", lastEventAt: new Date() } }
    );

    try {
      const result = await resend.emails.send({
        from: DEFAULT_FROM,
        to: [log.email],
        subject: payload.subject,
        html,
        tags: [
          { name: "campaignId", value: String(campaign._id) },
          { name: "campaignType", value: campaign.campaignType },
        ],
      });

      const resendId = (result as any)?.data?.id || (result as any)?.id;
      await EmailSendLog.updateOne(
        { _id: log._id },
        {
          $set: {
            status: "sent",
            resendId,
            sentAt: new Date(),
            lastEventAt: new Date(),
          },
        }
      );

      await EmailCampaign.updateOne(
        { _id: campaign._id },
        { $inc: { "stats.sent": 1 } }
      );

      sentCount += 1;
    } catch (error: any) {
      await EmailSendLog.updateOne(
        { _id: log._id },
        {
          $set: {
            status: "failed",
            error: error?.message || "Send failed",
            failedAt: new Date(),
            lastEventAt: new Date(),
          },
        }
      );

      await EmailCampaign.updateOne(
        { _id: campaign._id },
        { $inc: { "stats.failed": 1 } }
      );
    }

    if (BATCH_DELAY_MS > 0) {
      await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
    }
  }

  return { ok: true, sent: sentCount };
}

export async function sendEntireCampaign(campaignId: string) {
  let totalSent = 0;

  while (true) {
    const batchResult = await sendCampaignBatch(campaignId);
    if (!batchResult.ok) {
      return batchResult;
    }

    totalSent += batchResult.sent;

    const remaining = await EmailSendLog.countDocuments({ campaignId, status: "queued" });
    if (remaining === 0 || batchResult.sent === 0) {
      break;
    }
  }

  return { ok: true, sent: totalSent };
}
