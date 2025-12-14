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
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.primaryEmailAddress?.emailAddress || "",
    fullName: user?.fullName || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Handle redirects and payment errors
  React.useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    
    if (items.length === 0 && !paymentInitiated) {
      // Only redirect if payment hasn't been initiated
      router.push("/cart");
      return;
    }

    // Check for payment error from callback redirect
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    
    if (error) {
      let errorMessage = "Payment failed. Please try again.";
      
      if (error === "payment_failed") {
        errorMessage = "Payment was not completed. Please try again.";
      } else if (error === "verification_failed") {
        errorMessage = "Payment verification failed. Please contact support if amount was deducted.";
      } else if (error === "missing_order_id") {
        errorMessage = "Invalid order. Please try again.";
      }
      
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Reset states to allow retry
      setPaymentInitiated(false);
      setProcessingPayment(false);
      setLoading(false);
      
      // Clean URL
      window.history.replaceState({}, "", "/checkout");
    }
  }, [isSignedIn, items.length, router, paymentInitiated, toast]);

  // Show loading state while checking authentication/cart
  if (!isSignedIn || (items.length === 0 && !paymentInitiated)) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    // Prevent double submission
    if (loading || processingPayment || paymentInitiated) {
      return;
    }

    // Validate required fields
    if (!formData.email || !formData.fullName || !formData.phone || !formData.addressLine1 || 
        !formData.city || !formData.state || !formData.pincode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including email",
        variant: "destructive",
      });
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number
    if (formData.phone.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setProcessingPayment(true);
    setPaymentInitiated(true);

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
            customerEmail: formData.email,
            imageUrl: customItem.customFrame?.uploadedImageUrl,
            frameStyle: customItem.customFrame?.frameStyle,
            frameSize: customItem.customFrame?.frameSize,
            customerNotes: customItem.customFrame?.customerNotes || "",
            totalAmount: getTotalPrice() + (getTotalPrice() > 2000 ? 0 : 99),
            address: {
              fullName: formData.fullName,
              phone: formData.phone,
              addressLine1: formData.addressLine1,
              addressLine2: formData.addressLine2,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
            },
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
            customerEmail: formData.email,
            items: items.map((item) => ({
              productId: item._id,
              title: item.title,
              price: item.price,
              quantity: item.quantity,
              imageUrl: item.imageUrl,
            })),
            totalAmount: getTotalPrice() + (getTotalPrice() > 2000 ? 0 : 99),
            address: {
              fullName: formData.fullName,
              phone: formData.phone,
              addressLine1: formData.addressLine1,
              addressLine2: formData.addressLine2,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
            },
          }),
        });

        orderData = await orderRes.json();
        if (!orderData.success) {
          console.error("Order creation failed:", orderData);
          const errorMsg = orderData.validationErrors 
            ? `Validation error: ${orderData.validationErrors.map((e: any) => e.message).join(', ')}`
            : orderData.error || "Order creation failed";
          throw new Error(errorMsg);
        }
      }

      // Create Cashfree order
      console.log('💳 Creating Cashfree payment session...');
      const cashfreePayload = {
        amount: getTotalPrice() + (getTotalPrice() > 2000 ? 0 : 99),
        customerPhone: formData.phone,
        customerEmail: user.primaryEmailAddress?.emailAddress || formData.email,
        customerName: formData.fullName,
        orderId: orderData.data._id,
      };
      console.log('📦 Cashfree payload:', cashfreePayload);

      const cashfreeRes = await fetch("/api/cashfree/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cashfreePayload),
      });

      const cashfreeData = await cashfreeRes.json();
      console.log('📡 Cashfree response:', cashfreeData);
      
      if (!cashfreeData.success) {
        console.error("❌ Cashfree order creation failed:", cashfreeData);
        throw new Error(cashfreeData.error || cashfreeData.details || "Cashfree order creation failed");
      }
      
      console.log('✅ Cashfree session created:', cashfreeData.data.payment_session_id);

      // Load Cashfree script
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      document.body.appendChild(script);

      script.onload = async () => {
        try {
          console.log('📜 Cashfree script loaded');
          const cashfreeMode = "sandbox"; // Use sandbox for testing
          
          console.log('🔧 Initializing Cashfree with mode:', cashfreeMode);
          const cashfree = await window.Cashfree({
            mode: cashfreeMode,
          });

          const checkoutOptions = {
            paymentSessionId: cashfreeData.data.payment_session_id,
            redirectTarget: "_self",
          };
          
          console.log('🚀 Opening Cashfree checkout with session:', cashfreeData.data.payment_session_id);
          console.log('📌 Order ID stored for callback:', orderData.data._id);

          // Payment gateway will redirect after completion
          // Do NOT clear cart here - only clear on success page
          await cashfree.checkout(checkoutOptions);
          // If we reach here, user is being redirected to Cashfree
          console.log('✅ Cashfree checkout initiated, user will be redirected...');
          // Keep loading state active
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
          setProcessingPayment(false);
          setPaymentInitiated(false);
        }
      };

      script.onerror = () => {
        toast({
          title: "Script Load Error",
          description: "Failed to load Cashfree payment script",
          variant: "destructive",
        });
        setLoading(false);
        setProcessingPayment(false);
        setPaymentInitiated(false);
      };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      setProcessingPayment(false);
      setPaymentInitiated(false);
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
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={!!user?.primaryEmailAddress?.emailAddress}
                  />
                  <p className="text-xs text-muted-foreground">
                    Order confirmation will be sent to this email
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
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
              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-3 pb-3 border-b last:border-b-0">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
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
                disabled={loading || processingPayment || paymentInitiated}
                className="mt-4 sm:mt-6 w-full"
                size="lg"
              >
                {processingPayment || paymentInitiated ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    {paymentInitiated ? "Redirecting to payment..." : "Processing Payment..."}
                  </span>
                ) : loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Please wait...
                  </span>
                ) : (
                  "Proceed to Payment"
                )}
              </Button>
              
              <p className="mt-3 text-xs text-center text-muted-foreground">
                {paymentInitiated ? "Redirecting you to secure payment gateway..." : "You'll be redirected to our secure payment gateway"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
