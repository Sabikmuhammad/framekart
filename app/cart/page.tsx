"use client";

import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react";
import { calculateOrderTotalClient } from "@/lib/launchOfferClient";
import { useState, useEffect } from "react";

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
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base truncate">{item.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {item.frame_size} • {item.frame_material}
                        </p>
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
