import { z } from "zod";

export const CampaignPayloadSchema = z.object({
  name: z.string().optional(),
  subject: z.string().min(3),
  previewText: z.string().optional(),
  bodyHtml: z.string().min(5),
  couponCode: z.string().optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
  bannerImage: z.string().url().optional().or(z.literal("")),
  campaignType: z.enum([
    "festival",
    "birthday",
    "anniversary",
    "new_product",
    "coupon",
    "abandoned_cart",
    "reengagement",
  ]),
  productHighlights: z
    .array(
      z.object({
        title: z.string().min(1),
        price: z.number().optional(),
        imageUrl: z.string().url().optional().or(z.literal("")),
        url: z.string().url().optional().or(z.literal("")),
      })
    )
    .optional(),
  recipientMode: z.enum(["all", "selected", "filter"]),
  recipientUserIds: z.array(z.string()).optional(),
  recipientFilters: z
    .object({
      filterType: z.enum([
        "all",
        "recent_buyers",
        "high_value",
        "inactive",
        "country",
        "total_orders",
      ]),
      minOrders: z.number().optional(),
      minSpend: z.number().optional(),
      daysSinceOrder: z.number().optional(),
      country: z.string().optional(),
    })
    .optional(),
  sendMode: z.enum(["now", "schedule"]).optional(),
  scheduledAt: z.string().optional(),
});
