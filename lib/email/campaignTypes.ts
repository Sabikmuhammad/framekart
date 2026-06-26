import type { CampaignType } from "@/models/EmailCampaign";

export const CAMPAIGN_TYPES: Array<{ value: CampaignType; label: string }> = [
  { value: "festival", label: "Festival Offers" },
  { value: "birthday", label: "Birthday Offers" },
  { value: "anniversary", label: "Anniversary Offers" },
  { value: "new_product", label: "New Product Launch" },
  { value: "coupon", label: "Coupon Campaigns" },
  { value: "abandoned_cart", label: "Abandoned Cart" },
  { value: "reengagement", label: "Re-engagement Campaigns" },
];
