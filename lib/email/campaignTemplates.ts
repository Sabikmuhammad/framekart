import type { CampaignType } from "@/models/EmailCampaign";
import { applyPersonalization } from "./personalization";

export interface CampaignProductHighlight {
  title: string;
  price?: number;
  imageUrl?: string;
  url?: string;
}

export interface CampaignPayload {
  subject: string;
  previewText?: string;
  bodyHtml: string;
  couponCode?: string;
  ctaText?: string;
  ctaUrl?: string;
  bannerImage?: string;
  campaignType: CampaignType;
  productHighlights?: CampaignProductHighlight[];
}

export interface CampaignRecipient {
  name?: string;
  email: string;
}

export interface CampaignTemplatePreset {
  title: string;
  subtitle: string;
  accent: string;
  highlight: string;
  background: string;
}

export const CAMPAIGN_TEMPLATE_PRESETS: Record<CampaignType, CampaignTemplatePreset> = {
  festival: {
    title: "Festival collection drop",
    subtitle: "Celebrate the season with premium keepsakes",
    accent: "#f97316",
    highlight: "#fff7ed",
    background: "#fffaf5",
  },
  birthday: {
    title: "Birthday gifts with meaning",
    subtitle: "Send a frame that feels personal and warm",
    accent: "#7c3aed",
    highlight: "#f5f3ff",
    background: "#fbfaff",
  },
  anniversary: {
    title: "Anniversary stories deserve a frame",
    subtitle: "Elegant gifting for milestones that matter",
    accent: "#be123c",
    highlight: "#fff1f2",
    background: "#fffafb",
  },
  new_product: {
    title: "Fresh arrivals worth opening",
    subtitle: "Premium designs, ready for gifting",
    accent: "#0f766e",
    highlight: "#f0fdfa",
    background: "#f7fffe",
  },
  coupon: {
    title: "Exclusive coupon inside",
    subtitle: "A premium offer with a clear CTA",
    accent: "#111827",
    highlight: "#f8fafc",
    background: "#ffffff",
  },
  abandoned_cart: {
    title: "Your cart is still waiting",
    subtitle: "Bring shoppers back with a timely offer",
    accent: "#dc2626",
    highlight: "#fef2f2",
    background: "#fffafa",
  },
  reengagement: {
    title: "A thoughtful comeback message",
    subtitle: "Re-activate dormant users with style",
    accent: "#2563eb",
    highlight: "#eff6ff",
    background: "#f8fbff",
  },
};

