"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Loader2, Phone, Search, RefreshCw, Smartphone, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface VisitorLead {
  _id: string;
  visitorId: string;
  name?: string;
  phone: string;
  source: string;
  firstVisitedAt: string;
  lastVisitedAt: string;
  visitCount: number;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  createdAt: string;
  updatedAt: string;
}

// User Agent parser helper
function parseUserAgent(ua?: string) {
  if (!ua) return { device: "Unknown", browser: "Unknown" };

  let browser = "Unknown";
  let device = "Desktop";

  const lowerUA = ua.toLowerCase();

  // Browser check
  if (lowerUA.includes("firefox")) {
    browser = "Firefox";
  } else if (lowerUA.includes("opr") || lowerUA.includes("opera")) {
    browser = "Opera";
  } else if (lowerUA.includes("edg")) {
    browser = "Edge";
  } else if (lowerUA.includes("chrome") && !lowerUA.includes("chromium")) {
    browser = "Chrome";
  } else if (lowerUA.includes("safari") && !lowerUA.includes("chrome")) {
    browser = "Safari";
  }

  // Device check
  if (/mobile|android|iphone|ipad|phone/i.test(lowerUA)) {
    device = "Mobile";
    if (/ipad|tablet/i.test(lowerUA)) {
      device = "Tablet";
    }
  }

  return { device, browser };
}

export default function AdminVisitorTrackingPage() {
  const [leads, setLeads] = useState<VisitorLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { toast } = useToast();

  // Handle search debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const fetchLeads = async (searchQuery: string) => {
    try {
      setLoading(true);
      const url = searchQuery
        ? `/api/admin/visitor-tracking?search=${encodeURIComponent(searchQuery)}`
        : "/api/admin/visitor-tracking";

      const response = await fetch(url);
      const result = await response.json();

      if (response.ok && result.success) {
        setLeads(result.data);
      } else {
        throw new Error(result.error || "Failed to fetch leads");
      }
    } catch (error: any) {
      console.error("Fetch leads error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load visitor leads.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(debouncedSearch);
  }, [debouncedSearch]);

  const handleExportCSV = () => {
    if (leads.length === 0) {
      toast({
        title: "Export Failed",
        description: "No data available to export.",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Name", "Mobile Number", "First Visit", "Last Visit", "Visit Count", "Device", "Browser", "Source", "IP Address", "Referrer"];
    const rows = leads.map((lead) => {
      const { device, browser } = parseUserAgent(lead.userAgent);
      return [
        `"${lead.name || "N/A"}"`,
        `"${lead.phone}"`,
        `"${new Date(lead.firstVisitedAt).toLocaleString()}"`,
        `"${new Date(lead.lastVisitedAt).toLocaleString()}"`,
        lead.visitCount,
        `"${device}"`,
        `"${browser}"`,
        `"${lead.source}"`,
        `"${lead.ipAddress || "Unknown"}"`,
        `"${lead.referrer || "Direct"}"`,
      ];
    });

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `framekart_custom_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Leads exported to CSV successfully.",
    });
  };

  const handleExportExcel = () => {
    if (leads.length === 0) {
      toast({
        title: "Export Failed",
        description: "No data available to export.",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Name", "Mobile Number", "First Visit", "Last Visit", "Visit Count", "Device", "Browser", "Source", "IP Address", "Referrer"];
    const rows = leads.map((lead) => {
      const { device, browser } = parseUserAgent(lead.userAgent);
      return [
        lead.name || "N/A",
        lead.phone,
        new Date(lead.firstVisitedAt).toLocaleString(),
        new Date(lead.lastVisitedAt).toLocaleString(),
        lead.visitCount,
        device,
        browser,
        lead.source,
        lead.ipAddress || "Unknown",
        lead.referrer || "Direct",
      ];
    });

    // Create Excel XML Structure
    let xml = '<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Sheet1"><Table>';

    // Headers Row
    xml += '<Row>';
    headers.forEach((h) => {
      xml += `<Cell><Data ss:Type="String">${h}</Data></Cell>`;
    });
    xml += '</Row>';

    // Data Rows
    rows.forEach((r) => {
      xml += '<Row>';
      r.forEach((val) => {
        const type = typeof val === "number" ? "Number" : "String";
        // Clean values of special XML characters
        const cleanVal = typeof val === "string"
          ? val.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
          : val;
        xml += `<Cell><Data ss:Type="${type}">${cleanVal}</Data></Cell>`;
      });
      xml += '</Row>';
    });

    xml += '</Table></Worksheet></Workbook>';

    const blob = new Blob([xml], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `framekart_custom_leads_${Date.now()}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Leads exported to Excel successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Custom Frame Leads</h1>
          <p className="text-muted-foreground mt-1">
            Manage and export leads captured from the one-time custom frame phone collection experience.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleExportCSV} disabled={leads.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handleExportExcel} disabled={leads.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button onClick={() => fetchLeads(search)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads by name or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Loading visitor leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-4">
            <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg">No Leads Found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {search ? "No leads matched your search query. Try clearing or searching another term." : "No visitors have completed the Custom Frame onboarding flow yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Mobile Number</th>
                  <th className="px-6 py-4">First Visit</th>
                  <th className="px-6 py-4">Last Visit</th>
                  <th className="px-6 py-4 text-center">Visit Count</th>
                  <th className="px-6 py-4">Device</th>
                  <th className="px-6 py-4">Browser</th>
                  <th className="px-6 py-4">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leads.map((lead) => {
                  const { device, browser } = parseUserAgent(lead.userAgent);
                  return (
                    <motion.tr
                      key={lead._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">
                        {lead.name || (
                          <span className="text-muted-foreground italic text-xs">Not Provided</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-primary">
                        +91 {lead.phone}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs whitespace-nowrap">
                        {new Date(lead.firstVisitedAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs whitespace-nowrap">
                        {new Date(lead.lastVisitedAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 text-center font-semibold">
                        <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-blue-700 font-bold border border-blue-100">
                          {lead.visitCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          {device === "Mobile" || device === "Tablet" ? (
                            <Smartphone className="h-3.5 w-3.5" />
                          ) : (
                            <Laptop className="h-3.5 w-3.5" />
                          )}
                          {device}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs whitespace-nowrap">
                        {browser}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                          {lead.source}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
