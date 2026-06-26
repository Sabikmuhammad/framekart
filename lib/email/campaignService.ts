import dbConnect from "@/lib/db";
import EmailCampaign from "@/models/EmailCampaign";
import EmailSendLog from "@/models/EmailSendLog";
import User from "@/models/User";
import { calculateRates } from "./campaignStatus";
import { CampaignPayloadSchema } from "./campaignValidation";
import { resolveRecipients, type RecipientFilter } from "./campaignRecipients";
import { sendEntireCampaign } from "./campaignSender";
import type { z } from "zod";

export type CampaignSubmission = z.infer<typeof CampaignPayloadSchema>;

export interface CampaignRecipientRecord {
  userId?: string;
  email: string;
  name?: string;
}

export async function resolveCampaignRecipients(payload: CampaignSubmission) {
  if (payload.recipientMode === "selected") {
    const userIds = payload.recipientUserIds || [];
    if (userIds.length === 0) {
      return [] as CampaignRecipientRecord[];
    }

    const users = await User.find({ clerkId: { $in: userIds } }).lean();
    return users.map((user) => ({
      userId: user.clerkId,
      email: user.email,
      name: user.name,
    }));
  }

  if (payload.recipientMode === "filter") {
    const filter = (payload.recipientFilters || { filterType: "all" }) as RecipientFilter;
    return resolveRecipients(filter);
  }

  return resolveRecipients({ filterType: "all" });
}

export async function createCampaign(payload: CampaignSubmission, createdBy?: string) {
  await dbConnect();

  const recipients = await resolveCampaignRecipients(payload);
  if (recipients.length === 0) {
    return { ok: false, message: "No recipients found for this campaign" };
  }

  const isScheduled = payload.sendMode === "schedule";

  const campaign = await EmailCampaign.create({
    subject: payload.subject,
    previewText: payload.previewText,
    bodyHtml: payload.bodyHtml,
    couponCode: payload.couponCode,
    ctaText: payload.ctaText,
    ctaUrl: payload.ctaUrl,
    bannerImage: payload.bannerImage,
    campaignType: payload.campaignType,
    productHighlights: payload.productHighlights || [],
    recipientMode: payload.recipientMode,
    recipientUserIds: payload.recipientUserIds || [],
    recipientFilters: payload.recipientFilters,
    recipientCount: recipients.length,
    status: isScheduled ? "scheduled" : "sending",
    scheduledAt: isScheduled ? payload.scheduledAt ? new Date(payload.scheduledAt) : undefined : undefined,
    createdBy,
    stats: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      failed: 0,
      bounced: 0,
    },
  });

  await EmailSendLog.insertMany(
    recipients.map((recipient) => ({
      campaignId: String(campaign._id),
      userId: recipient.userId,
      email: recipient.email,
      name: recipient.name,
      status: "queued",
    }))
  );

  if (!isScheduled) {
    const sendResult = await sendEntireCampaign(String(campaign._id));

    if (!sendResult.ok) {
      await EmailCampaign.updateOne({ _id: campaign._id }, { $set: { status: "failed" } });
      return { ok: false, message: sendResult.message || "Failed to send campaign" };
    }

    await EmailCampaign.updateOne(
      { _id: campaign._id },
      { $set: { status: "sent", sentAt: new Date() } }
    );
  }

  return {
    ok: true,
    campaignId: String(campaign._id),
  };
}

export async function listCampaignSummaries() {
  await dbConnect();

  const campaigns = await EmailCampaign.find({}).sort({ createdAt: -1 }).lean();

  return campaigns.map((campaign) => {
    const stats = calculateRates(campaign.stats);
    return {
      ...campaign,
      stats,
      openRate: stats.openRate,
      clickRate: stats.clickRate,
    };
  });
}

export async function getCampaignById(campaignId: string) {
  await dbConnect();
  return EmailCampaign.findById(campaignId).lean();
}

export async function getCampaignLogs(campaignId: string) {
  await dbConnect();
  return EmailSendLog.find({ campaignId }).sort({ createdAt: 1 }).lean();
}

export async function processScheduledCampaigns() {
  await dbConnect();

  const dueCampaigns = await EmailCampaign.find({
    status: "scheduled",
    scheduledAt: { $lte: new Date() },
  }).lean();

  const results = [];
  for (const campaign of dueCampaigns) {
    const sendResult = await sendEntireCampaign(String(campaign._id));
    if (sendResult.ok) {
      await EmailCampaign.updateOne(
        { _id: campaign._id },
        { $set: { status: "sent", sentAt: new Date() } }
      );
    } else {
      await EmailCampaign.updateOne({ _id: campaign._id }, { $set: { status: "failed" } });
    }

    results.push({ campaignId: String(campaign._id), ...sendResult });
  }

  return results;
}

export async function updateCampaignStatsFromWebhook(options: {
  resendId?: string;
  campaignId?: string;
  email?: string;
  eventType: "delivered" | "opened" | "clicked" | "failed" | "bounced";
  occurredAt?: Date;
}) {
  await dbConnect();

  const logQuery: Record<string, unknown> = {};
  if (options.resendId) {
    logQuery.resendId = options.resendId;
  } else if (options.campaignId && options.email) {
    logQuery.campaignId = options.campaignId;
    logQuery.email = options.email;
  } else {
    return { ok: false, message: "Missing resend or campaign identifiers" };
  }

  const log = await EmailSendLog.findOne(logQuery);
  if (!log) {
    return { ok: false, message: "Delivery log not found" };
  }

  const timestamp = options.occurredAt || new Date();
  const updates: Record<string, unknown> = {
    status: options.eventType,
    lastEventAt: timestamp,
  };

  if (options.eventType === "delivered") updates.deliveredAt = timestamp;
  if (options.eventType === "opened") updates.openedAt = timestamp;
  if (options.eventType === "clicked") updates.clickedAt = timestamp;
  if (options.eventType === "failed") updates.failedAt = timestamp;
  if (options.eventType === "bounced") updates.bouncedAt = timestamp;

  await EmailSendLog.updateOne({ _id: log._id }, { $set: updates });

  const incrementMap: Record<string, Record<string, number>> = {
    delivered: { "stats.delivered": 1 },
    opened: { "stats.opened": 1 },
    clicked: { "stats.clicked": 1 },
    failed: { "stats.failed": 1 },
    bounced: { "stats.bounced": 1 },
  };

  await EmailCampaign.updateOne({ _id: log.campaignId }, { $inc: incrementMap[options.eventType] });

  return { ok: true };
}
