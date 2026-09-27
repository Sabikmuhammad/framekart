"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Search, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminBulkOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/bulk-orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch bulk orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-gray-100 text-gray-800";
      case "SUBMITTED": return "bg-blue-100 text-blue-800";
      case "UNDER_REVIEW": return "bg-orange-100 text-orange-800";
      case "QUOTE_SENT": return "bg-purple-100 text-purple-800";
      case "PAID": return "bg-green-100 text-green-800";
      case "SHIPPED": return "bg-indigo-100 text-indigo-800";
      case "DELIVERED": return "bg-emerald-100 text-emerald-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter(o => 
    o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.organisation?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bulk Orders</h1>
          <p className="text-muted-foreground mt-1">Manage B2B, event, and corporate bulk orders.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="flex items-center space-x-2 max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground absolute ml-3" />
        <Input 
          placeholder="Search by ID, Customer, Organisation..." 
          className="pl-9"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="p-4 font-medium">Order ID</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Customer</th>
                    <th className="p-4 font-medium">Type</th>
                    <th className="p-4 font-medium">Qty</th>
                    <th className="p-4 font-medium">Amount</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-muted-foreground">
                        No bulk orders found.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-medium">{order.orderNumber || order._id.slice(-6).toUpperCase()}</td>
                        <td className="p-4 whitespace-nowrap">
                          {format(new Date(order.createdAt), "dd MMM yyyy")}
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-gray-900">{order.customer.firstName} {order.customer.lastName}</p>
                          <p className="text-xs text-muted-foreground">{order.organisation?.name || order.customer.phone}</p>
                        </td>
                        <td className="p-4 flex flex-col gap-1 items-start">
                          <Badge variant="outline">{order.orderType}</Badge>
                          {order.items?.some((i: any) => i.type === 'CUSTOM_PHOTO') && (
                            <Badge variant="secondary" className="text-[10px] bg-purple-50 text-purple-700">Custom Photos</Badge>
                          )}
                        </td>
                        <td className="p-4">{order.totalQuantity}</td>
                        <td className="p-4 font-medium">{formatPrice(order.pricing.finalTotal)}</td>
                        <td className="p-4">
                          <Badge className={`${getStatusColor(order.status)} hover:${getStatusColor(order.status)} border-0`}>
                            {order.status.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" className="h-8 gap-1">
                            <Edit className="h-3 w-3" /> View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
