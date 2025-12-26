"use client";

import React, { useState, useEffect as reactUseEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { calculateOrderTotalClient } from "@/lib/launchOfferClient";
import { Tag, MapPin, Building2, Home } from "lucide-react";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

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
  const [eligibility, setEligibility] = useState({
    eligible: true,
    discountValue: 15,
    offerActive: true,
  });
  const [formData, setFormData] = useState({
    email: user?.primaryEmailAddress?.emailAddress || "",
    fullName: user?.fullName || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Fetch eligibility on mount
  reactUseEffect(() => {
    const fetchEligibility = async () => {
      try {
        const response = await fetch("/api/offers/eligibility");
        const data = await response.json();
        console.log("Checkout eligibility data:", data);
        if (data.success) {
          setEligibility({
            eligible: data.eligible || true,
            discountValue: data.discountValue || 15,
            offerActive: data.offerActive || true,
          });
        }
      } catch (error) {
        console.error("Error fetching eligibility:", error);
        // Default to showing offer
        setEligibility({
          eligible: true,
          discountValue: 15,
          offerActive: true,
        });
      }
    };
    
    fetchEligibility();
  }, [isSignedIn]);

  // Calculate pricing with discount (client-side for display only)
  const subtotal = getTotalPrice();
  const { discount, shipping, total } = calculateOrderTotalClient(
    subtotal,
    eligibility.discountValue,
    eligibility.eligible && eligibility.offerActive
  );

  // Handle redirects and payment errors
  reactUseEffect(() => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      // Check if cart contains custom frames or template frames
      const hasCustomFrames = items.some(item => item.isCustom);
      const hasTemplateFrames = items.some(item => item.isTemplate);
      
      let orderData;

      if (hasTemplateFrames && items.length === 1 && items[0].isTemplate) {
        // Template frame order (Birthday/Wedding)
        const templateItem = items[0];
        const orderRes = await fetch("/api/template-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerEmail: formData.email,
            occasion: templateItem.templateFrame?.occasion,
            templateImage: templateItem.templateFrame?.templateImage,
            uploadedPhoto: templateItem.templateFrame?.uploadedPhoto || "",
            frameStyle: templateItem.templateFrame?.frameStyle,
            metadata: templateItem.templateFrame?.metadata,
            price: templateItem.price,
            totalAmount: total,
            subtotal,
            shipping,
            ...(eligibility.offerActive && eligibility.eligible && discount > 0 && {
              discount: {
                name: "Launch Offer",
                type: "PERCENT",
                value: eligibility.discountValue,
                amount: discount,
              },
            }),
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
      } else if (hasCustomFrames && items.length === 1 && items[0].isCustom) {
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
            occasion: customItem.customFrame?.occasion || "custom",
            occasionMetadata: customItem.customFrame?.occasionMetadata || {},
            totalAmount: total,
            subtotal,
            shipping,
            ...(eligibility.offerActive && eligibility.eligible && discount > 0 && {
              discount: {
                name: "Launch Offer",
                type: "PERCENT",
                value: eligibility.discountValue,
                amount: discount,
              },
            }),
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
            totalAmount: total,
            subtotal,
            shipping,
            ...(eligibility.offerActive && eligibility.eligible && discount > 0 && {
              discount: {
                name: "Launch Offer",
                type: "PERCENT",
                value: eligibility.discountValue,
                amount: discount,
              },
            }),
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

      // ===== Create Cashfree Payment Session =====
      console.log('💳 Creating Cashfree payment session...');
      const cashfreePayload = {
        amount: total,
        customerPhone: formData.phone,
        customerEmail: formData.email,
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
      console.log('📡 Cashfree API response:', cashfreeData);
      
      if (!cashfreeData.success) {
        console.error("❌ Cashfree order creation failed:", cashfreeData);
        throw new Error(cashfreeData.error || "Failed to initialize payment");
      }
      
      const paymentSessionId = cashfreeData.data.payment_session_id;
      
      if (!paymentSessionId) {
        console.error("❌ No payment_session_id in response");
        throw new Error("Invalid payment session");
      }
      
      console.log('✅ Payment session ID received:', paymentSessionId);

      // ===== Load and Initialize Cashfree SDK =====
      // Check if script is already loaded
      if (!window.Cashfree) {
        console.log('📜 Loading Cashfree SDK...');
        const script = document.createElement("script");
        script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
          document.body.appendChild(script);
        });
        
        console.log('✅ Cashfree SDK loaded');
      }

      // ===== Initialize Cashfree with Environment Mode =====
      // IMPORTANT: SDK mode must match backend environment
      const cashfreeMode = process.env.NEXT_PUBLIC_CASHFREE_ENV || "sandbox";
      console.log('🔧 Initializing Cashfree SDK with mode:', cashfreeMode);
      
      const cashfree = await window.Cashfree({
        mode: cashfreeMode, // "sandbox" or "production"
      });

      // ===== Open Checkout Modal =====
      const checkoutOptions = {
        paymentSessionId: paymentSessionId,
        returnUrl: `${window.location.origin}/api/cashfree/callback?db_order_id=${orderData.data._id}`,
      };
      
      console.log('🚀 Opening Cashfree checkout...');
      console.log('📋 Order ID:', orderData.data._id);
      console.log('🔑 Session ID:', paymentSessionId);
      
      // Open checkout - this returns a promise that resolves/rejects based on user action
      const result = await cashfree.checkout(checkoutOptions);
      
      console.log('💳 Checkout result:', result);
      
      // Handle the result
      if (result.error) {
        // Payment failed or was cancelled by user
        console.error('❌ Checkout error:', result.error);
        throw new Error(result.error.message || "Payment failed");
      }
      
      if (result.redirect) {
        // User will be redirected - keep loading state
        console.log('🔄 Redirecting to callback...');
        // Don't reset loading state - user is being redirected
        return;
      }
      
      // Payment completed - user will be redirected by return_url
      console.log('✅ Payment flow completed');
    } catch (error: any) {
      console.error("❌ Payment error:", error);
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
                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <span>Email Address</span>
                    <span className="text-red-500">*</span>
                  </Label>
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

                {/* Full Name & Phone */}
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                      <span>Full Name</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <span>Phone Number</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                {/* Address Line 1 */}
                <div className="grid gap-2">
                  <Label htmlFor="addressLine1" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>House/Flat No., Building Name</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="addressLine1"
                    name="addressLine1"
                    placeholder="e.g., Flat 101, Sunshine Apartments"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Address Line 2 */}
                <div className="grid gap-2">
                  <Label htmlFor="addressLine2" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Road/Street, Area, Colony</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="addressLine2"
                    name="addressLine2"
                    placeholder="e.g., MG Road, Koramangala"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Landmark */}
                <div className="grid gap-2">
                  <Label htmlFor="landmark" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>Landmark (Optional)</span>
                  </Label>
                  <Input
                    id="landmark"
                    name="landmark"
                    placeholder="e.g., Near City Mall, Behind Post Office"
                    value={formData.landmark}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Help delivery partner locate you easily
                  </p>
                </div>

                {/* City, State, Pincode */}
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="city" className="flex items-center gap-2">
                      <span>City</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Your city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="state" className="flex items-center gap-2">
                      <span>State</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, state: value }))
                      }
                      required
                    >
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {INDIAN_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="pincode" className="flex items-center gap-2">
                      <span>Pincode</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      type="text"
                      placeholder="6-digit code"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      maxLength={6}
                      pattern="[0-9]{6}"
                      required
                    />
                  </div>
                </div>

                {/* Delivery Instructions */}
                <div className="grid gap-2">
                  <Label htmlFor="deliveryNotes" className="text-sm">
                    Delivery Instructions (Optional)
                  </Label>
                  <Textarea
                    id="deliveryNotes"
                    name="deliveryNotes"
                    placeholder="Any special instructions for delivery..."
                    className="min-h-[80px] resize-none"
                    onChange={handleInputChange}
                  />
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
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                {eligibility.offerActive && eligibility.eligible && discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400 text-sm">
                    <span className="flex items-center gap-1 font-medium">
                      <Tag className="h-4 w-4" />
                      Launch Offer ({eligibility.discountValue}% OFF)
                    </span>
                    <span className="font-semibold">-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatPrice(total)}
                    </span>
                  </div>
                  {eligibility.offerActive && eligibility.eligible && discount > 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                      🎉 You&apos;re saving {formatPrice(discount)}!
                    </p>
                  )}
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
