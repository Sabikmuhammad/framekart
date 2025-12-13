"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

declare global {
  interface Window {
    Cashfree: any;
  }
}

export default function CheckoutPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Handle redirects in useEffect to avoid SSR issues
  React.useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
    } else if (items.length === 0) {
      router.push("/cart");
    }
  }, [isSignedIn, items.length, router]);

  // Show loading state while checking authentication/cart
  if (!isSignedIn || items.length === 0) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    // Validate required fields
    if (!formData.fullName || !formData.phone || !formData.addressLine1 || 
        !formData.city || !formData.state || !formData.pincode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number (should be 10 digits)
    if (!/^\d{10}$/.test(formData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Check if cart contains custom frames
      const hasCustomFrames = items.some(item => item.isCustom);
      
      let orderData;

      if (hasCustomFrames && items.length === 1 && items[0].isCustom) {
        // Custom frame order
        const customItem = items[0];
        const orderRes = await fetch("/api/custom-frame-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: customItem.customFrame?.uploadedImageUrl,
            frameStyle: customItem.customFrame?.frameStyle,
            frameSize: customItem.customFrame?.frameSize,
            customerNotes: customItem.customFrame?.customerNotes || "",
            totalAmount: getTotalPrice() + (getTotalPrice() > 2000 ? 0 : 99),
            address: formData,
          }),
        });

        orderData = await orderRes.json();
        if (!orderData.success) throw new Error("Order creation failed");
      } else {
        // Regular order
        const orderRes = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((item) => ({
              productId: item._id,
              title: item.title,
              price: item.price,
              quantity: item.quantity,
              imageUrl: item.imageUrl,
            })),
            totalAmount: getTotalPrice() + (getTotalPrice() > 2000 ? 0 : 99),
            address: formData,
          }),
        });

        orderData = await orderRes.json();
        if (!orderData.success) throw new Error("Order creation failed");
      }

      // Create Cashfree order
      const cashfreePayload = {
        amount: getTotalPrice() + (getTotalPrice() > 2000 ? 0 : 99),
        customerPhone: formData.phone,
        customerEmail: user.primaryEmailAddress?.emailAddress || "",
        customerName: formData.fullName,
        orderId: orderData.data._id,
      };

      const cashfreeRes = await fetch("/api/cashfree/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cashfreePayload),
      });

      const cashfreeData = await cashfreeRes.json();
      
      if (!cashfreeData.success) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Cashfree order creation failed:", cashfreeData);
        }
        throw new Error(cashfreeData.error || cashfreeData.details || "Cashfree order creation failed");
      }

      // Load Cashfree script
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      document.body.appendChild(script);

      script.onload = async () => {
        try {
          const cashfreeMode = "sandbox"; // Use sandbox for testing
          
          const cashfree = await window.Cashfree({
            mode: cashfreeMode,
          });

          const checkoutOptions = {
            paymentSessionId: cashfreeData.data.payment_session_id,
            redirectTarget: "_self",
          };

          await cashfree.checkout(checkoutOptions);
        } catch (err: any) {
          if (process.env.NODE_ENV === 'development') {
            console.error("Cashfree checkout error:", err);
          }
          toast({
            title: "Payment Error",
            description: err.message || "Failed to open payment page",
            variant: "destructive",
          });
          setLoading(false);
        }
      };

      script.onerror = () => {
        toast({
          title: "Script Load Error",
          description: "Failed to load Cashfree payment script",
          variant: "destructive",
        });
        setLoading(false);
      };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold">Checkout</h1>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="addressLine1">Address Line 1</Label>
                  <Input
                    id="addressLine1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="lg:sticky lg:top-20">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm sm:text-base">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal ({items.length} items)
                  </span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {getTotalPrice() > 2000 ? "Free" : formatPrice(99)}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatPrice(
                        getTotalPrice() + (getTotalPrice() > 2000 ? 0 : 99)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={loading}
                className="mt-4 sm:mt-6 w-full"
                size="lg"
              >
                {loading ? "Processing..." : "Pay Now"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
