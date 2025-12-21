"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/components/ui/use-toast";

interface FrameCardProps {
  frame: {
    _id: string;
    title: string;
    slug: string;
    price: number;
    imageUrl: string;
    frame_size: string;
    frame_material: string;
    category: string;
  };
  showDiscountBadge?: boolean;
  discountValue?: number;
}

export default function FrameCard({ frame, showDiscountBadge = false, discountValue = 0 }: FrameCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  // Calculate discounted price
  const hasDiscount = showDiscountBadge && discountValue > 0;
  const discountedPrice = hasDiscount
    ? frame.price - Math.round((frame.price * discountValue) / 100)
    : frame.price;

  const handleAddToCart = () => {
    addItem({
      _id: frame._id,
      title: frame.title,
      price: frame.price,
      imageUrl: frame.imageUrl,
      frame_size: frame.frame_size,
      frame_material: frame.frame_material,
    });
    toast({
      title: "Added to cart",
      description: `${frame.title} has been added to your cart.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="group h-full"
    >
      <Card className="overflow-hidden transition-shadow hover:shadow-lg h-full flex flex-col">
        <Link href={`/frames/${frame.slug}`}>
          <div className="relative aspect-square overflow-hidden bg-muted">
            {/* Discount Badge */}
            {showDiscountBadge && discountValue > 0 && (
              <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                {discountValue}% OFF
              </div>
            )}
            <Image
              src={frame.imageUrl}
              alt={frame.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </Link>
        <CardContent className="p-2 sm:p-3 flex-1 flex flex-col gap-1">
          <Link href={`/frames/${frame.slug}`}>
            <h3 className="font-semibold text-[11px] sm:text-sm line-clamp-2 hover:text-primary leading-tight">
              {frame.title}
            </h3>
          </Link>
          <p className="text-[9px] sm:text-xs text-muted-foreground">
            {frame.frame_size}
          </p>
          <div className="mt-auto">
            {hasDiscount ? (
              <div className="flex flex-col gap-0.5">
                <p className="text-[10px] sm:text-xs text-muted-foreground line-through">
                  {formatPrice(frame.price)}
                </p>
                <p className="text-xs sm:text-base font-bold text-primary">
                  {formatPrice(discountedPrice)}
                </p>
              </div>
            ) : (
              <p className="text-xs sm:text-base font-bold text-primary">
                {formatPrice(frame.price)}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-2 sm:p-3 pt-0">
          <Button
            onClick={handleAddToCart}
            className="w-full text-[10px] sm:text-xs h-7 sm:h-9 px-2"
            size="sm"
          >
            <ShoppingCart className="h-3 w-3 sm:mr-1" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
