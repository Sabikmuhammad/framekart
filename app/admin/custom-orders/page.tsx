"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Loader2, Package, RefreshCw, CheckCircle2, Clock, Truck, Box, Cake, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getOccasionBadgeColor, getOccasionDisplayName } from "@/lib/occasions";

interface CustomOrder {
  _id: string;
  userId: string;
  type: string;
  items: {
    title: string;
    price: number;
    imageUrl: string;
  }[];
  totalAmount: number;
  paymentStatus: string;
  address: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  customFrame: {
    imageUrl: string;
    frameStyle: string;
    frameSize: string;
    customerNotes?: string;
    occasion?: "custom" | "birthday" | "wedding";
    occasionMetadata?: {
      name?: string;
      age?: string;
      date?: string;
      message?: string;
      brideName?: string;
      groomName?: string;
      weddingDate?: string;
      quote?: string;
    };
  };
  status: "Pending" | "Processing" | "Printed" | "Shipped" | "Delivered";
  createdAt: string;
}

const STATUS_ICONS = {
  Pending: Clock,
  Processing: RefreshCw,
  Printed: CheckCircle2,
  Shipped: Truck,
  Delivered: Package,
};

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Processing: "bg-blue-100 text-blue-800 border-blue-200",
  Printed: "bg-purple-100 text-purple-800 border-purple-200",
  Shipped: "bg-orange-100 text-orange-800 border-orange-200",
  Delivered: "bg-green-100 text-green-800 border-green-200",
};

