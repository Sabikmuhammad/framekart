"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CampaignComposerModal, type CampaignRecipient, type CampaignType } from "@/components/admin/campaigns/CampaignComposerModal";
import { useToast } from "@/components/ui/use-toast";
import { CheckSquare, Mail, Megaphone, RefreshCw, Ticket } from "lucide-react";

interface UserRecord {
  _id: string;
  clerkId: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
}

type CampaignAction = "promotion" | "coupon" | "bulk" | "all";

const actionConfig: Record<CampaignAction, { title: string; description: string; campaignType: CampaignType }> = {
  promotion: {
    title: "Send Promotion Mail",
    description: "Open a premium campaign composer for this customer.",
    campaignType: "new_product",
  },
  coupon: {
    title: "Send Coupon",
    description: "Launch a coupon-led campaign to the selected user.",
    campaignType: "coupon",
  },
  bulk: {
    title: "Send Bulk Campaign",
    description: "Open the bulk composer with the selected audience.",
    campaignType: "festival",
  },
  all: {
    title: "Send to All Users",
    description: "Launch a campaign to the entire customer base.",
    campaignType: "reengagement",
  },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerRecipients, setComposerRecipients] = useState<CampaignRecipient[]>([]);
  const [composerMode, setComposerMode] = useState<"selected" | "all" | "filter">("selected");
  const [composerType, setComposerType] = useState<CampaignType>("coupon");
  const [composerTitle, setComposerTitle] = useState(actionConfig.promotion.title);
  const [composerDescription, setComposerDescription] = useState(actionConfig.promotion.description);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users");
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load users");
      }

      setUsers(data.data || []);
    } catch (error: any) {
      toast({
        title: "Unable to load users",
        description: error?.message || "Please refresh the page",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const selectedUsers = useMemo(
    () => users.filter((user) => selectedIds.includes(user.clerkId)),
    [selectedIds, users]
  );

  const openComposer = (action: CampaignAction, recipients: CampaignRecipient[] = [], mode: "selected" | "all" | "filter" = "selected") => {
    const config = actionConfig[action];
    setComposerTitle(config.title);
    setComposerDescription(config.description);
    setComposerType(config.campaignType);
    setComposerRecipients(recipients);
    setComposerMode(mode);
    setComposerOpen(true);
  };

  const toggleSelected = (clerkId: string) => {
    setSelectedIds((current) =>
      current.includes(clerkId) ? current.filter((id) => id !== clerkId) : [...current, clerkId]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(users.map((user) => user.clerkId));
  };

  const selectedCount = selectedIds.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Badge variant="secondary" className="w-fit">Customer outreach</Badge>
          <h1 className="text-3xl font-bold tracking-tight">All Users</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Send promotional emails, coupon campaigns, and bulk offers directly from the FrameKart admin panel.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={fetchUsers} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => openComposer("all", users.map((user) => ({ userId: user.clerkId, email: user.email, name: user.name })), "all")}>
            <Megaphone className="mr-2 h-4 w-4" />
            Send to All Users
          </Button>
          <Button onClick={() => openComposer("bulk", selectedUsers.map((user) => ({ userId: user.clerkId, email: user.email, name: user.name })), "selected")} disabled={selectedCount === 0}>
            <Mail className="mr-2 h-4 w-4" />
            Send Bulk Campaign ({selectedCount})
          </Button>
        </div>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">Users List</CardTitle>
          <CardDescription>Choose one or more users, then launch a campaign with the action menu.</CardDescription>
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
                    <TableHead className="w-10">
                      <input
                        type="checkbox"
                        aria-label="Select all users"
                        checked={users.length > 0 && selectedIds.length === users.length}
                        onChange={toggleAll}
                        className="h-4 w-4 rounded border-border accent-primary"
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const isSelected = selectedIds.includes(user.clerkId);
                    const recipient = { userId: user.clerkId, email: user.email, name: user.name };

                    return (
                      <TableRow key={user._id} className={isSelected ? "bg-primary/5" : undefined}>
                        <TableCell>
                          <input
                            type="checkbox"
                            aria-label={`Select ${user.name}`}
                            checked={isSelected}
                            onChange={() => toggleSelected(user.clerkId)}
                            className="h-4 w-4 rounded border-border accent-primary"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString("en-IN")}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap justify-end gap-2">
                            <Button type="button" size="sm" variant="outline" onClick={() => openComposer("promotion", [recipient], "selected")}>
                              <Megaphone className="mr-2 h-4 w-4" />
                              Send Promotion Mail
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => openComposer("coupon", [recipient], "selected")}>
                              <Ticket className="mr-2 h-4 w-4" />
                              Send Coupon
                            </Button>
                            <Button type="button" size="sm" onClick={() => openComposer("bulk", [recipient], "selected")}>
                              <CheckSquare className="mr-2 h-4 w-4" />
                              Send Bulk Campaign
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <CampaignComposerModal
        open={composerOpen}
        onOpenChange={setComposerOpen}
        recipients={composerRecipients}
        initialRecipientMode={composerMode}
        initialCampaignType={composerType}
        title={composerTitle}
        description={composerDescription}
        onSent={fetchUsers}
      />
    </div>
  );
}
