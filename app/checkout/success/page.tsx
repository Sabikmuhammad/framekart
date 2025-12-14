"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Mail, ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams?.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCartStore();

  useEffect(() => {
    console.log('🎉 Success page loaded with orderId:', orderId);
    
    if (!orderId) {
      console.error('❌ No orderId provided, redirecting home');
      router.push("/");
      return;
    }

    console.log('📦 Fetching order details from API...');
    // Fetch order details
    fetch(`/api/orders/${orderId}`)
      .then((res) => {
        console.log('📡 API Response status:', res.status);
        return res.json();
      })
      .then((data) => {
        console.log('📊 Order data received:', data);
        
        if (data.success && data.data) {
          console.log('✅ Order found:', data.data._id);
          console.log('💳 Payment status:', data.data.paymentStatus);
          setOrder(data.data);
          
          // Clear cart ONLY if payment is completed
          if (data.data.paymentStatus === "completed") {
            console.log('🧹 Clearing cart...');
            
            // Clear Zustand store
            clearCart();
            console.log('✅ Zustand cart cleared');
            
            // Also clear localStorage directly as backup
            try {
              localStorage.removeItem("cart-storage");
              console.log('✅ localStorage cart cleared');
              
              // Verify cart is actually empty
              const cartCheck = localStorage.getItem("cart-storage");
              console.log('🔍 Cart check after clear:', cartCheck);
            } catch (error) {
              console.error("❌ Failed to clear cart from localStorage:", error);
            }
          } else {
            console.warn('⚠️ Payment not completed, cart NOT cleared. Status:', data.data.paymentStatus);
          }
        } else {
          console.error('❌ Order fetch failed:', data);
        }
      })
      .catch((error) => {
        console.error('❌ Error fetching order:', error);
      })
      .finally(() => {
        console.log('✅ Order fetch complete');
        setLoading(false);
      });
  }, [orderId, router, clearCart]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">
          We couldn&apos;t find your order. Please check your email for confirmation.
        </p>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your purchase
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-mono font-semibold text-sm sm:text-base">
                    #{orderId?.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Total</p>
                  <p className="font-semibold text-lg text-primary">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    {order.paymentStatus === "completed" ? "Paid" : order.paymentStatus}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                    {order.status || "Pending"}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Confirmation Email Sent</p>
                    <p className="text-sm text-muted-foreground">
                      Order confirmation has been sent to{" "}
                      <span className="font-medium text-foreground">
                        {order.customerEmail}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Delivery Address</p>
                <div className="text-sm text-muted-foreground">
                  <p>{order.address.fullName}</p>
                  <p>{order.address.addressLine1}</p>
                  {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                  <p>
                    {order.address.city}, {order.address.state} - {order.address.pincode}
                  </p>
                  <p className="mt-1">Phone: {order.address.phone}</p>
                </div>
              </div>

              <div className="pt-4 border-t bg-blue-50 dark:bg-blue-900/10 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  📦 Estimated Delivery
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                  Your order will be delivered within 5-7 business days
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link href={`/orders/${orderId}`} className="flex-1">
            <Button variant="default" className="w-full" size="lg">
              <Package className="w-4 h-4 mr-2" />
              View Order Details
            </Button>
          </Link>
          <Link href="/frames" className="flex-1">
            <Button variant="outline" className="w-full" size="lg">
              <Home className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <Card className="bg-muted/50">
            <CardContent className="py-6">
              <p className="text-sm text-muted-foreground">
                Need help with your order?{" "}
                <Link href="/contact" className="text-primary hover:underline font-medium">
                  Contact Support
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