export default function AdminCustomOrdersPage() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/custom-frame-order");
      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error("Fetch orders error:", error);
      toast({
        title: "Error",
        description: "Failed to load custom orders.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(orderId);

      const response = await fetch(`/api/custom-frame-order/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus as any } : order
          )
        );
        toast({
          title: "Status Updated",
          description: `Order status changed to ${newStatus}`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error("Update status error:", error);
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDownloadImage = (imageUrl: string, orderId: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `custom-frame-${orderId}.jpg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading custom orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Custom Frame Orders</h1>
              <p className="text-gray-600">Manage and track all custom frame orders</p>
            </div>
            <Button
              onClick={fetchOrders}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {["Pending", "Processing", "Printed", "Shipped", "Delivered"].map((status) => {
            const count = orders.filter((o) => o.status === status).length;
            const Icon = STATUS_ICONS[status as keyof typeof STATUS_ICONS];
            return (
              <motion.div
                key={status}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{status}</p>
                    <p className="text-3xl font-bold text-gray-900">{count}</p>
                  </div>
                  <Icon className="w-8 h-8 text-gray-400" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl shadow-xl p-12 text-center"
          >
            <Box className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Custom Orders Yet</h3>
            <p className="text-gray-600">Custom frame orders will appear here once customers place them.</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => {
              const StatusIcon = STATUS_ICONS[order.status];
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
                >
                  <div className="p-6 lg:p-8">
                    <div className="grid lg:grid-cols-12 gap-6">
                      {/* Image Preview */}
                      <div className="lg:col-span-3">
                        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg group">
                          {order.customFrame.imageUrl ? (
                            <>
                              <img
                                src={order.customFrame.imageUrl}
                                alt="Customer upload"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                <Button
                                  onClick={() => handleDownloadImage(order.customFrame.imageUrl, order._id)}
                                  className="bg-white text-gray-900 hover:bg-gray-100"
                                  size="sm"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 flex items-center justify-center border-2 border-dashed border-blue-300 dark:border-blue-700">
                              <div className="text-center p-6">
                                <Sparkles className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Awaiting Design</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">FrameKart team will finalize</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="lg:col-span-5 space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <h3 className="text-xl font-bold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[order.status]}`}>
                              <StatusIcon className="w-3 h-3 inline mr-1" />
                              {order.status}
                            </span>
                            {order.customFrame.occasion && (
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${getOccasionBadgeColor(order.customFrame.occasion)}`}>
                                {order.customFrame.occasion === "birthday" && <Cake className="w-3 h-3" />}
                                {order.customFrame.occasion === "wedding" && <Heart className="w-3 h-3" />}
                                {order.customFrame.occasion === "custom" && <Sparkles className="w-3 h-3" />}
                                {getOccasionDisplayName(order.customFrame.occasion)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Frame Size</p>
                            <p className="font-semibold text-gray-900">{order.customFrame.frameSize}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Frame Style</p>
                            <p className="font-semibold text-gray-900">{order.customFrame.frameStyle}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                            <p className="font-semibold text-gray-900">₹{order.totalAmount}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Payment</p>
                            <p className="font-semibold text-gray-900 capitalize">{order.paymentStatus}</p>
                          </div>
                        </div>

                        {order.customFrame.customerNotes && (
                          <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs text-gray-500 mb-1">Customer Notes</p>
                            <p className="text-sm text-gray-700">{order.customFrame.customerNotes}</p>
                          </div>
                        )}

                        {/* Occasion-Specific Details */}
                        {order.customFrame.occasionMetadata && (
                          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Occasion Details</p>
                            <div className="space-y-1 text-sm">
                              {order.customFrame.occasion === "birthday" && (
                                <>
                                  {order.customFrame.occasionMetadata.name && (
                                    <p><span className="text-gray-600">Name:</span> <span className="font-semibold text-gray-900">{order.customFrame.occasionMetadata.name}</span></p>
                                  )}
                                  {order.customFrame.occasionMetadata.age && (
                                    <p><span className="text-gray-600">Age:</span> <span className="font-semibold text-gray-900">{order.customFrame.occasionMetadata.age}</span></p>
                                  )}
                                  {order.customFrame.occasionMetadata.date && (
                                    <p><span className="text-gray-600">Date:</span> <span className="font-semibold text-gray-900">{new Date(order.customFrame.occasionMetadata.date).toLocaleDateString()}</span></p>
                                  )}
                                  {order.customFrame.occasionMetadata.message && (
                                    <p className="mt-2 pt-2 border-t border-blue-200"><span className="text-gray-600">Message:</span> <span className="text-gray-900 italic">{order.customFrame.occasionMetadata.message}</span></p>
                                  )}
                                </>
                              )}
                              {order.customFrame.occasion === "wedding" && (
                                <>
                                  {order.customFrame.occasionMetadata.brideName && (
                                    <p><span className="text-gray-600">Bride:</span> <span className="font-semibold text-gray-900">{order.customFrame.occasionMetadata.brideName}</span></p>
                                  )}
                                  {order.customFrame.occasionMetadata.groomName && (
                                    <p><span className="text-gray-600">Groom:</span> <span className="font-semibold text-gray-900">{order.customFrame.occasionMetadata.groomName}</span></p>
                                  )}
                                  {order.customFrame.occasionMetadata.weddingDate && (
                                    <p><span className="text-gray-600">Wedding Date:</span> <span className="font-semibold text-gray-900">{new Date(order.customFrame.occasionMetadata.weddingDate).toLocaleDateString()}</span></p>
                                  )}
                                  {order.customFrame.occasionMetadata.quote && (
                                    <p className="mt-2 pt-2 border-t border-rose-200"><span className="text-gray-600">Quote:</span> <span className="text-gray-900 italic">{order.customFrame.occasionMetadata.quote}</span></p>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Customer Info & Actions */}
                      <div className="lg:col-span-4 space-y-4">
                        <div className="bg-gray-50 rounded-2xl p-5">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Customer Information</h4>
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-900 font-medium">{order.address.fullName}</p>
                            <p className="text-gray-600">{order.address.phone}</p>
                            <p className="text-gray-600">
                              {order.address.addressLine1}
                              {order.address.addressLine2 && `, ${order.address.addressLine2}`}
                            </p>
                            <p className="text-gray-600">
                              {order.address.city}, {order.address.state} - {order.address.pincode}
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Update Status
                          </label>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            disabled={updatingStatus === order._id}
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 font-medium disabled:opacity-50"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Printed">Printed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                          {updatingStatus === order._id && (
                            <p className="text-xs text-blue-600 mt-2 flex items-center">
                              <Loader2 className="w-3 h-3 animate-spin mr-1" />
                              Updating...
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
