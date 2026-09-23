"use client";

import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2, Tag, Cake, Heart, Palette, ArrowRight, ShieldCheck, Check, Package, ArrowLeft, Loader2 } from "lucide-react";
import { calculateOrderTotalClient } from "@/lib/launchOfferClient";
import { useState, useEffect } from "react";
import { getOccasionBadgeColor } from "@/lib/occasions";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { CartMarquee } from "@/components/cart/CartMarquee";
import { CartBenefits } from "@/components/cart/CartBenefits";
import { CartOfferBanner } from "@/components/cart/CartOfferBanner";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    height: 0,
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [eligibility, setEligibility] = useState({
    eligible: true,
    discountValue: 15,
    offerActive: true,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchEligibility = async () => {
      try {
        const response = await fetch("/api/offers/eligibility");
        const data = await response.json();
        if (data.success) {
          setEligibility({
            eligible: data.eligible || true,
            discountValue: data.discountValue || 15,
            offerActive: data.offerActive || true,
          });
        }
      } catch (error) {
        setEligibility({ eligible: true, discountValue: 15, offerActive: true });
      }
    };
    fetchEligibility();
  }, []);

  const subtotal = getTotalPrice();
  const { discount, shipping, total } = calculateOrderTotalClient(
    subtotal,
    eligibility.discountValue,
    eligibility.eligible && eligibility.offerActive
  );

  const handleCheckout = () => {
    setIsProcessing(true);
    router.push("/checkout");
  };

  // Prevent hydration mismatch by returning skeleton or nothing
  if (!isClient) {
    return (
      <div className="container max-w-[1200px] mx-auto px-4 py-8 sm:py-12 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container max-w-[1200px] mx-auto px-4 py-16 sm:py-32 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md mx-auto flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-8">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase mb-4">
            Your Cart is Empty
          </h2>
          <h1 className="text-3xl sm:text-4xl font-light mb-4">Nothing selected yet.</h1>
          <p className="text-muted-foreground mb-10 text-sm sm:text-base">
            Discover beautifully crafted frames ready to become part of your space.
          </p>
          <Link href="/frames" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-12 px-8 text-sm group relative overflow-hidden transition-all duration-300">
              <span className="relative z-10 flex items-center gap-2">
                Explore Frames
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container max-w-[1200px] mx-auto px-4 py-8 sm:py-16 pb-32 md:pb-16">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-10 sm:mb-16 max-w-xl"
      >
        <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-[0.15em] text-muted-foreground uppercase mb-3">
          Your Collection
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-4">
          Curated pieces for your space.
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          {items.length} {items.length === 1 ? "item" : "items"} in your cart.
        </p>
      </motion.div>

      <CartMarquee />

      <div className="grid gap-x-12 gap-y-12 lg:grid-cols-12 relative items-start">
        <div className="lg:col-span-7">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6 sm:gap-8"
          >
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  layout
                  className="flex flex-row gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-border/50 last:border-0"
                >
                  <div className="group relative aspect-square w-[90px] sm:w-[140px] flex-shrink-0 overflow-hidden rounded-xl sm:rounded-2xl bg-muted/30">
                    {item.isCustom && !item.customFrame?.uploadedImageUrl ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4">
                        <Palette className="w-8 h-8 mb-2 text-muted-foreground/50" />
                        <p className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider">Design Pending</p>
                      </div>
                    ) : item.isTemplate && !item.templateFrame?.uploadedPhoto ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4">
                        {item.templateFrame?.occasion === "birthday" && <Cake className="w-8 h-8 mb-2 text-pink-600/50" />}
                        {item.templateFrame?.occasion === "wedding" && <Heart className="w-8 h-8 mb-2 text-rose-600/50" />}
                        <p className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider">Template</p>
                      </div>
                    ) : (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    )}
                  </div>

                  <div className="flex flex-col flex-1 justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0 pr-4">
                          <h3 className="font-medium text-base sm:text-lg text-foreground mb-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.frame_size} &middot; {item.frame_material}
                          </p>
                          
                          {/* Occasion Badges */}
                          {(item.isCustom && item.customFrame?.occasion) || (item.isTemplate && item.templateFrame?.occasion) ? (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {item.isCustom && item.customFrame?.occasion && (
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-medium bg-secondary/50`}>
                                  {item.customFrame.occasion === "birthday" && <Cake className="h-3.5 w-3.5" />}
                                  {item.customFrame.occasion === "wedding" && <Heart className="h-3.5 w-3.5" />}
                                  {item.customFrame.occasion === "custom" && <Palette className="h-3.5 w-3.5" />}
                                  {item.customFrame.occasion.charAt(0).toUpperCase() + item.customFrame.occasion.slice(1)}
                                </span>
                              )}
                              {item.isTemplate && item.templateFrame?.occasion && (
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-medium bg-secondary/50`}>
                                  {item.templateFrame.occasion === "birthday" && <Cake className="h-3.5 w-3.5" />}
                                  {item.templateFrame.occasion === "wedding" && <Heart className="h-3.5 w-3.5" />}
                                  {item.templateFrame.occasion === "birthday" ? "Birthday" : "Wedding"}
                                </span>
                              )}
                            </div>
                          ) : null}

                          <p className="font-medium text-base mt-2">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-muted-foreground/50 hover:text-destructive transition-colors p-2 -mr-2 rounded-full hover:bg-destructive/10 active:scale-95 flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center mt-6">
                      <div className="flex items-center bg-secondary/30 rounded-full border border-border/50 h-9 p-1">
                        <button
                          onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-full flex items-center justify-center text-muted-foreground hover:text-foreground active:scale-90 transition-all rounded-full"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        
                        <div className="w-10 text-center font-medium text-sm flex items-center justify-center relative overflow-hidden">
                          <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                              key={item.quantity}
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: 10, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="absolute"
                            >
                              {item.quantity}
                            </motion.span>
                          </AnimatePresence>
                        </div>

                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-full flex items-center justify-center text-muted-foreground hover:text-foreground active:scale-90 transition-all rounded-full"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          <div className="mt-8 hidden lg:block">
            <Link href="/frames" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Continue shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sticky Panel */}
        <div className="lg:col-span-5 relative">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="lg:sticky lg:top-28 bg-secondary/10 sm:bg-transparent rounded-2xl p-6 sm:p-0 border sm:border-0 border-border/50"
          >
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] mb-6 hidden sm:block">
              Order Summary
            </h2>

            <div className="space-y-4 text-sm sm:text-base">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              
              {eligibility.offerActive && eligibility.eligible && discount > 0 && (
                <div className="py-3 my-2 border-y border-border/50">
                  <div className="flex justify-between items-center text-primary/80 dark:text-blue-400">
                    <span className="flex items-center gap-2 font-medium">
                      <Tag className="h-4 w-4" />
                      Launch Privilege
                    </span>
                    <span className="font-semibold">-{formatPrice(discount)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 ml-6">
                    {eligibility.discountValue}% OFF applied automatically
                  </p>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600 dark:text-green-400 font-medium tracking-wide">COMPLIMENTARY</span>
              </div>
              
              <div className="pt-6 mt-4 border-t border-border">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                    {formatPrice(total)}
                  </span>
                </div>
                {eligibility.offerActive && eligibility.eligible && discount > 0 && (
                  <AnimatePresence mode="popLayout">
                    <motion.div 
                      key={discount}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-right text-xs text-muted-foreground"
                    >
                      You&apos;re saving <span className="font-medium text-foreground">{formatPrice(discount)}</span> on this order
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* Desktop Checkout CTA */}
            <div className="mt-8 hidden sm:block">
              <Button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full h-14 text-base font-medium group relative overflow-hidden shadow-lg shadow-primary/20 transition-all duration-300"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="relative z-10 flex items-center gap-2">
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
              
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Secure payment
                </span>
                <span className="flex items-center gap-1.5">
                  <Package className="w-4 h-4" /> Carefully packaged
                </span>
              </div>
            </div>
            
            {/* Mobile continue shopping link in normal flow */}
            <div className="mt-6 sm:hidden text-center">
              <Link href="/frames" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Continue shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scrolling Benefit Animations Below Cart Grid */}
      <CartBenefits />
      <CartOfferBanner />

      {/* Mobile Sticky Checkout Bar */}
      <div className="sm:hidden fixed bottom-16 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-t border-border/50 px-4 py-3 shadow-[0_-8px_16px_-6px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Total</span>
            <span className="text-lg font-bold leading-none">{formatPrice(total)}</span>
          </div>
          <Button 
            onClick={handleCheckout}
            disabled={isProcessing}
            className="flex-1 h-12 max-w-[200px] text-sm group"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Checkout
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
