"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  ListPlus,
  Megaphone,
  Pencil,
  Plus,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { renderCampaignHtml, type CampaignPayload } from "@/lib/email/campaignTemplates";
import { RichTextEditor } from "./RichTextEditor";

export type CampaignRecipientMode = "selected" | "all" | "filter";
export type CampaignSendMode = "now" | "schedule";
export type CampaignType = CampaignPayload["campaignType"];

export interface CampaignRecipient {
  userId?: string;
  email: string;
  name?: string;
}

interface ProductHighlightDraft {
  title: string;
  price: string;
  imageUrl: string;
  url: string;
}

interface CampaignComposerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipients?: CampaignRecipient[];
  initialRecipientMode?: CampaignRecipientMode;
  initialCampaignType?: CampaignType;
  title?: string;
  description?: string;
  onSent?: () => void;
}

const campaignCopy: Record<CampaignType, { subject: string; previewText: string; bodyHtml: string }> = {
  festival: {
    subject: "Festival offers are live for {{name}}",
    previewText: "Celebrate the season with premium photo frames.",
    bodyHtml:
      "<p>Hi {{name}},</p><p>We have curated premium festival offers with handcrafted finishes, gift-ready packaging, and limited-time savings.</p><p>Use the coupon below or explore the new collection for a thoughtful gift upgrade.</p>",
  },
  birthday: {
    subject: "A birthday surprise for {{name}}",
    previewText: "Send a meaningful gift with a personal touch.",
    bodyHtml:
      "<p>Hi {{name}},</p><p>Birthday gifting should feel warm and personal. This campaign is built to celebrate the moment with elegant designs and a premium checkout experience.</p><p>Pair it with a coupon and a clear call to action.</p>",
  },
  anniversary: {
    subject: "Celebrate every year with FrameKart",
    previewText: "Elegant gifts for lasting memories.",
    bodyHtml:
      "<p>Hi {{name}},</p><p>Anniversary campaigns work best when they feel refined and emotional. Highlight a premium frame collection, a gift coupon, and a strong CTA.</p>",
  },
  new_product: {
    subject: "New FrameKart arrivals just landed",
    previewText: "Fresh products ready to be featured.",
    bodyHtml:
      "<p>Hi {{name}},</p><p>Introduce the latest drops with a premium launch message, visual product cards, and a bold conversion-focused CTA.</p>",
  },
  coupon: {
    subject: "Your FrameKart coupon for {{name}}",
    previewText: "A clear offer with one dominant CTA.",
    bodyHtml:
      "<p>Hi {{name}},</p><p>Use this campaign to activate immediate conversions. Keep the copy direct, place the coupon front and center, and make the button unmistakable.</p>",
  },
  abandoned_cart: {
    subject: "Your cart is waiting, {{name}}",
    previewText: "A gentle reminder with a premium incentive.",
    bodyHtml:
      "<p>Hi {{name}},</p><p>Your cart campaign can recover revenue by reminding the shopper what they left behind and giving them one clear path back to checkout.</p>",
  },
  reengagement: {
    subject: "We miss you at FrameKart, {{name}}",
    previewText: "Bring dormant users back with a warm offer.",
    bodyHtml:
      "<p>Hi {{name}},</p><p>Re-engagement messages should feel welcoming, concise, and visually rich. Use the template to highlight fresh arrivals or a special coupon.</p>",
  },
};

