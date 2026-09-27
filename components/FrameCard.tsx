"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { Plus, Check } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useFlyCartStore } from "@/store/fly-cart";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

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
  const addFlyItem = useFlyCartStore((state) => state.addFlyItem);
  const { toast } = useToast();
  const [isAdded, setIsAdded] = useState(false);

  const hasDiscount = showDiscountBadge && discountValue > 0;
  const discountedPrice = hasDiscount
    ? frame.price - Math.round((frame.price * discountValue) / 100)
    : frame.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    addItem({
      _id: frame._id,
      title: frame.title,
      price: discountedPrice,
      imageUrl: frame.imageUrl,
      frame_size: frame.frame_size,
      frame_material: frame.frame_material,
      isCustom: false,
    });
    
    const imageEl = document.querySelector(`[data-product-image="card-${frame._id}"]`) as HTMLElement;
    if (imageEl) {
      addFlyItem(frame.imageUrl, imageEl.getBoundingClientRect());
    }
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);

    toast({
      title: "Added to cart",
      description: `${frame.title} has been added to your cart.`,
    });
  };

  return (
    <div className="group h-full outline-none block">
      <div className="bg-white border border-[#E5E7EB] rounded-[14px] lg:rounded-[18px] overflow-hidden shadow-[0_6px_25px_rgba(15,23,42,0.02)] hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-400 lg:hover:-translate-y-[3px] flex flex-col h-full relative">
        
        {/* Product Image Area */}
        <Link href={`/frames/${frame.slug}`} className="block relative aspect-[4/5] bg-[#F8FAFC] overflow-hidden rounded-t-[14px] lg:rounded-t-[18px]" data-product-image={`card-${frame._id}`}>
          {hasDiscount && (
            <div className="absolute top-2.5 left-2.5 lg:top-3 lg:left-3 z-10 bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full flex items-center shadow-sm">
              {discountValue}% OFF
            </div>
          )}
          <Image
            src={frame.imageUrl}
            alt={frame.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:group-hover:scale-[1.035]"
          />
        </Link>

        {/* Product Information */}
        <div className="p-3 lg:p-[18px] flex flex-col flex-1 gap-3 justify-between">
          <Link href={`/frames/${frame.slug}`} className="block group-hover:text-[#3B82F6] transition-colors duration-200">
            <h3 className="font-[500] lg:font-[600] text-[12px] lg:text-[14px] text-[#111827] line-clamp-2 leading-snug mb-1">
              {frame.title}
            </h3>
            
            <div className="flex items-center gap-1.5 mt-1">
              <span className="font-[600] text-[13px] lg:text-[15px] text-[#111827]">
                {formatPrice(discountedPrice)}
              </span>
              {hasDiscount && (
                <span className="text-[10px] lg:text-[11px] text-[#94A3B8] font-[500] line-through">
                  {formatPrice(frame.price)}
                </span>
              )}
            </div>
          </Link>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full h-[36px] lg:h-[38px] rounded-[9px] font-[600] text-[12px] lg:text-[13px] transition-all duration-300 flex items-center justify-center gap-1.5 relative overflow-hidden active:scale-[0.97] ${
              isAdded 
                ? "bg-[#10B981] text-white" 
                : "bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-[0_2px_10px_rgba(59,130,246,0.2)]"
            }`}
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.div
                  key="added"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="flex items-center gap-1.5"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Added</span>
                </motion.div>
              ) : (
                <motion.div
                  key="add"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add to Cart</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </div>
  );
}
