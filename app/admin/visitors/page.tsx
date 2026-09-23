"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { RefreshCw, Search, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface VisitorLead {
  _id: string;
  name?: string;
  phone?: string;
  email?: string;
  source: string;
  status: string;
  pagesViewed: number;
  productViews: number;
  cartActivity: boolean;
  currentPage?: string;
  firstVisitedAt: string;
  lastSeenAt: string;
  capturedAt?: string;
}

export default function AdminVisitorsPage() {
  const [visitors, setVisitors] = useState<VisitorLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filter) params.set("filter", filter);

      const response = await fetch(`/api/admin/visitors?${params.toString()}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load visitors");
      }

      setVisitors(data.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchVisitors();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Badge variant="secondary" className="w-fit">Analytics & Leads</Badge>
          <h1 className="text-3xl font-bold tracking-tight">Visitors / Leads</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Track anonymous visitor engagement and view captured leads.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={fetchVisitors} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl flex justify-between items-center">
            <span>Captured Leads</span>
            <div className="flex space-x-2 w-full md:w-auto mt-4 md:mt-0">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="captured">Captured</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-muted/60" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Last Page</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Seen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No visitors found matching criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    visitors.map((v) => (
                      <TableRow key={v._id}>
                        <TableCell>
                          {v.name ? (
                            <div className="font-medium">{v.name}</div>
                          ) : (
                            <div className="text-muted-foreground italic">Anonymous</div>
                          )}
                          {v.phone && <div className="text-sm text-muted-foreground">{v.phone}</div>}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {v.pagesViewed} pages ({v.productViews} products)
                          </div>
                          {v.cartActivity && (
                            <Badge variant="secondary" className="mt-1 text-xs">Added to Cart</Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm">
                          {v.currentPage || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={v.name ? "default" : "outline"}>
                            {v.name ? "Captured" : "Anonymous"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(v.lastSeenAt), "MMM d, h:mm a")}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
