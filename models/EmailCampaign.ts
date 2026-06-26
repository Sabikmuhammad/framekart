import { Schema, model, models } from "mongoose";

export type CampaignStatus = "draft" | "scheduled" | "sending" | "sent" | "failed";
export type CampaignRecipientMode = "all" | "selected" | "filter";
export type CampaignType =
  | "festival"
  | "birthday"
  | "anniversary"
  | "new_product"
  | "coupon"
  | "abandoned_cart"
  | "reengagement";

export interface IEmailCampaign {
  name?: string;
  subject: string;
  previewText?: string;
  bodyHtml: string;
  couponCode?: string;
  ctaText?: string;
  ctaUrl?: string;
  bannerImage?: string;
  campaignType: CampaignType;
  productHighlights?: Array<{
    title: string;
    price?: number;
    imageUrl?: string;
    url?: string;
  }>;
  recipientMode: CampaignRecipientMode;
  recipientUserIds?: string[];
  recipientFilters?: {
    filterType:
      | "all"
      | "recent_buyers"
      | "high_value"
      | "inactive"
      | "country"
      | "total_orders";
    minOrders?: number;
    minSpend?: number;
    daysSinceOrder?: number;
    country?: string;
  };
  recipientCount?: number;
  status: CampaignStatus;
  scheduledAt?: Date;
  sentAt?: Date;
  createdBy?: string;
  stats?: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    failed: number;
    bounced: number;
  };
}

const EmailCampaignSchema = new Schema<IEmailCampaign>(
  {
    name: String,
    subject: { type: String, required: true },
    previewText: String,
    bodyHtml: { type: String, required: true },
    couponCode: String,
    ctaText: String,
    ctaUrl: String,
    bannerImage: String,
    campaignType: {
      type: String,
      enum: [
        "festival",
        "birthday",
        "anniversary",
        "new_product",
        "coupon",
        "abandoned_cart",
        "reengagement",
      ],
      required: true,
    },
    productHighlights: [
      {
        title: String,
        price: Number,
        imageUrl: String,
        url: String,
      },
    ],
    recipientMode: {
      type: String,
      enum: ["all", "selected", "filter"],
      required: true,
    },
    recipientUserIds: [String],
    recipientFilters: {
      filterType: {
        type: String,
        enum: [
          "all",
          "recent_buyers",
          "high_value",
          "inactive",
          "country",
          "total_orders",
        ],
      },
      minOrders: Number,
      minSpend: Number,
      daysSinceOrder: Number,
      country: String,
    },
    recipientCount: Number,
    status: {
      type: String,
      enum: ["draft", "scheduled", "sending", "sent", "failed"],
      default: "draft",
      index: true,
    },
    scheduledAt: Date,
    sentAt: Date,
    createdBy: String,
    stats: {
      sent: { type: Number, default: 0 },
      delivered: { type: Number, default: 0 },
      opened: { type: Number, default: 0 },
      clicked: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
      bounced: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

EmailCampaignSchema.index({ createdAt: -1 });
EmailCampaignSchema.index({ scheduledAt: 1, status: 1 });

const EmailCampaign =
  models.EmailCampaign || model<IEmailCampaign>("EmailCampaign", EmailCampaignSchema);

export default EmailCampaign;
