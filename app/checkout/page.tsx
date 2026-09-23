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
                      formData.pincode.length === 6 && 
                      pincodeValid;

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Reset pincode validation when user types
    if (name === "pincode") {
      setPincodeError("");
      setPincodeValid(false);
    }
  };

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
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      
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
      setPincodeError("Unable to validate pincode. Please check your internet connection.");
    } finally {
      setPincodeLoading(false);
    }
  };

  // Handle pincode blur event
  const handlePincodeBlur = () => {
    if (formData.pincode && formData.pincode.length === 6) {
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

    // Validate pincode
    if (!pincodeValid && formData.pincode) {
      await validatePincode(formData.pincode);
      
      // Check again after validation
      if (pincodeError || !pincodeValid) {
        toast({
          title: "Invalid Pincode",
          description: "Please enter a valid Indian pincode",
          variant: "destructive",
        });
        return;
      }
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
    <div className="min-h-screen pb-[calc(8rem+env(safe-area-inset-bottom))] lg:pb-12 bg-background overflow-x-hidden w-full">
      {/* Premium Header */}
      <div className="pt-6 sm:pt-12 px-4 sm:px-6 text-left sm:text-center">
        <motion.p 
          className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-primary/80 uppercase mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          SECURE CHECKOUT
        </motion.p>
        <motion.h1 
          className="text-[30px] leading-[1.2] sm:text-4xl lg:text-5xl font-light tracking-wide mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Complete your order
        </motion.h1>
        <motion.p 
          className="text-[14px] leading-[1.45] sm:text-base text-muted-foreground max-w-md mx-auto mb-8 sm:mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Almost there. Complete your details and we&apos;ll prepare your {items.length} {items.length === 1 ? 'frame' : 'frames'} for delivery.
        </motion.p>
      </div>

      {/* Progress Indicator */}
      <motion.div 
        className="flex items-center justify-start sm:justify-center gap-4 text-[11px] sm:text-xs font-medium tracking-widest uppercase mb-8 sm:mb-16 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-foreground">01 Delivery Details</span>
        <span className="w-8 h-px bg-border"></span>
        <span className={paymentInitiated ? "text-foreground" : ""}>02 Payment</span>
      </motion.div>

      <CartMarquee />

      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 mt-6 sm:mt-16">
        <div className="grid gap-x-12 gap-y-16 lg:grid-cols-12 relative items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            
            <motion.div 
              className="mb-8 flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-primary">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[18px] sm:text-lg font-medium tracking-wide">DELIVERY DETAILS</h2>
                <p className="text-[13px] sm:text-sm text-muted-foreground">Where should we deliver your order?</p>
              </div>
            </motion.div>

            {/* Saved Addresses Section */}
            {savedAddresses.length > 0 && (
              <motion.div 
                className="mb-10 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="grid gap-3">
                  {savedAddresses.map((address) => (
                    <div
                      key={address._id}
                      onClick={() => handleAddressSelect(address._id)}
                      className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 ${
                        selectedAddressId === address._id
                          ? 'bg-primary/[0.03] border border-primary/20 shadow-sm'
                          : 'bg-secondary/10 border border-transparent hover:bg-secondary/30'
                      }`}
                    >
                      {/* Selection Indicator */}
                      {selectedAddressId === address._id && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-primary text-primary-foreground rounded-full p-1 shadow-sm">
                            <Check className="h-4 w-4" />
                          </div>
                        </div>
                      )}
                      
                      <div className="pr-12">
                        <p className="font-medium text-base mb-1">{address.fullName}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {address.addressLine1}, {address.addressLine2}
                          {address.landmark && `, ${address.landmark}`}
                          <br />
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                          Phone: {address.phone}
                        </p>
                        {address.isDefault && (
                          <span className="inline-block mt-3 px-2 py-1 bg-secondary/50 text-foreground text-xs font-medium tracking-wide rounded-md">
                            DEFAULT
                          </span>
                        )}
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
                </div>

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
                    className="w-full h-14 rounded-xl border-dashed hover:bg-secondary/20"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                )}
              </motion.div>
            )}

            {/* New Address Form */}
            {showNewAddressForm && (
              <motion.div 
                className="space-y-6 sm:space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {savedAddresses.length > 0 && (
                  <div className="flex items-center justify-between pb-4 border-b border-border/50">
                    <h3 className="text-base font-medium">New Address</h3>
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

                <div className="grid gap-5 sm:gap-6">
                  {/* Email */}
                  <div className="grid gap-2 relative">
                    <Label htmlFor="email" className="text-[13px] sm:text-[14px] sm:text-sm font-medium ml-1">
                      Email Address <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      autoComplete="email"
                      disabled={!!user?.email}
                      className={`h-[50px] sm:h-14 text-[15px] sm:text-base rounded-xl transition-all duration-250 focus-visible:ring-1 focus-visible:ring-primary ${formData.email && !formData.email.match(/^[^s@]+@[^s@]+\.[^s@]+$/) ? "border-red-400 bg-red-50/50 dark:bg-red-950/10" : ""}`}
                    />
                    <AnimatePresence>
                      {formData.email && !formData.email.match(/^[^s@]+@[^s@]+\.[^s@]+$/) && (
                        <motion.div 
                          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                          className="flex items-center gap-1.5 mt-1 ml-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                          <p className="text-xs text-red-500 font-medium">Valid email required</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Full Name & Phone */}
                  <div className="grid gap-5 sm:gap-6 sm:grid-cols-2">
                    <div className="grid gap-2 relative">
                      <Label htmlFor="fullName" className="text-[13px] sm:text-sm font-medium ml-1">
                        Full Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        autoComplete="name"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="h-[50px] sm:h-14 text-[15px] sm:text-base rounded-xl transition-all duration-250 focus-visible:ring-1 focus-visible:ring-primary"
                      />
                    </div>

                    <div className="grid gap-2 relative">
                      <Label htmlFor="phone" className="text-[13px] sm:text-sm font-medium ml-1">
                        Phone Number <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        maxLength={10}
                        required
                        className={`h-[50px] sm:h-14 text-[15px] sm:text-base rounded-xl transition-all duration-250 focus-visible:ring-1 focus-visible:ring-primary ${formData.phone && formData.phone.length !== 10 ? "border-red-400 bg-red-50/50 dark:bg-red-950/10" : ""}`}
                      />
                      <AnimatePresence>
                        {formData.phone && formData.phone.length !== 10 && (
                          <motion.div 
                            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                            className="flex items-center gap-1.5 mt-1 ml-1"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                            <p className="text-xs text-red-500 font-medium">10 digits required</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Address Line 1 */}
                  <div className="grid gap-2 relative">
                    <Label htmlFor="addressLine1" className="text-[13px] sm:text-sm font-medium ml-1">
                      House/Flat No., Building Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="addressLine1"
                      name="addressLine1"
                      autoComplete="address-line1"
                      placeholder="e.g., Flat 101, Om Sai Apartments"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      required
                      className={`h-[50px] sm:h-14 text-[15px] sm:text-base rounded-xl transition-all duration-250 focus-visible:ring-1 focus-visible:ring-primary ${formData.addressLine1 !== undefined && formData.addressLine1.trim().length === 0 ? "border-red-400 bg-red-50/50 dark:bg-red-950/10" : ""}`}
                    />
                  </div>

                  {/* Address Line 2 */}
                  <div className="grid gap-2 relative">
                    <Label htmlFor="addressLine2" className="text-[13px] sm:text-sm font-medium ml-1">
                      Road/Street, Area, Colony <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="addressLine2"
                      name="addressLine2"
                      autoComplete="address-line2"
                      placeholder="e.g., MG Road, Koramangala"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      required
                      className="h-[50px] sm:h-14 text-[15px] sm:text-base rounded-xl transition-all duration-250 focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>

                  {/* Landmark */}
                  <div className="grid gap-2">
                    <Label htmlFor="landmark" className="text-[13px] sm:text-[13px] sm:text-sm font-medium ml-1 text-muted-foreground">
                      Landmark (Optional)
                    </Label>
                    <Input
                      id="landmark"
                      name="landmark"
                      placeholder="e.g., Near City Mall"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      className="h-[50px] sm:h-14 text-[15px] sm:text-base rounded-xl transition-all duration-250 focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>

                  {/* Pincode, City, State */}
                  <div className="grid gap-5 sm:gap-6 sm:grid-cols-3">
                    <div className="grid gap-2 relative">
                      <Label htmlFor="pincode" className="text-[13px] sm:text-sm font-medium ml-1">
                        Pincode <span className="text-red-400">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="pincode"
                          name="pincode"
                          type="text"
                          autoComplete="postal-code"
                          placeholder="6 digits"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          onBlur={handlePincodeBlur}
                          maxLength={6}
                          pattern="[0-9]{6}"
                          required
                          className={`h-[50px] sm:h-14 text-[15px] sm:text-base rounded-xl transition-all duration-250 focus-visible:ring-1 focus-visible:ring-primary pr-10 ${pincodeError ? 'border-red-400 bg-red-50/50 dark:bg-red-950/10' : pincodeValid ? 'border-primary/50 bg-primary/5' : ''}`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {pincodeLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                          {!pincodeLoading && pincodeValid && <CheckCircle2 className="h-4 w-4 text-primary" />}
                        </div>
                      </div>
                      <AnimatePresence>
                        {pincodeError && (
                          <motion.div 
                            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                            className="flex items-center gap-1.5 mt-1 ml-1 absolute -bottom-6"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                            <p className="text-xs text-red-500 font-medium whitespace-nowrap">{pincodeError}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="city" className="text-[13px] sm:text-sm font-medium ml-1">
                        City <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        autoComplete="address-level2"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        readOnly={pincodeValid}
                        className={`h-[50px] sm:h-14 text-[15px] sm:text-base rounded-xl transition-all duration-250 focus-visible:ring-1 focus-visible:ring-primary ${pincodeValid ? 'bg-primary/5 border-primary/20 text-muted-foreground' : ''}`}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="state" className="text-[13px] sm:text-sm font-medium ml-1">
                        State <span className="text-red-400">*</span>
                      </Label>
                      <Select
                        value={formData.state}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, state: value }))}
                        disabled={pincodeValid}
                        required
                      >
                        <SelectTrigger id="state" className={`h-[50px] sm:h-14 text-[15px] sm:text-base rounded-xl transition-all duration-250 ${pincodeValid ? 'bg-primary/5 border-primary/20 text-muted-foreground' : ''}`}>
                          <SelectValue placeholder="State" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {INDIAN_STATES.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Delivery Instructions */}
                  <div className="grid gap-2 mt-6 pt-6 border-t border-border/50">
                    <h3 className="text-[18px] sm:text-lg font-medium tracking-wide mb-2">DELIVERY NOTES</h3>
                    <Label htmlFor="deliveryNotes" className="text-[13px] sm:text-sm font-medium ml-1 text-muted-foreground">
                      Delivery Instructions (Optional)
                    </Label>
                    <Textarea
                      id="deliveryNotes"
                      name="deliveryNotes"
                      placeholder="Special instructions..."
                      className="min-h-[100px] rounded-xl resize-none transition-all duration-250 focus-visible:ring-1 focus-visible:ring-primary"
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Save Address Checkbox */}
                  <div 
                    onClick={() => setSaveAddress(!saveAddress)}
                    className={`mt-4 flex items-center gap-4 p-3 sm:p-4 rounded-xl border transition-all cursor-pointer select-none ${
                      saveAddress 
                        ? 'border-primary bg-primary/[0.03]' 
                        : 'border-border/50 bg-transparent hover:bg-secondary/20'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                      saveAddress ? 'bg-primary text-primary-foreground' : 'border-2 border-muted-foreground/30'
                    }`}>
                      {saveAddress && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-[13px] sm:text-sm font-medium">Save this address for future orders</span>
                  </div>

                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              className="lg:sticky lg:top-28 bg-secondary/10 sm:bg-transparent rounded-3xl p-6 sm:p-8 sm:border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-medium tracking-wide mb-6">YOUR ORDER</h2>
              
              <div className="space-y-4 mb-8">
                {items.map((item, i) => (
                  <motion.div 
                    key={item._id} 
                    className="flex gap-4 items-center"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                  >
                    {item.imageUrl && (
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-secondary/30 shrink-0">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[13px] sm:text-sm line-clamp-2 min-w-0 pr-2">{item.title}</p>
                      <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4 text-sm border-t border-border/50 pt-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                <AnimatePresence>
                  {eligibility.offerActive && eligibility.eligible && discount > 0 && (
                    <motion.div 
                      className="flex justify-between text-primary"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <Tag className="w-4 h-4" />
                        {eligibility.offerName}
                      </span>
                      <span className="font-medium">-{formatPrice(discount)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <motion.span 
                    className="text-primary font-medium flex items-center gap-1.5"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <Truck className="w-4 h-4" />
                    FREE
                  </motion.span>
                </div>
                
                <div className="border-t border-border/50 pt-4 mt-2">
                  <div className="flex justify-between items-end mb-1 w-full gap-2">
                    <span className="text-base tracking-wider min-w-0 pr-4">TOTAL</span>
                    <AnimatePresence mode="popLayout">
                      <motion.span 
                        key={total}
                        className="text-[24px] sm:text-2xl font-semibold"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        {formatPrice(total)}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <AnimatePresence>
                    {eligibility.offerActive && eligibility.eligible && discount > 0 && (
                      <motion.p 
                        className="text-xs text-primary/80 font-medium text-right"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        You save {formatPrice(discount)}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {!isFormValid && (
                <motion.div 
                  className="mt-6 p-4 bg-secondary/30 rounded-xl text-center"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                >
                  <p className="text-xs text-muted-foreground font-medium">
                    Complete delivery details to proceed
                  </p>
                </motion.div>
              )}

              <Button
                onClick={handlePayment}
                disabled={!isFormValid || loading || processingPayment || paymentInitiated || pincodeLoading}
                className="mt-6 w-full h-[52px] sm:h-14 rounded-xl text-[15px] sm:text-base font-semibold group transition-all"
              >
                {processingPayment || paymentInitiated ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {paymentInitiated ? "Redirecting..." : "Processing..."}
                  </span>
                ) : loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Please wait...
                  </span>
                ) : pincodeLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Validating pincode...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 w-full">
                    Proceed to Payment
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
              
              <div className="mt-6 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 opacity-50" />
                <p className="text-[12px] sm:text-[13px] font-medium tracking-wide text-center max-w-[250px] opacity-80">
                  {paymentInitiated ? "Redirecting to secure gateway..." : "You'll be redirected to our secure payment gateway"}
                </p>
              </div>

            </motion.div>
          </div>

        </div>

        <div className="mt-12 sm:mt-24">
          <CartBenefits />
        </div>
      </div>
    </div>
  );
}