export function CampaignComposerModal({
  open,
  onOpenChange,
  recipients = [],
  initialRecipientMode = "selected",
  initialCampaignType = "coupon",
  title = "Create campaign",
  description = "Compose a premium FrameKart email campaign and choose when to send it.",
  onSent,
}: CampaignComposerModalProps) {
  const { toast } = useToast();
  const [previewMode, setPreviewMode] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [campaignType, setCampaignType] = useState<CampaignType>(initialCampaignType);
  const [recipientMode, setRecipientMode] = useState<CampaignRecipientMode>(initialRecipientMode);
  const [sendMode, setSendMode] = useState<CampaignSendMode>("now");
  const [scheduledAt, setScheduledAt] = useState("");
  const [subject, setSubject] = useState(campaignCopy[initialCampaignType].subject);
  const [previewText, setPreviewText] = useState(campaignCopy[initialCampaignType].previewText);
  const [bodyHtml, setBodyHtml] = useState(campaignCopy[initialCampaignType].bodyHtml);
  const [couponCode, setCouponCode] = useState("");
  const [ctaText, setCtaText] = useState("Shop Now");
  const [ctaUrl, setCtaUrl] = useState("https://framekart.co.in");
  const [bannerImage, setBannerImage] = useState("");
  const [filterType, setFilterType] = useState<"all" | "recent_buyers" | "high_value" | "inactive" | "country" | "total_orders">("all");
  const [daysSinceOrder, setDaysSinceOrder] = useState("30");
  const [minSpend, setMinSpend] = useState("5000");
  const [minOrders, setMinOrders] = useState("2");
  const [country, setCountry] = useState("");
  const [productHighlights, setProductHighlights] = useState<ProductHighlightDraft[]>([
    { title: "Signature frame", price: "", imageUrl: "", url: "" },
    { title: "Premium gift set", price: "", imageUrl: "", url: "" },
  ]);

  useEffect(() => {
    if (!open) return;
    const copy = campaignCopy[initialCampaignType];
    setCampaignType(initialCampaignType);
    setRecipientMode(initialRecipientMode);
    setSubject(copy.subject);
    setPreviewText(copy.previewText);
    setBodyHtml(copy.bodyHtml);
    setCouponCode("");
    setCtaText("Shop Now");
    setCtaUrl("https://framekart.co.in");
    setBannerImage("");
    setSendMode("now");
    setScheduledAt("");
    setFilterType("all");
    setDaysSinceOrder("30");
    setMinSpend("5000");
    setMinOrders("2");
    setCountry("");
    setProductHighlights([
      { title: "Signature frame", price: "", imageUrl: "", url: "" },
      { title: "Premium gift set", price: "", imageUrl: "", url: "" },
    ]);
  }, [initialCampaignType, initialRecipientMode, open]);

  const previewRecipient = useMemo(() => {
    return recipients[0] || { name: "FrameKart Customer", email: "preview@framekart.co.in" };
  }, [recipients]);

  const recipientSummary = useMemo(() => {
    if (recipientMode === "all") return recipients.length ? `${recipients.length} user${recipients.length === 1 ? "" : "s"}` : "All users";
    if (recipientMode === "filter") {
      switch (filterType) {
        case "recent_buyers":
          return `Recent buyers (${daysSinceOrder} days)`;
        case "high_value":
          return `High value customers (₹${minSpend})`;
        case "inactive":
          return `Inactive customers (${daysSinceOrder} days)`;
        case "country":
          return country ? `Users in ${country}` : "Users by country";
        case "total_orders":
          return `${minOrders}+ total orders`;
        default:
          return "All users";
      }
    }
    return `${recipients.length} selected user${recipients.length === 1 ? "" : "s"}`;
  }, [country, daysSinceOrder, filterType, minOrders, minSpend, recipientMode, recipients.length]);

  const previewHtml = useMemo(
    () =>
      renderCampaignHtml(
        {
          subject,
          previewText,
          bodyHtml,
          couponCode,
          ctaText,
          ctaUrl,
          bannerImage,
          campaignType,
          productHighlights: productHighlights
            .filter((item) => item.title.trim())
            .map((item) => ({
              title: item.title,
              price: item.price ? Number(item.price) : undefined,
              imageUrl: item.imageUrl || undefined,
              url: item.url || undefined,
            })),
        },
        previewRecipient
      ),
    [bodyHtml, bannerImage, campaignType, couponCode, ctaText, ctaUrl, previewRecipient, previewText, productHighlights]
  );
  const updateCampaignType = (nextType: CampaignType) => {
    setCampaignType(nextType);
    const copy = campaignCopy[nextType];
    setSubject(copy.subject);
    setPreviewText(copy.previewText);
    setBodyHtml(copy.bodyHtml);
  };

  const addProductHighlight = () => {
    setProductHighlights((current) => [...current, { title: "", price: "", imageUrl: "", url: "" }]);
  };

  const updateProductHighlight = (index: number, key: keyof ProductHighlightDraft, value: string) => {
    setProductHighlights((current) =>
      current.map((item, currentIndex) => (currentIndex === index ? { ...item, [key]: value } : item))
    );
  };

  const removeProductHighlight = (index: number) => {
    setProductHighlights((current) => current.filter((_, currentIndex) => currentIndex !== index));
  };

  const submitCampaign = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        subject,
        previewText,
        bodyHtml,
        couponCode,
        ctaText,
        ctaUrl,
        bannerImage,
        campaignType,
        productHighlights: productHighlights
          .filter((item) => item.title.trim())
          .map((item) => ({
            title: item.title,
            price: item.price ? Number(item.price) : undefined,
            imageUrl: item.imageUrl || undefined,
            url: item.url || undefined,
          })),
        recipientMode,
        recipientUserIds: recipientMode === "selected" ? recipients.map((recipient) => recipient.userId).filter(Boolean) : undefined,
        recipientFilters:
          recipientMode === "filter"
            ? {
                filterType,
                daysSinceOrder: Number(daysSinceOrder || 0) || undefined,
                minSpend: Number(minSpend || 0) || undefined,
                minOrders: Number(minOrders || 0) || undefined,
                country: country || undefined,
              }
            : undefined,
        sendMode,
        scheduledAt: sendMode === "schedule" ? scheduledAt || undefined : undefined,
      };

      const response = await fetch("/api/admin/email-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Campaign failed to send");
      }

      toast({
        title: sendMode === "schedule" ? "Campaign scheduled" : "Campaign sent",
        description:
          sendMode === "schedule"
            ? `${recipientSummary} will receive this campaign at the scheduled time.`
            : `${recipientSummary} have been queued for delivery.`,
      });

      setConfirmOpen(false);
      onOpenChange(false);
      onSent?.();
    } catch (error: any) {
      toast({
        title: "Campaign error",
        description: error?.message || "Unable to submit campaign",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canPreview = Boolean(subject.trim() && bodyHtml.trim());

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Megaphone className="h-5 w-5 text-primary" />
              {title}
            </DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Campaign subject" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Campaign type</label>
                  <Select value={campaignType} onValueChange={(value) => updateCampaignType(value as CampaignType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a campaign type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="festival">Festival Offers</SelectItem>
                      <SelectItem value="birthday">Birthday Offers</SelectItem>
                      <SelectItem value="anniversary">Anniversary Offers</SelectItem>
                      <SelectItem value="new_product">New Product Launch</SelectItem>
                      <SelectItem value="coupon">Coupon Campaigns</SelectItem>
                      <SelectItem value="abandoned_cart">Abandoned Cart</SelectItem>
                      <SelectItem value="reengagement">Re-engagement Campaigns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Send mode</label>
                  <Select value={sendMode} onValueChange={(value) => setSendMode(value as CampaignSendMode)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Send mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">Send now</SelectItem>
                      <SelectItem value="schedule">Schedule later</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {sendMode === "schedule" ? (
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium">Schedule time</label>
                    <Input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} />
                  </div>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Coupon code</label>
                  <Input value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="FESTIVAL25" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CTA text</label>
                  <Input value={ctaText} onChange={(event) => setCtaText(event.target.value)} placeholder="Shop now" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium">CTA URL</label>
                  <Input value={ctaUrl} onChange={(event) => setCtaUrl(event.target.value)} placeholder="https://framekart.co.in/frames" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium">Banner image</label>
                  <Input value={bannerImage} onChange={(event) => setBannerImage(event.target.value)} placeholder="https://..." />
                </div>
              </div>

              <div className="space-y-2 rounded-2xl border bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">Message body</p>
                    <p className="text-xs text-muted-foreground">Use personalization tokens like {"{{name}}"} inside the content.</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => setPreviewMode((current) => !current)}>
                    {previewMode ? <Pencil className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                    {previewMode ? "Edit content" : "Preview mode"}
                  </Button>
                </div>
                <RichTextEditor value={bodyHtml} onChange={setBodyHtml} readOnly={previewMode} placeholder="Compose the body of your email" />
              </div>

              <div className="space-y-3 rounded-2xl border bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Product highlights</p>
                    <p className="text-xs text-muted-foreground">Use up to a few hero items to support the campaign visually.</p>
                  </div>
                  <Button type="button" variant="secondary" size="sm" onClick={addProductHighlight}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add highlight
                  </Button>
                </div>
                <div className="space-y-4">
                  {productHighlights.map((highlight, index) => (
                    <div key={`${highlight.title}-${index}`} className="grid gap-3 rounded-xl border p-3 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Title</label>
                        <Input value={highlight.title} onChange={(event) => updateProductHighlight(index, "title", event.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Price</label>
                        <Input value={highlight.price} onChange={(event) => updateProductHighlight(index, "price", event.target.value)} placeholder="499" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Image URL</label>
                        <Input value={highlight.imageUrl} onChange={(event) => updateProductHighlight(index, "imageUrl", event.target.value)} placeholder="https://..." />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Product URL</label>
                        <div className="flex gap-2">
                          <Input value={highlight.url} onChange={(event) => updateProductHighlight(index, "url", event.target.value)} placeholder="https://..." />
                          <Button type="button" variant="outline" size="icon" onClick={() => removeProductHighlight(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border bg-background p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Users className="h-4 w-4 text-primary" />
                  Audience
                </div>
                <div className="mt-3 space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Recipient mode</label>
                    <Select value={recipientMode} onValueChange={(value) => setRecipientMode(value as CampaignRecipientMode)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="selected">Selected users</SelectItem>
                        <SelectItem value="all">All users</SelectItem>
                        <SelectItem value="filter">Filtered audience</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="rounded-xl bg-muted/40 p-3 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between gap-3">
                      <span>{recipientSummary}</span>
                      <Badge variant="secondary">{recipientMode}</Badge>
                    </div>
                  </div>

                  {recipientMode === "selected" ? (
                    <div className="space-y-2 rounded-xl border p-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Selected recipients</p>
                      <div className="space-y-2 text-sm">
                        {recipients.length > 0 ? recipients.map((recipient) => (
                          <div key={recipient.email} className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
                            <span className="font-medium">{recipient.name || recipient.email}</span>
                            <span className="text-xs text-muted-foreground">{recipient.email}</span>
                          </div>
                        )) : <p className="text-muted-foreground">No users selected yet.</p>}
                      </div>
                    </div>
                  ) : null}

                  {recipientMode === "filter" ? (
                    <div className="space-y-3 rounded-xl border p-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Filter type</label>
                        <Select value={filterType} onValueChange={(value) => setFilterType(value as typeof filterType)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a filter" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All users</SelectItem>
                            <SelectItem value="recent_buyers">Recent buyers</SelectItem>
                            <SelectItem value="high_value">High-value customers</SelectItem>
                            <SelectItem value="inactive">Inactive customers</SelectItem>
                            <SelectItem value="country">Users by country</SelectItem>
                            <SelectItem value="total_orders">Users by total orders</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {(filterType === "recent_buyers" || filterType === "inactive") && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Days</label>
                          <Input type="number" value={daysSinceOrder} onChange={(event) => setDaysSinceOrder(event.target.value)} />
                        </div>
                      )}
                      {filterType === "high_value" && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Minimum spend</label>
                          <Input type="number" value={minSpend} onChange={(event) => setMinSpend(event.target.value)} />
                        </div>
                      )}
                      {filterType === "total_orders" && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Minimum orders</label>
                          <Input type="number" value={minOrders} onChange={(event) => setMinOrders(event.target.value)} />
                        </div>
                      )}
                      {filterType === "country" && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Country</label>
                          <Input value={country} onChange={(event) => setCountry(event.target.value)} placeholder="India" />
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border bg-gradient-to-br from-background to-muted/20 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ListPlus className="h-4 w-4 text-primary" />
                  Campaign snapshot
                </div>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <p><span className="font-medium text-foreground">Type:</span> {campaignType.replaceAll("_", " ")}</p>
                  <p><span className="font-medium text-foreground">Mode:</span> {sendMode === "now" ? "Send immediately" : "Schedule later"}</p>
                  <p><span className="font-medium text-foreground">Audience:</span> {recipientSummary}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline">Responsive</Badge>
                  <Badge variant="outline">Resend</Badge>
                  <Badge variant="outline">Personalized</Badge>
                  <Badge variant="outline">Rate limited</Badge>
                </div>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ListPlus className="h-4 w-4 text-primary" />
                  Preview
                </div>
                <div className="mt-3 overflow-hidden rounded-2xl border bg-muted/20">
                  {canPreview ? (
                    <iframe
                      title="Campaign preview"
                      className={cn("h-[680px] w-full", !previewMode && "opacity-80")}
                      srcDoc={previewHtml}
                    />
                  ) : (
                    <div className="flex h-[680px] items-center justify-center p-8 text-center text-sm text-muted-foreground">
                      Add a subject and body to preview your campaign.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => setConfirmOpen(true)} disabled={isSubmitting || !subject.trim() || !bodyHtml.trim()}>
              <Send className="mr-2 h-4 w-4" />
              {sendMode === "schedule" ? "Schedule campaign" : "Send campaign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm campaign send</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to {sendMode === "schedule" ? "schedule" : "send"} a {campaignType.replaceAll("_", " ")} campaign to {recipientSummary}. This action will create delivery logs and can trigger Resend immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Review again</AlertDialogCancel>
            <AlertDialogAction onClick={submitCampaign} disabled={isSubmitting}>
              {isSubmitting ? "Working..." : sendMode === "schedule" ? "Confirm schedule" : "Confirm send"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