export function renderCampaignHtml(payload: CampaignPayload, recipient: CampaignRecipient) {
  const name = recipient.name || "there";
  const header = getCampaignHeader(payload.campaignType);
  const preset = CAMPAIGN_TEMPLATE_PRESETS[payload.campaignType];
  const safeSubject = escapeHtml(
    applyPersonalization(payload.subject, { name, email: recipient.email })
  );
  const previewText = escapeHtml(
    applyPersonalization(payload.previewText || "FrameKart exclusive update", {
      name,
      email: recipient.email,
    })
  );
  const bodyHtml = sanitizeHtml(
    applyPersonalization(payload.bodyHtml, { name, email: recipient.email })
  );
  const coupon = payload.couponCode ? escapeHtml(payload.couponCode) : "";
  const ctaText = escapeHtml(
    applyPersonalization(payload.ctaText || "Shop Now", { name, email: recipient.email })
  );
  const ctaUrl = escapeHtml(payload.ctaUrl || "https://framekart.co.in");
  const bannerImage = payload.bannerImage ? escapeHtml(payload.bannerImage) : "";
  const products = payload.productHighlights || [];

  const productRows = chunk(products, 2)
    .map((row) => {
      const cards = row
        .map((product) => {
          const productTitle = escapeHtml(
            applyPersonalization(product.title, { name, email: recipient.email })
          );
          const price = product.price != null ? `₹${product.price.toLocaleString("en-IN")}` : "";
          const image = product.imageUrl ? escapeHtml(product.imageUrl) : "";
          const url = product.url ? escapeHtml(product.url) : ctaUrl;
          return `
            <td class="stack" width="50%" style="padding: 8px; vertical-align: top;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid rgba(15, 23, 42, 0.10); border-radius: 18px; overflow: hidden; background: #ffffff; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);">
                <tr>
                  <td style="padding: 14px; text-align: center; background: linear-gradient(180deg, ${preset.highlight}, #ffffff);">
                    ${image ? `<img src="${image}" alt="${productTitle}" style="width: 100%; max-width: 240px; border-radius: 14px; display:block; margin: 0 auto;" />` : ""}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0 0 6px; font-size: 14px; font-weight: 700; color: #0f172a;">${productTitle}</p>
                    ${price ? `<p style="margin: 0 0 14px; font-size: 13px; color: #475569;">${price}</p>` : ""}
                    <a href="${url}" style="display: inline-block; padding: 10px 16px; background: ${preset.accent}; color: #ffffff; text-decoration: none; border-radius: 999px; font-size: 12px; font-weight: 700;">View Product</a>
                  </td>
                </tr>
              </table>
            </td>
          `;
        })
        .join("");

      return `<tr>${cards}${row.length === 1 ? '<td class="stack" width="50%" style="padding: 8px;"></td>' : ""}</tr>`;
    })
    .join("");

  const couponBlock = coupon
    ? `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 18px 0; border-collapse: separate; border-spacing: 0;">
        <tr>
          <td style="padding: 1px; border-radius: 18px; background: linear-gradient(135deg, ${preset.accent}, #111827);">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius: 17px; background: #ffffff;">
              <tr>
                <td style="padding: 18px; text-align: center;">
                  <p style="margin: 0 0 8px; font-size: 11px; color: #64748b; letter-spacing: 2px; text-transform: uppercase;">Your coupon code</p>
                  <p style="margin: 0; font-size: 24px; font-weight: 800; color: ${preset.accent}; letter-spacing: 1px;">${coupon}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `
    : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeSubject}</title>
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <style>
    @media only screen and (max-width: 640px) {
      .container { width: 100% !important; max-width: 100% !important; }
      .stack { display: block !important; width: 100% !important; }
      .padding { padding: 16px !important; }
      .hero-title { font-size: 22px !important; }
      .hero-copy { font-size: 14px !important; }
    }

    @media (prefers-color-scheme: dark) {
      body { background: #020617 !important; }
      .surface { background: #0f172a !important; color: #e2e8f0 !important; }
      .footer { background: #111827 !important; color: #cbd5e1 !important; }
      .content-copy { color: #cbd5e1 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(180deg, ${preset.background} 0%, #f8fafc 100%); font-family: 'Segoe UI', Arial, sans-serif; color: #111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 24px 12px;">
    <tr>
      <td align="center">
        <table class="container surface" width="640" cellpadding="0" cellspacing="0" style="max-width: 640px; border-radius: 24px; overflow: hidden; background: #ffffff; box-shadow: 0 30px 70px rgba(15, 23, 42, 0.16);">
          <tr>
            <td style="background: linear-gradient(135deg, ${preset.accent} 0%, #111827 100%); padding: 30px 24px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 2.5px; color: rgba(255,255,255,0.72);">FRAMEKART</p>
              <h1 class="hero-title" style="margin: 0 0 8px; font-size: 28px; line-height: 1.2; color: #ffffff;">${header.title}</h1>
              <p class="hero-copy" style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.84);">${header.subtitle}</p>
            </td>
          </tr>
          <tr>
            <td class="padding" style="padding: 28px 24px 24px; background: #ffffff;">
              <span style="display:none; max-height:0; overflow:hidden; color:#ffffff;">${previewText}</span>
              <p style="margin: 0 0 12px; font-size: 16px; color: #111827;">Hi ${escapeHtml(name)},</p>
              <div class="content-copy" style="margin-bottom: 18px; font-size: 14px; color: #334155; line-height: 1.8;">${bodyHtml}</div>
              ${couponBlock}
              ${bannerImage ? `<img src="${bannerImage}" alt="Offer" style="width: 100%; border-radius: 18px; margin: 16px 0 20px; display:block;" />` : ""}
              ${productRows ? `<table width="100%" cellpadding="0" cellspacing="0">${productRows}</table>` : ""}
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                <tr>
                  <td align="center">
                    <a href="${ctaUrl}" style="display: inline-block; padding: 14px 28px; background: ${preset.accent}; color: #ffffff; text-decoration: none; border-radius: 999px; font-size: 14px; font-weight: 700; letter-spacing: 0.4px; box-shadow: 0 10px 24px rgba(15, 23, 42, 0.18);">${ctaText}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="footer" style="padding: 18px 24px; background: #f8fafc; text-align: center; font-size: 12px; color: #64748b;">
              <p style="margin: 0 0 6px;">You are receiving this email because you signed up at FrameKart.</p>
              <p style="margin: 0;">FrameKart, Premium Photo Frames, India</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function getCampaignHeader(campaignType: CampaignType) {
  const preset = CAMPAIGN_TEMPLATE_PRESETS[campaignType];
  return {
    title: preset.title,
    subtitle: preset.subtitle,
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeHtml(value: string) {
  return value.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}
