"use client";

import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingBag, Tag, Cake, Heart, Sparkles } from "lucide-react";
import { calculateOrderTotalClient } from "@/lib/launchOfferClient";
import { useState, useEffect } from "react";
import { getOccasionBadgeColor } from "@/lib/occasions";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [eligibility, setEligibility] = useState({
    eligible: true,
    discountValue: 15,
    offerActive: true,
  });

  useEffect(() => {
    const fetchEligibility = async () => {
      try {
        const response = await fetch("/api/offers/eligibility");
        const data = await response.json();
        console.log("Cart eligibility data:", data);
        if (data.success) {
          setEligibility({
            eligible: data.eligible || true,
            discountValue: data.discountValue || 15,
            offerActive: data.offerActive || true,
          });
        }
      } catch (error) {
        console.error("Error fetching eligibility:", error);
        // Default to showing offer for guests
        setEligibility({
          eligible: true,
          discountValue: 15,
          offerActive: true,
        });
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

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h2 className="mb-2 text-2xl font-bold">Your cart is empty</h2>
        <p className="mb-6 text-muted-foreground">
          Start adding some frames to your cart!
        </p>
        <Link href="/frames">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item._id}>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex gap-3 sm:gap-4">
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded">
                      {item.isCustom && !item.customFrame?.uploadedImageUrl ? (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                          <div className="text-center p-2">
                            <Sparkles className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                            <p className="text-[10px] text-gray-500">Design Pending</p>
                          </div>
                        </div>
                      ) : item.isTemplate && !item.templateFrame?.uploadedPhoto ? (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                          <div className="text-center p-2">
                            {item.templateFrame?.occasion === "birthday" && <Cake className="w-6 h-6 mx-auto mb-1 text-pink-600" />}
                            {item.templateFrame?.occasion === "wedding" && <Heart className="w-6 h-6 mx-auto mb-1 text-rose-600" />}
                            <p className="text-[10px] text-gray-600 dark:text-gray-300 font-medium">Template</p>
                          </div>
                        </div>
                      ) : (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm sm:text-base truncate">{item.title}</h3>
                          {item.isCustom && item.customFrame?.occasion && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${getOccasionBadgeColor(item.customFrame.occasion as any)}`}>
                              {item.customFrame.occasion === "birthday" && <Cake className="h-3 w-3" />}
                              {item.customFrame.occasion === "wedding" && <Heart className="h-3 w-3" />}
                              {item.customFrame.occasion === "custom" && <Sparkles className="h-3 w-3" />}
                              {item.customFrame.occasion.charAt(0).toUpperCase() + item.customFrame.occasion.slice(1)}
                            </span>
                          )}
                          {item.isTemplate && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                              item.templateFrame?.occasion === "birthday" 
                                ? "bg-pink-100 text-pink-800 dark:bg-pink-950/30 dark:text-pink-400"
                                : "bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400"
                            }`}>
                              {item.templateFrame?.occasion === "birthday" && <Cake className="h-3 w-3" />}
                              {item.templateFrame?.occasion === "wedding" && <Heart className="h-3 w-3" />}
                              {item.templateFrame?.occasion === "birthday" ? "Birthday" : "Wedding"}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {item.frame_size} • {item.frame_material}
                        </p>
                        {item.isCustom && !item.customFrame?.uploadedImageUrl && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">
                            🎨 Design to be finalized by FrameKart team
                          </p>
                        )}
                        {item.isTemplate && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">
                            🎨 Design will be handled by FrameKart&apos;s design team
                          </p>
                        )}
                        {item.isCustom && item.customFrame?.occasionMetadata && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            {item.customFrame.occasion === "birthday" && item.customFrame.occasionMetadata.name && (
                              <p>For: {item.customFrame.occasionMetadata.name} ({item.customFrame.occasionMetadata.age})</p>
                            )}
                            {item.customFrame.occasion === "wedding" && item.customFrame.occasionMetadata.brideName && (
                              <p>{item.customFrame.occasionMetadata.brideName} & {item.customFrame.occasionMetadata.groomName}</p>
                            )}
                          </div>
                        )}
                        {item.isTemplate && item.templateFrame?.metadata && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            {item.templateFrame.occasion === "birthday" && item.templateFrame.metadata.name && (
                              <p>For: {item.templateFrame.metadata.name} ({item.templateFrame.metadata.age})</p>
                            )}
                            {item.templateFrame.occasion === "wedding" && item.templateFrame.metadata.brideName && (
                              <p>{item.templateFrame.metadata.brideName} & {item.templateFrame.metadata.groomName}</p>
                            )}
                          </div>
                        )}
                        <p className="mt-1 font-semibold text-primary text-sm sm:text-base">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-2">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(
                                item._id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                          >
                            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <span className="w-6 sm:w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => removeItem(item._id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                {eligibility.offerActive && eligibility.eligible && discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      Launch Offer ({eligibility.discountValue}% OFF)
                    </span>
                    <span className="font-semibold">-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
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
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      You&apos;re saving {formatPrice(discount)}! 🎉
                    </p>
                  )}
                </div>
              </div>

              <Link href="/checkout" className="mt-6 block">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link href="/frames" className="mt-4 block">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
