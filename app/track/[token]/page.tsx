"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Loader2, Package, Truck, CheckCircle2, AlertCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TrackOrderPage() {
  const { token } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/track/${token}`);
        const data = await res.json();
        
        if (data.success) {
          setOrder(data.data);
        } else {
          setError(data.error || "Failed to load order");
        }
      } catch (err) {
        setError("Network error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrder();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground animate-pulse">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-red-500 mb-4 bg-red-50 dark:bg-red-950/20 p-4 rounded-full">
          <AlertCircle className="h-12 w-12" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-center">Order Not Found</h1>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          {error || "We couldn't find an order matching this tracking link. The link might be invalid or expired."}
        </p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }

  // Determine status color and icon
  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { color: 'bg-yellow-500', icon: <Package className="h-5 w-5" />, text: 'Order Placed' };
      case 'processing':
        return { color: 'bg-blue-500', icon: <Package className="h-5 w-5" />, text: 'Processing' };
      case 'shipped':
        return { color: 'bg-purple-500', icon: <Truck className="h-5 w-5" />, text: 'Shipped' };
      case 'delivered':
        return { color: 'bg-green-500', icon: <CheckCircle2 className="h-5 w-5" />, text: 'Delivered' };
      case 'cancelled':
        return { color: 'bg-red-500', icon: <AlertCircle className="h-5 w-5" />, text: 'Cancelled' };
      default:
        return { color: 'bg-gray-500', icon: <Package className="h-5 w-5" />, text: status };
    }
  };

  const statusDisplay = getStatusDisplay(order.status);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Track Order</h1>
          <p className="text-muted-foreground mt-1">Order #{order.orderNumber}</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center justify-between">
                Order Status
                <Badge className={`${statusDisplay.color} text-white border-none flex items-center gap-1.5 px-3 py-1`}>
                  {statusDisplay.icon}
                  {statusDisplay.text}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6 bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-100 dark:border-slate-800">
                <div className="text-sm text-muted-foreground mb-1">Delivering to</div>
                <div className="font-medium text-lg">{order.customerName}</div>
                <div className="text-muted-foreground flex items-center gap-2 mt-1">
                  <Truck className="h-4 w-4" />
                  {order.shippingLocation}
                </div>
              </div>

              <h3 className="font-semibold mb-4 text-lg">Items</h3>
              <div className="space-y-4">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                    <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden flex-shrink-0 relative">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="h-8 w-8 text-slate-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <p className="font-medium">{item.title}</p>
                      <div className="flex justify-between items-end mt-2">
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal || order.totalAmount)}</span>
              </div>
              
              {order.discount && order.discount.amount > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount.amount)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : formatPrice(order.shipping || 0)}</span>
              </div>
              
              <div className="pt-3 border-t flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatPrice(order.totalAmount)}</span>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Payment Status</span>
                <Badge variant={order.paymentStatus === 'completed' ? 'default' : 'outline'} className={order.paymentStatus === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''}>
                  {order.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
