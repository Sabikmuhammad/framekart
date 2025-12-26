"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, Clock, XCircle, Instagram, Heart } from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setOrder(data.data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Order not found</p>
      </div>
    );
  }

  const getOrderStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: JSX.Element }> = {
      Delivered: { color: "text-green-600", icon: <CheckCircle2 className="h-6 w-6 text-green-600" /> },
      Shipped: { color: "text-blue-600", icon: <CheckCircle2 className="h-6 w-6 text-blue-600" /> },
      Processing: { color: "text-yellow-600", icon: <Clock className="h-6 w-6 text-yellow-600" /> },
      Printed: { color: "text-yellow-600", icon: <Clock className="h-6 w-6 text-yellow-600" /> },
      Pending: { color: "text-gray-600", icon: <Clock className="h-6 w-6 text-gray-600" /> },
    };
    return statusConfig[status] || statusConfig.Pending;
  };

  const getStatusTimeline = () => {
    const statuses = ["Pending", "Processing", "Printed", "Shipped", "Delivered"];
    const currentStatus = order.status || "Pending";
    const currentIndex = statuses.indexOf(currentStatus);

    return statuses.map((status, index) => {
      const isCompleted = index <= currentIndex;
      const isCurrent = index === currentIndex;
      
      return {
        status,
        isCompleted,
        isCurrent,
        icon: isCompleted ? CheckCircle2 : Clock,
      };
    });
  };

  const paymentStatusIcon = {
    completed: <CheckCircle2 className="h-5 w-5 text-green-600" />,
    pending: <Clock className="h-5 w-5 text-yellow-600" />,
    failed: <XCircle className="h-5 w-5 text-red-600" />,
  };

  const orderStatus = order.status || "Pending";
  const statusInfo = getOrderStatusBadge(orderStatus);
  const timeline = getStatusTimeline();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Order Details</h1>
        <p className="text-muted-foreground">Order ID: {order._id}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Current Status Display */}
                <div className="flex items-center gap-3">
                  {statusInfo.icon}
                  <div>
                    <p className="font-semibold text-lg">
                      {orderStatus}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ordered on{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-semibold mb-4 text-muted-foreground">Order Progress</h3>
                  <div className="space-y-4">
                    {timeline.map((item, index) => (
                      <div key={item.status} className="flex items-start gap-3">
                        {/* Icon and Line */}
                        <div className="flex flex-col items-center">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                            item.isCompleted 
                              ? "bg-green-100 border-green-600 text-green-600" 
                              : "bg-gray-100 border-gray-300 text-gray-400"
                          }`}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          {index < timeline.length - 1 && (
                            <div className={`w-0.5 h-12 ${
                              item.isCompleted ? "bg-green-600" : "bg-gray-300"
                            }`} />
                          )}
                        </div>

                        {/* Status Text */}
                        <div className="flex-1 pt-1">
                          <p className={`font-medium ${
                            item.isCurrent 
                              ? "text-green-600" 
                              : item.isCompleted 
                              ? "text-gray-900" 
                              : "text-gray-400"
                          }`}>
                            {item.status}
                          </p>
                          {item.isCurrent && (
                            <p className="text-xs text-muted-foreground mt-0.5">Current status</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Status */}
                <div className="pt-3 border-t">
                  <div className="flex items-center gap-2">
                    {paymentStatusIcon[order.paymentStatus as keyof typeof paymentStatusIcon]}
                    <span className="text-sm">
                      Payment: <span className="font-medium capitalize">{order.paymentStatus}</span>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                      <p className="font-semibold text-primary">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-semibold">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
                {order.paymentId && (
                  <div className="border-t pt-2">
                    <p className="text-xs text-muted-foreground">
                      Payment ID: {order.paymentId}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p className="font-semibold">{order.address.fullName}</p>
                <p className="text-muted-foreground">{order.address.phone}</p>
                <p className="mt-2 text-muted-foreground">
                  {order.address.addressLine1}
                  {order.address.addressLine2 && (
                    <>
                      <br />
                      {order.address.addressLine2}
                    </>
                  )}
                  <br />
                  {order.address.city}, {order.address.state}
                  <br />
                  {order.address.pincode}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Instagram Follow Section */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-orange-950/20">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 rounded-full blur-lg opacity-50"></div>
                  <div className="relative bg-white dark:bg-gray-900 rounded-full p-3">
                    <Instagram className="h-8 w-8 text-pink-600" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                Follow Us on Instagram!
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4">
                Get inspired by our latest designs, exclusive offers, and customer frames. Join our community!
              </p>
              
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white border-0"
                onClick={() => window.open('https://www.instagram.com/framekart.co.in', '_blank')}
              >
                <Instagram className="mr-2 h-4 w-4" />
                Follow @framekart.co.in
              </Button>
              
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Heart className="h-3 w-3 fill-pink-500 text-pink-500" />
                <span>Join 10,000+ happy customers</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
