"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Package } from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold">My Profile</h1>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-semibold">{user?.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-24 animate-pulse rounded bg-muted"
                    />
                  ))}
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <Link
                      key={order._id}
                      href={`/orders/${order._id}`}
                      className="block"
                    >
                      <Card className="transition-shadow hover:shadow-md">
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold text-sm sm:text-base">
                                Order #{order._id.slice(-8)}
                              </p>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-xs sm:text-sm">
                                {order.items.length} item(s) •{" "}
                                {formatPrice(order.totalAmount)}
                              </p>
                            </div>
                            <div className="self-start sm:self-center">
                              <span
                                className={`rounded-full px-2 sm:px-3 py-1 text-xs whitespace-nowrap ${
                                  order.paymentStatus === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : order.paymentStatus === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {order.paymentStatus}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
