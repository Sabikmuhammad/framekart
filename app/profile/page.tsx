"use client";

import { useUser, UserProfile } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Package, FileText, Truck, RotateCcw, Shield, Lock, ChevronRight, User, Settings } from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders/user")
      .then((res) => res.json())
      .then((data) => {
        console.log("Orders API response:", data);
        if (data.success) {
          setOrders(data.data);
          console.log("Orders loaded:", data.data.length);
        } else {
          console.error("Failed to fetch orders:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const policyLinks = [
    { href: "/shipping-policy", label: "Shipping Policy", icon: Truck, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { href: "/return-policy", label: "Return Policy", icon: RotateCcw, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
    { href: "/terms", label: "Terms & Conditions", icon: FileText, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { href: "/privacy", label: "Privacy Policy", icon: Lock, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Profile
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage your account settings and view your order history
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Left Column: Profile & Settings */}
          <div className="space-y-4 sm:space-y-6">
            {/* User Info Card */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
                  {user?.imageUrl ? (
                    <img 
                      src={user.imageUrl} 
                      alt={user.fullName || "Profile"} 
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full ring-4 ring-white dark:ring-gray-800 shadow-md flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <User className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                      {user?.fullName || "User"}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings Card */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 sm:px-6">
                <div className="w-full max-h-[400px] sm:max-h-[500px] overflow-y-auto rounded-lg shadow-inner bg-gray-50 dark:bg-gray-900 p-1 sm:p-2">
                  <UserProfile 
                    routing="hash"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-0 rounded-lg bg-white dark:bg-gray-800",
                        navbar: "hidden",
                        pageScrollBox: "p-2 sm:p-4",
                        profileSectionTitle: "text-sm sm:text-base font-semibold",
                        formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm sm:text-base",
                        formFieldLabel: "text-xs sm:text-sm",
                        formFieldInput: "text-sm sm:text-base",
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Policies Section */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Policies & Legal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {policyLinks.map((policy) => (
                    <Link
                      key={policy.href}
                      href={policy.href}
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${policy.bg} flex items-center justify-center ${policy.color} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          <policy.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {policy.label}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order History (2 columns on desktop) */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-24 sm:h-28 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"
                      />
                    ))}
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.map((order: any) => (
                      <Link
                        key={order._id}
                        href={`/orders/${order._id}`}
                        className="block group"
                      >
                        <div className="p-3 sm:p-4 lg:p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800">
                          <div className="flex items-center justify-between gap-2 sm:gap-3">
                            <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                                  #{order._id.slice(-8).toUpperCase()}
                                </p>
                                <span
                                  className={`rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold ${
                                    (order.status === "Delivered" || order.status === "Shipped")
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                      : (order.status === "Processing" || order.status === "Printed")
                                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                      : order.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                      : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                                  }`}
                                >
                                  {order.status || "Pending"}
                                </span>
                                {order.paymentStatus === "completed" && (
                                  <span className="rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                    Paid
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-gray-400" />
                                <span className="text-[10px] sm:text-sm">{new Date(order.createdAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}</span>
                              </div>
                              <p className="text-base sm:text-lg font-bold text-primary">
                                {formatPrice(order.totalAmount)}
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-hover:text-primary group-hover:translate-x-2 transition-all flex-shrink-0" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 sm:py-16 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Package className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                    </div>
                    <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1">No orders yet</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 px-4">
                      Start shopping to see your orders here
                    </p>
                    <Link href="/frames">
                      <button className="px-5 py-2 sm:px-6 sm:py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm sm:text-base">
                        Browse Frames
                      </button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
