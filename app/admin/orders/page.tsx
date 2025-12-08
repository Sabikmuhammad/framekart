"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface Order {
  _id: string;
  userId: string;
  items: Array<{
    frameId: string;
    title: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  paymentStatus: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  address: {
    fullName: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: status }),
      });

      const data = await res.json();

      if (data.success) {
        setOrders(
          orders.map((order) =>
            order._id === orderId
              ? { ...order, paymentStatus: status }
              : order
          )
        );
        toast({
          title: "Order updated",
          description: `Order status changed to ${status}`,
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update order",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div>
      <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold">All Orders</h1>
      
      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {orders.map((order) => (
            <Card key={order._id}>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-base sm:text-lg">Order #{order._id.slice(-8)}</span>
                  <span
                    className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full self-start ${
                      order.paymentStatus === "completed"
                        ? "bg-green-100 text-green-800"
                        : order.paymentStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Customer Details</h3>
                    <p className="text-xs sm:text-sm">
                      <strong>Name:</strong> {order.address.fullName}
                    </p>
                    <p className="text-xs sm:text-sm">
                      <strong>Phone:</strong> {order.address.phone}
                    </p>
                    <p className="text-xs sm:text-sm break-words">
                      <strong>Address:</strong> {order.address.addressLine1},{" "}
                      {order.address.city}, {order.address.state} -{" "}
                      {order.address.pincode}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Items</h3>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-xs sm:text-sm border-b pb-2 gap-2"
                        >
                          <span>
                            {item.title} x {item.quantity}
                          </span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-2 border-t gap-2">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Order Date: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      {order.razorpayOrderId && (
                        <p className="text-xs text-muted-foreground break-all">
                          Razorpay ID: {order.razorpayOrderId}
                        </p>
                      )}
                    </div>
                    <div className="sm:text-right">
                      <p className="text-base sm:text-lg font-bold">
                        Total: ₹{order.totalAmount}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => updateOrderStatus(order._id, "completed")}
                      className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-xs sm:text-sm"
                      disabled={order.paymentStatus === "completed"}
                    >
                      Mark Completed
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order._id, "failed")}
                      className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-xs sm:text-sm"
                      disabled={order.paymentStatus === "failed"}
                    >
                      Mark Failed
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
