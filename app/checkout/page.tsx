"use client";

import React, { useState, useEffect as reactUseEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { CartMarquee } from "@/components/cart/CartMarquee";
import { CartBenefits } from "@/components/cart/CartBenefits";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { calculateOrderTotalClient } from "@/lib/launchOfferClient";
import { Tag, MapPin, Building2, Home, Loader2, AlertCircle, CheckCircle2, Plus, Trash2, Check, ShieldCheck, ArrowRight, Truck } from "lucide-react";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";

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
  const isKeyboardVisible = useKeyboardVisible();
  const { isAuthenticated: isSignedIn, user } = useAuth();
  const router = useRouter();
  const { items, getTotalPrice, setCustomerEmail } = useCartStore();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState<string>("");
  const [pincodeValid, setPincodeValid] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [eligibility, setEligibility] = useState({
    eligible: true,
    discountValue: 15,
    offerActive: true,
    offerName: "Launch Offer",
  });
  const [formData, setFormData] = useState({
    email: user?.email || "",
    fullName: user?.name || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [autoFilled, setAutoFilled] = useState({
    fullName: false,
    phone: false,
  });
  const [visitorFetched, setVisitorFetched] = useState(false);

  // Fetch visitor/lead data to auto-prefill checkout
  reactUseEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const response = await fetch("/api/visitor/me");
        const json = await response.json();
        
        if (json.success && json.data) {
          const { name, phone } = json.data;
          
          setFormData(prev => {
            const newData = { ...prev };
            const newAutoFilled = { ...autoFilled };
            let hasChanges = false;
            
            if (name && !prev.fullName) {
              newData.fullName = name;
              newAutoFilled.fullName = true;
              hasChanges = true;
            }
            
            if (phone && !prev.phone) {
              // Extract 10 digits if it starts with +91 or similar
              let normalizedPhone = phone.replace(/\D/g, "");
              if (normalizedPhone.length > 10 && normalizedPhone.startsWith("91")) {
                normalizedPhone = normalizedPhone.substring(2);
              }
              if (normalizedPhone.length === 10) {
                newData.phone = normalizedPhone;
                newAutoFilled.phone = true;
                hasChanges = true;
              }
            }
            
            if (hasChanges) {
              setAutoFilled(newAutoFilled);
            }
            
            return hasChanges ? newData : prev;
          });
        }
      } catch (error) {
        console.error("Error fetching visitor data:", error);
      } finally {
        setVisitorFetched(true);
      }
    };

    fetchVisitorData();
  }, []);

  // Fetch eligibility on mount
  reactUseEffect(() => {
    setMounted(true);
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
            offerName: data.offerName || "Launch Offer",
          });
        }
      } catch (error) {
        console.error("Error fetching eligibility:", error);
        // Default to showing offer
        setEligibility({
          eligible: true,
          discountValue: 15,
          offerActive: true,
          offerName: "Launch Offer",
        });
      }
    };
    
    fetchEligibility();
  }, [isSignedIn]);

  reactUseEffect(() => {
    if (!formData.email) return;
    setCustomerEmail(formData.email);
  }, [formData.email, setCustomerEmail]);

  // Fetch saved addresses on mount
  reactUseEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch("/api/addresses");
        const data = await response.json();
        if (data.success) {
          setSavedAddresses(data.data);
          
          // Auto-select default address if exists
          const defaultAddress = data.data.find((addr: any) => addr.isDefault);
          if (defaultAddress && !showNewAddressForm) {
            setSelectedAddressId(defaultAddress._id);
            loadAddressToForm(defaultAddress);
          } else if (data.data.length > 0 && !showNewAddressForm) {
            // Select first address if no default
            setSelectedAddressId(data.data[0]._id);
            loadAddressToForm(data.data[0]);
          } else {
            // Show new address form if no saved addresses
            setShowNewAddressForm(true);
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setShowNewAddressForm(true);
      }
    };

    if (isSignedIn) {
      fetchAddresses();
    } else {
      setShowNewAddressForm(true);
    }
  }, [isSignedIn]);

  // Load address data to form
  const loadAddressToForm = (address: any) => {
    setFormData({
      email: user?.email || "",
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      landmark: address.landmark || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
    setPincodeValid(true);
    setPincodeError("");
  };

  // Handle address selection
  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    const address = savedAddresses.find((addr) => addr._id === addressId);
    if (address) {
      loadAddressToForm(address);
      setShowNewAddressForm(false);
    }
  };

  // Handle delete address
  const handleDeleteAddress = async (addressId: string) => {
    try {
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSavedAddresses(savedAddresses.filter((addr) => addr._id !== addressId));
        toast({
          title: "Address deleted",
          description: "Your address has been removed",
        });
        
        // If deleted address was selected, show new address form
        if (selectedAddressId === addressId) {
          setShowNewAddressForm(true);
          setSelectedAddressId("");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive",
      });
    }
  };

  const isFormValid = formData.fullName.trim() !== "" && 
                      formData.phone.trim() !== "" && 
                      formData.email.trim() !== "" && 
                      formData.addressLine1.trim() !== "" && 
                      formData.city.trim() !== "" && 
                      formData.state.trim() !== "" && 
                      formData.pincode.length === 6;

  // Calculate pricing with discount (client-side for display only)
  const subtotal = getTotalPrice();
  const { discount, shipping, total } = calculateOrderTotalClient(
    subtotal,
    eligibility.discountValue,
    eligibility.eligible && eligibility.offerActive
  );

  // Handle redirects and payment errors
  reactUseEffect(() => {
    if (!mounted) return;
    
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

  // Show loading state while checking cart and mounting
  if (!mounted || (items.length === 0 && !paymentInitiated)) {
    return null;
  }

  // Validate pincode and auto-fill city & state
  const validatePincode = async (pincode: string) => {
    // Reset states
    setPincodeError("");
    setPincodeValid(false);

    // Format validation: exactly 6 digits, numeric only
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(pincode)) {
      setPincodeError("Pincode must be exactly 6 digits");
      return;
    }

    // Call India Post API
    setPincodeLoading(true);

    try {
      const response = await fetch(`/api/pincode/${pincode}`);
      
      if (!response.ok) {
        throw new Error("Unable to validate pincode. Please try again.");
      }

      const data = await response.json();

      // Check API response
      if (data && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        
        // Auto-fill city and state
        setFormData((prev) => ({
          ...prev,
          city: postOffice.District || prev.city,
          state: postOffice.State || prev.state,
        }));

        setPincodeValid(true);
        setPincodeError("");
      } else {
        // Invalid pincode or API error
        setPincodeError("Invalid pincode. Please enter a valid Indian pincode.");
      }
    } catch (error) {
      console.error("Pincode validation error:", error);
      // Fail silently on timeout/network error to not block the user
      setPincodeError(""); 
    } finally {
      setPincodeLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear auto-filled badge if user edits the field manually
    if ((name === "fullName" || name === "phone") && autoFilled[name as keyof typeof autoFilled]) {
      setAutoFilled(prev => ({ ...prev, [name]: false }));
    }
    
    // Auto-trigger validation if 6 digits are typed, else reset validation state
    if (name === "pincode") {
      if (value.length === 6) {
        validatePincode(value);
      } else {
        setPincodeError("");
        setPincodeValid(false);
      }
    }
  };

  // Handle pincode blur event
  const handlePincodeBlur = () => {
    if (formData.pincode && formData.pincode.length === 6 && !pincodeValid) {
      validatePincode(formData.pincode);
    }
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
      
      setTimeout(() => {
        const firstInvalid = document.querySelector('.border-red-400, :invalid');
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          (firstInvalid as HTMLElement).focus();
        }
      }, 50);
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

    // Validate pincode format locally instead of relying on the flaky external API
    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      toast({
        title: "Invalid Pincode",
        description: "Please enter a valid 6-digit Indian pincode",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setProcessingPayment(true);
    setPaymentInitiated(true);

    try {
      // Save address if checkbox is checked and it's a new address
      if (saveAddress && showNewAddressForm) {
        try {
          await fetch("/api/addresses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fullName: formData.fullName,
              phone: formData.phone,
              addressLine1: formData.addressLine1,
              addressLine2: formData.addressLine2,
              landmark: formData.landmark,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
              isDefault: savedAddresses.length === 0, // First address is default
            }),
          });
        } catch (error) {
          console.error("Failed to save address:", error);
          // Continue with payment even if address save fails
        }
      }

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
                name: eligibility.offerName,
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
                name: eligibility.offerName,
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
                name: eligibility.offerName,
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
        console.log("[Payment Debug] Payment API response success:", orderData.success);
        
        if (!orderData.success) {
          const errorMsg = orderData.validationErrors 
            ? `Validation error: ${orderData.validationErrors.map((e: any) => e.message).join(', ')}`
            : orderData.error || "Order creation failed";
          throw new Error(errorMsg);
        }
      }

      // ===== Create Cashfree Payment Session =====
      console.log('[Payment Debug] Creating payment order');
      const cashfreePayload = {
        amount: total,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        customerName: formData.fullName,
        orderId: orderData.data._id,
      };

      const cashfreeRes = await fetch("/api/cashfree/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cashfreePayload),
      });

      console.log("[Payment Debug] Payment API status", cashfreeRes.status);
      const cashfreeData = await cashfreeRes.json();
      
      console.log("[Payment Debug] Payment API response parsed. success:", cashfreeData.success);
      
      if (!cashfreeData.success) {
        throw new Error(cashfreeData.error || "Failed to initialize payment");
      }
      
      const paymentSessionId = cashfreeData.data.payment_session_id;
      
      console.log(`[Payment Debug] paymentSessionId exists: ${!!paymentSessionId}`);
      if (paymentSessionId) {
         console.log(`[Payment Debug] paymentSessionId length: ${paymentSessionId.length}`);
      }
      
      if (!paymentSessionId) {
        throw new Error("Invalid payment session");
      }
      
      console.log('[Payment Debug] payment session received');

      // ===== Load and Initialize Cashfree SDK =====
      if (!window.Cashfree) {
        console.log('[Payment Debug] Loading Cashfree SDK script...');
        const script = document.createElement("script");
        script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
          document.body.appendChild(script);
        });
      }
      
      console.log(`[Payment Debug] Cashfree SDK loaded: ${!!window.Cashfree}`);

      const cashfreeMode = cashfreeData.data.environment || process.env.NEXT_PUBLIC_CASHFREE_ENV || "sandbox";
      console.log(`[Payment Debug] Cashfree environment: ${cashfreeMode}`);
      
      console.log('[Payment Debug] Cashfree initialized');
      let cashfree;
      try {
        cashfree = await window.Cashfree({
          mode: cashfreeMode,
        });
      } catch (err: any) {
        console.error("[Payment Debug] Error initializing Cashfree:", err);
        throw err;
      }

      // ===== Open Checkout Modal / Redirect =====
      const checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: "_self",
        returnUrl: `${window.location.origin}/api/cashfree/callback?db_order_id=${orderData.data._id}`,
      };
      
      console.log(`[Payment Debug] redirectTarget: ${checkoutOptions.redirectTarget}`);
      
      console.log('[Payment Debug] BEFORE cashfree.checkout()');
      console.log('[Payment Debug] Calling cashfree.checkout');
      
      // We wrap checkout in a timeout promise just in case it hangs!
      const checkoutPromise = cashfree.checkout(checkoutOptions);
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Cashfree checkout timed out after 10s")), 10000);
      });
      
      const result = await Promise.race([checkoutPromise, timeoutPromise]) as any;
      
      console.log('[Payment Debug] AFTER cashfree.checkout()');
      console.log('[Payment Debug] Checkout returned/resolved:', result);
      
      if (result.error) {
        console.log('[Payment Debug] Checkout error:', result.error);
        throw new Error(result.error.message || "Payment failed");
      }
      
      if (result.redirect) {
        console.log('🔄 Redirecting to callback...');
        return;
      }
      
      console.log('[Payment Debug] Cashfree checkout result handled');
    } catch (error: any) {
      console.error("[Payment Debug] Checkout caught exception:", error);
      toast({
        title: "Error",
        description: error.message || "Unable to start payment. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      setProcessingPayment(false);
      setPaymentInitiated(false);
    }
  };

  return (
    <div className="checkout-page min-h-screen pb-[calc(140px+env(safe-area-inset-bottom))] lg:pb-12 bg-[#FAFAFA] dark:bg-background overflow-x-hidden w-full selection:bg-primary/10">
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (max-width: 768px) {
            .checkout-page input,
            .checkout-page textarea,
            .checkout-page select {
              font-size: 16px !important;
            }
          }
        `
      }} />
      {/* Premium Header */}
      <div className="pt-8 sm:pt-12 px-4 sm:px-6 text-center">
        <motion.p 
          className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          SECURE CHECKOUT
        </motion.p>
        <motion.h1 
          className="text-[28px] sm:text-4xl lg:text-5xl font-medium tracking-tight mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Complete your order
        </motion.h1>
      </div>

      {/* Progress Indicator */}
      <motion.div 
        className="flex items-center justify-center gap-3 text-[11px] sm:text-xs font-semibold tracking-[0.1em] uppercase mb-10 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-foreground">01 Delivery</span>
        <span className="w-6 h-px bg-border"></span>
        <span className={paymentInitiated ? "text-foreground" : ""}>02 Payment</span>
      </motion.div>

      <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="grid gap-8 lg:gap-16 lg:grid-cols-12 relative items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-[14px] font-semibold tracking-[0.1em] text-muted-foreground uppercase mb-6">DELIVERY DETAILS</h2>
              
              {/* Saved Addresses Section */}
              {savedAddresses.length > 0 && (
                <div className="mb-8 space-y-4">
                  {savedAddresses.map((address) => (
                    <div
                      key={address._id}
                      onClick={() => handleAddressSelect(address._id)}
                      className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 bg-white dark:bg-secondary/10 ${
                        selectedAddressId === address._id
                          ? 'border-[2px] border-primary shadow-[0_4px_20px_-4px_rgba(59,130,246,0.1)]'
                          : 'border border-border/50 hover:border-border shadow-sm'
                      }`}
                    >
                      {selectedAddressId === address._id && (
                        <div className="absolute top-5 right-5">
                          <div className="bg-primary text-primary-foreground rounded-full p-1 shadow-sm">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      )}
                      
                      <div className="pr-12">
                        <p className="font-semibold text-[15px] mb-1">{address.fullName}</p>
                        <p className="text-[14px] text-muted-foreground leading-relaxed">
                          {address.addressLine1}, {address.addressLine2}
                          {address.landmark && `, ${address.landmark}`}
                          <br />
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-[14px] text-muted-foreground mt-2">
                          {address.phone}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(address._id);
                        }}
                        className="absolute bottom-4 right-4 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {!showNewAddressForm && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowNewAddressForm(true);
                        setSelectedAddressId("");
                        setFormData({
                          email: user?.email || "",
                          fullName: user?.name || "",
                          phone: "",
                          addressLine1: "",
                          addressLine2: "",
                          landmark: "",
                          city: "",
                          state: "",
                          pincode: "",
                        });
                      }}
                      className="w-full h-14 rounded-2xl border-dashed bg-transparent hover:bg-secondary/20 font-medium"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Address
                    </Button>
                  )}
                </div>
              )}

              {/* New Address Form */}
              {showNewAddressForm && (
                <div className="space-y-10">
                  {savedAddresses.length > 0 && (
                    <div className="flex items-center justify-between pb-4 border-b border-border/50">
                      <h3 className="text-[15px] font-semibold">New Address</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowNewAddressForm(false);
                          if (savedAddresses.length > 0) {
                            handleAddressSelect(savedAddresses[0]._id);
                          }
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {/* Contact Section */}
                  <div className="space-y-6">
                    <h3 className="text-[13px] font-semibold tracking-wider text-muted-foreground uppercase pb-2 border-b border-border/50">Contact</h3>
                    
                    <div className="grid gap-5">
                      <div className="grid gap-2">
                        <Label htmlFor="fullName" className="text-[13px] font-semibold text-foreground/90 flex justify-between items-center">
                          <span>First Name *</span>
                          {autoFilled.fullName && <span className="text-[10px] text-muted-foreground font-normal">Details from your previous checkout</span>}
                        </Label>
                        {!visitorFetched ? (
                          <div className="h-[52px] w-full bg-secondary/40 animate-pulse rounded-[14px] border border-[#E2E8F0] dark:border-border/50" />
                        ) : (
                          <div className="relative">
                            <Input
                              id="fullName"
                              name="fullName"
                              autoComplete="name"
                              placeholder="Enter your first name"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              required
                              className="h-[52px] bg-white dark:bg-background rounded-[14px] border-[#E2E8F0] dark:border-border text-[#0F172A] dark:text-foreground placeholder:text-[#94A3B8] focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.10)] transition-all duration-200"
                            />
                            {autoFilled.fullName && (
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[11px] font-medium text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full pointer-events-none transition-opacity duration-300">
                                <Check className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="phone" className="text-[13px] font-semibold text-foreground/90 flex justify-between items-center">
                          <span>Mobile Number *</span>
                          {autoFilled.phone && <span className="text-[10px] text-muted-foreground font-normal">Details from your previous checkout</span>}
                        </Label>
                        {!visitorFetched ? (
                          <div className="h-[52px] w-full bg-secondary/40 animate-pulse rounded-[14px] border border-[#E2E8F0] dark:border-border/50" />
                        ) : (
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-muted-foreground font-medium">+91</span>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              inputMode="numeric"
                              autoComplete="tel"
                              placeholder="10-digit mobile number"
                              value={formData.phone}
                              onChange={handleInputChange}
                              maxLength={10}
                              required
                              className="h-[52px] pl-[52px] bg-white dark:bg-background rounded-[14px] border-[#E2E8F0] dark:border-border text-[#0F172A] dark:text-foreground placeholder:text-[#94A3B8] focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.10)] transition-all duration-200"
                            />
                            {autoFilled.phone && (
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[11px] font-medium text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full pointer-events-none transition-opacity duration-300">
                                <Check className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="email" className="text-[13px] font-semibold text-foreground/90">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          autoComplete="email"
                          className="h-[52px] bg-white dark:bg-background rounded-[14px] border-[#E2E8F0] dark:border-border text-[#0F172A] dark:text-foreground placeholder:text-[#94A3B8] focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.10)] transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address Section */}
                  <div className="space-y-6">
                    <h3 className="text-[13px] font-semibold tracking-wider text-muted-foreground uppercase pb-2 border-b border-border/50">Delivery Address</h3>
                    
                    <div className="grid gap-5">
                      <div className="grid gap-2">
                        <Label htmlFor="addressLine1" className="text-[13px] font-semibold text-foreground/90">House / Flat / Building *</Label>
                        <Input
                          id="addressLine1"
                          name="addressLine1"
                          autoComplete="address-line1"
                          placeholder="e.g. Flat 101, Om Sai Apartments"
                          value={formData.addressLine1}
                          onChange={handleInputChange}
                          required
                          className="h-[52px] bg-white dark:bg-background rounded-[14px] border-[#E2E8F0] dark:border-border text-[#0F172A] dark:text-foreground placeholder:text-[#94A3B8] focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.10)] transition-all duration-200"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="addressLine2" className="text-[13px] font-semibold text-foreground/90">Road / Street / Area / Colony *</Label>
                        <Input
                          id="addressLine2"
                          name="addressLine2"
                          autoComplete="address-line2"
                          placeholder="e.g. MG Road, Koramangala"
                          value={formData.addressLine2}
                          onChange={handleInputChange}
                          required
                          className="h-[52px] bg-white dark:bg-background rounded-[14px] border-[#E2E8F0] dark:border-border text-[#0F172A] dark:text-foreground placeholder:text-[#94A3B8] focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.10)] transition-all duration-200"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="landmark" className="text-[13px] font-semibold text-foreground/90">Landmark</Label>
                        <Input
                          id="landmark"
                          name="landmark"
                          placeholder="e.g. Near City Mall"
                          value={formData.landmark}
                          onChange={handleInputChange}
                          className="h-[52px] bg-white dark:bg-background rounded-[14px] border-[#E2E8F0] dark:border-border text-[#0F172A] dark:text-foreground placeholder:text-[#94A3B8] focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.10)] transition-all duration-200"
                        />
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="grid gap-2 relative">
                          <Label htmlFor="pincode" className="text-[13px] font-semibold text-foreground/90">Pincode *</Label>
                          <div className="relative">
                            <Input
                              id="pincode"
                              name="pincode"
                              type="text"
                              inputMode="numeric"
                              autoComplete="postal-code"
                              placeholder="6-digit pincode"
                              value={formData.pincode}
                              onChange={handleInputChange}
                              onBlur={handlePincodeBlur}
                              maxLength={6}
                              pattern="[0-9]{6}"
                              required
                              className="h-[52px] bg-white dark:bg-background rounded-[14px] border-[#E2E8F0] dark:border-border text-[#0F172A] dark:text-foreground placeholder:text-[#94A3B8] focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.10)] transition-all duration-200 pr-10"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              {pincodeLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                              {!pincodeLoading && pincodeValid && <CheckCircle2 className="h-4 w-4 text-primary" />}
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="city" className="text-[13px] font-semibold text-foreground/90">District *</Label>
                          <Input
                            id="city"
                            name="city"
                            autoComplete="address-level2"
                            placeholder="District"
                            value={formData.city}
                            onChange={handleInputChange}
                            readOnly={pincodeValid}
                            className={`h-[52px] rounded-[14px] border-[#E2E8F0] dark:border-border focus-visible:ring-0 transition-all duration-200 ${pincodeValid ? 'bg-[#F1F5F9] dark:bg-secondary/30 text-muted-foreground' : 'bg-white dark:bg-background text-[#0F172A] dark:text-foreground'}`}
                            required
                          />
                        </div>

                        <div className="grid gap-2 sm:col-span-2">
                          <Label htmlFor="state" className="text-[13px] font-semibold text-foreground/90">State *</Label>
                          <Select
                            value={formData.state}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, state: value }))}
                            disabled={pincodeValid}
                            required
                          >
                            <SelectTrigger id="state" className={`h-[52px] rounded-[14px] border-[#E2E8F0] dark:border-border focus:ring-0 focus:border-primary focus:shadow-[0_0_0_3px_rgba(59,130,246,0.10)] transition-all duration-200 ${pincodeValid ? 'bg-[#F1F5F9] dark:bg-secondary/30 text-muted-foreground' : 'bg-white dark:bg-background text-[#0F172A] dark:text-foreground'}`}>
                              <SelectValue placeholder="State" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px] rounded-xl">
                              {INDIAN_STATES.map((state) => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Notes */}
                  <div className="space-y-6">
                    <h3 className="text-[13px] font-semibold tracking-wider text-muted-foreground uppercase pb-2 border-b border-border/50">Delivery Notes</h3>
                    <Textarea
                      id="deliveryNotes"
                      name="deliveryNotes"
                      placeholder="Optional message..."
                      className="min-h-[100px] bg-white dark:bg-background rounded-[14px] border-[#E2E8F0] dark:border-border text-[#0F172A] dark:text-foreground placeholder:text-[#94A3B8] focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.10)] transition-all duration-200 resize-none p-4"
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Save Address Checkbox */}
                  <div 
                    onClick={() => setSaveAddress(!saveAddress)}
                    className="flex items-center gap-3 cursor-pointer select-none py-2"
                  >
                    <div className={`w-5 h-5 rounded-[6px] flex items-center justify-center transition-colors ${
                      saveAddress ? 'bg-primary text-primary-foreground' : 'border-2 border-muted-foreground/30'
                    }`}>
                      {saveAddress && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-[14px] font-medium">Save this address for future orders</span>
                  </div>

                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              className="lg:sticky lg:top-8 bg-white dark:bg-secondary/10 rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] dark:border-border/50 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-[14px] font-semibold tracking-[0.1em] text-muted-foreground uppercase mb-6">YOUR ORDER</h2>
              
              <div className="space-y-5 mb-6">
                {items.map((item, i) => (
                  <div key={item._id} className="flex gap-4 items-center">
                    {item.imageUrl && (
                      <div className="relative w-[60px] h-[60px] rounded-xl overflow-hidden bg-secondary/30 shrink-0 border border-border/50">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[14px] line-clamp-2">{item.title}</p>
                      <p className="text-[13px] text-muted-foreground mt-0.5">Qty {item.quantity}</p>
                    </div>
                    <div className="text-[15px] font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-5 border-t border-border/50">
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                {eligibility.offerActive && eligibility.eligible && discount > 0 && (
                  <div className="flex justify-between items-center text-[14px] text-primary">
                    <span className="font-medium">Offer</span>
                    <span className="font-medium">− {formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold tracking-wide uppercase text-primary">FREE</span>
                </div>
              </div>
              
              <div className="pt-5 mt-5 border-t border-border/50">
                <div className="flex justify-between items-center mb-1 w-full gap-2">
                  <span className="text-[15px] font-semibold tracking-wide">TOTAL</span>
                  <motion.span 
                    key={total}
                    className="text-[24px] sm:text-[28px] font-semibold tracking-tight"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {formatPrice(total)}
                  </motion.span>
                </div>
                {eligibility.offerActive && eligibility.eligible && discount > 0 && (
                  <p className="text-[13px] font-medium text-right text-primary">
                    You save {formatPrice(discount)}
                  </p>
                )}
              </div>

              {/* Desktop CTA */}
              <div className="hidden lg:block mt-8">
                <Button
                  onClick={handlePayment}
                  disabled={!isFormValid || loading || processingPayment || paymentInitiated}
                  className="w-full h-[52px] rounded-[14px] text-[15px] font-semibold group transition-all tracking-wide"
                >
                  {processingPayment || paymentInitiated ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {paymentInitiated ? "Redirecting..." : "Processing..."}
                    </span>
                  ) : loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Please wait...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2 w-full">
                      PROCEED TO PAYMENT
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  )}
                </Button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 opacity-70" />
                  <p className="text-[12px] font-medium">
                    🔒 Secure checkout
                  </p>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </div>

      {/* Mobile Sticky Payment Bar */}
      <AnimatePresence>
        {!isKeyboardVisible && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="lg:hidden fixed bottom-[calc(64px+env(safe-area-inset-bottom))] left-0 right-0 p-3 px-4 bg-white/90 dark:bg-background/90 backdrop-blur-xl border-t border-[#E2E8F0] dark:border-border/50 z-40 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center justify-between gap-4 max-w-[1100px] mx-auto">
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Total</span>
                <span className="text-[18px] font-semibold leading-none mt-0.5">{formatPrice(total)}</span>
              </div>
              <Button
                onClick={handlePayment}
                disabled={!isFormValid || loading || processingPayment || paymentInitiated}
                className="flex-1 h-[46px] rounded-xl text-[13px] font-semibold tracking-wide"
              >
                {processingPayment || paymentInitiated || loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    PROCEED <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
