"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { CalendarClock, RefreshCw, Send } from "lucide-react";

interface CampaignRow {
  _id: string;
  subject: string;
  recipientCount: number;
  sentAt?: string;
  scheduledAt?: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "failed";
  openRate: number;
  clickRate: number;
  stats?: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    failed: number;
    bounced: number;
  };
  createdAt: string;
}

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingScheduled, setProcessingScheduled] = useState(false);
  const { toast } = useToast();

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/email-campaigns");
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load campaigns");
      }

      setCampaigns(data.data || []);
    } catch (error: any) {
      toast({
        title: "Unable to load campaign history",
        description: error?.message || "Please refresh the page",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const summary = useMemo(() => {
    const sent = campaigns.filter((campaign) => campaign.status === "sent").length;
    const scheduled = campaigns.filter((campaign) => campaign.status === "scheduled").length;
    const failed = campaigns.filter((campaign) => campaign.status === "failed").length;
    return { sent, scheduled, failed };
  }, [campaigns]);

  const processScheduledCampaigns = async () => {
    setProcessingScheduled(true);
    try {
      const response = await fetch("/api/admin/email-campaigns/process-scheduled", { method: "POST" });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to process scheduled campaigns");
      }

      toast({
        title: "Scheduled campaigns processed",
        description: `Updated ${data.data?.length || 0} campaign${data.data?.length === 1 ? "" : "s"}.`,
      });
      await fetchCampaigns();
    } catch (error: any) {
      toast({
        title: "Processing failed",
        description: error?.message || "Unable to run scheduled sends",
        variant: "destructive",
      });
    } finally {
      setProcessingScheduled(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Badge variant="secondary" className="w-fit">Email campaigns</Badge>
          <h1 className="text-3xl font-bold tracking-tight">Campaign History</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Review sent campaigns, monitor open and click rates, and process scheduled sends.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={fetchCampaigns} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={processScheduledCampaigns} disabled={processingScheduled}>
            <Send className="mr-2 h-4 w-4" />
            {processingScheduled ? "Processing..." : "Run scheduled sends"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Sent campaigns</CardDescription>
            <CardTitle className="text-2xl">{summary.sent}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Scheduled campaigns</CardDescription>
            <CardTitle className="text-2xl">{summary.scheduled}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Failed campaigns</CardDescription>
            <CardTitle className="text-2xl">{summary.failed}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Recent campaigns</CardTitle>
          <CardDescription>Subject, recipients, send time, open rate, and click rate for each campaign.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-xl bg-muted/60" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent time</TableHead>
                    <TableHead>Open rate</TableHead>
                    <TableHead>Click rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign._id}>
                      <TableCell className="font-medium">{campaign.subject}</TableCell>
                      <TableCell>{campaign.recipientCount}</TableCell>
                      <TableCell>
                        <Badge variant={campaign.status === "failed" ? "destructive" : campaign.status === "scheduled" ? "secondary" : "outline"}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarClock className="h-4 w-4" />
                          {campaign.sentAt ? new Date(campaign.sentAt).toLocaleString("en-IN") : campaign.scheduledAt ? `Scheduled for ${new Date(campaign.scheduledAt).toLocaleString("en-IN")}` : "Not sent yet"}
                        </div>
                      </TableCell>
                      <TableCell>{campaign.openRate}%</TableCell>
                      <TableCell>{campaign.clickRate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
