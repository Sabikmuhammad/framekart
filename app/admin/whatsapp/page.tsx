"use client";

import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, RefreshCw, Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { WhatsAppDetailDrawer } from "@/components/admin/WhatsAppDetailDrawer";
import { TestWhatsAppModal } from "@/components/admin/TestWhatsAppModal";

interface WhatsAppMessage {
  _id: string;
  name?: string;
  phone?: string;
  email?: string;
  whatsappWelcomeSent?: boolean;
  whatsappWelcomeSentAt?: string;
  whatsappWelcomeMessageId?: string;
  whatsappWelcomeError?: string;
  whatsappDeliveryStatus?: "PENDING" | "SENT" | "DELIVERED" | "READ" | "FAILED";
  aiConversation?: any;
  createdAt: string;
}

export default function AdminWhatsAppPage() {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ total: 0, sent: 0, failed: 0, pending: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [selectedMessage, setSelectedMessage] = useState<WhatsAppMessage | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);

  const { toast } = useToast();

  // Simple debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchMessages = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        status: statusFilter,
        search: debouncedSearch,
      });

      const res = await fetch(`/api/admin/whatsapp/messages?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load messages");
      }

      setMessages(data.messages || []);
      setSummary(data.summary);
      setPagination(data.pagination);
    } catch (error: any) {
      toast({
        title: "Unable to load messages",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, toast]);

  useEffect(() => {
    fetchMessages(1);
  }, [fetchMessages]);

  const handleRefresh = () => fetchMessages(pagination.page);

  const handleNextPage = () => {
    if (pagination.page < pagination.pages) {
      fetchMessages(pagination.page + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      fetchMessages(pagination.page - 1);
    }
  };

  const openMessageDetail = (msg: WhatsAppMessage) => {
    setSelectedMessage(msg);
    setDrawerOpen(true);
  };

  const renderStatusBadge = (msg: WhatsAppMessage) => {
    const status = msg.whatsappDeliveryStatus || (msg.whatsappWelcomeSent ? "SENT" : (msg.whatsappWelcomeError ? "FAILED" : "PENDING"));
    
    if (status === "DELIVERED") return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200" variant="secondary">✓✓ Delivered</Badge>;
    if (status === "READ") return <Badge className="bg-blue-500 text-white hover:bg-blue-600">✓✓ Read</Badge>;
    if (status === "SENT") return <Badge className="bg-green-100 text-green-800 hover:bg-green-200" variant="secondary">✓ Sent</Badge>;
    if (status === "FAILED") return <Badge className="bg-red-100 text-red-800 hover:bg-red-200" variant="secondary">Failed</Badge>;
    return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200" variant="secondary">Pending</Badge>;
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Badge variant="secondary" className="w-fit text-blue-600 bg-blue-50">Communication</Badge>
          <h1 className="text-3xl font-bold tracking-tight">WhatsApp Chat</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            View and manage FrameKart WhatsApp welcome-message activity.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setTestModalOpen(true)}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Test WhatsApp
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-green-500">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{summary.sent}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-red-500">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{summary.failed}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-amber-500">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{summary.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and List */}
      <Card className="border-border/60 shadow-sm">
        <div className="p-4 border-b bg-slate-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search customer or phone..."
              className="pl-9 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px] bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="welcome">
              <SelectTrigger className="w-full md:w-[180px] bg-white">
                <SelectValue placeholder="Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Templates</SelectItem>
                <SelectItem value="welcome">framekart_welcome</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <CardContent className="p-0">
          {loading ? (
             <div className="p-4 space-y-4">
               {[...Array(5)].map((_, i) => (
                 <div key={i} className="h-14 bg-muted/50 rounded-lg animate-pulse" />
               ))}
             </div>
          ) : messages.length === 0 ? (
            <div className="py-24 text-center px-4">
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No welcome messages found</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Once visitors submit the lead form, their WhatsApp activity will appear here.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead>Customer</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Welcome Status</TableHead>
                      <TableHead>AI Chat</TableHead>
                      <TableHead>Sent At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((msg) => (
                      <TableRow key={msg._id} className="group cursor-pointer" onClick={() => openMessageDetail(msg)}>
                        <TableCell className="font-medium text-slate-900">
                          {msg.name || "Customer"}
                          {msg.email && <div className="text-xs text-muted-foreground font-normal">{msg.email}</div>}
                        </TableCell>
                        <TableCell className="font-mono text-sm">{msg.phone}</TableCell>
                        <TableCell>{renderStatusBadge(msg)}</TableCell>
                        <TableCell>
                          {msg.aiConversation ? (
                            msg.aiConversation.conversationState === "HUMAN_HANDOFF" ? (
                              <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">Human Handoff</Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">AI Active ({msg.aiConversation.messages?.length || 0})</Badge>
                            )
                          ) : (
                            <span className="text-xs text-slate-400">None</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {msg.whatsappWelcomeSentAt
                            ? new Date(msg.whatsappWelcomeSentAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
                            : new Date(msg.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openMessageDetail(msg); }}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden flex flex-col divide-y">
                {messages.map((msg) => (
                  <div key={msg._id} className="p-4 space-y-3 bg-white" onClick={() => openMessageDetail(msg)}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-slate-900">{msg.name || "Customer"}</h4>
                        <p className="text-sm font-mono text-slate-500">{msg.phone}</p>
                      </div>
                      {renderStatusBadge(msg)}
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>framekart_welcome</span>
                      <span>
                        {msg.whatsappWelcomeSentAt
                            ? new Date(msg.whatsappWelcomeSentAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
                            : new Date(msg.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    {msg.aiConversation && (
                      <div className="mt-1">
                        {msg.aiConversation.conversationState === "HUMAN_HANDOFF" ? (
                          <Badge variant="destructive" className="bg-red-100 text-red-800 text-[10px]">Human Handoff</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-[10px]">AI Chat ({msg.aiConversation.messages?.length || 0})</Badge>
                        )}
                      </div>
                    )}
                    <Button variant="outline" className="w-full text-xs h-8" onClick={(e) => { e.stopPropagation(); openMessageDetail(msg); }}>
                      View message <Eye className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="border-t p-4 flex items-center justify-between bg-slate-50/50">
                <div className="text-sm text-slate-500">
                  Showing <span className="font-medium text-slate-900">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-medium text-slate-900">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-medium text-slate-900">{pagination.total}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={pagination.page <= 1}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNextPage} disabled={pagination.page >= pagination.pages}>
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <WhatsAppDetailDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen} 
        message={selectedMessage} 
      />
      <TestWhatsAppModal 
        open={testModalOpen}
        onOpenChange={setTestModalOpen}
      />
    </div>
  );
}
