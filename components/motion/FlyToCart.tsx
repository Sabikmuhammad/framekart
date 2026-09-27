"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useFlyCartStore } from "@/store/fly-cart";
import { useEffect, useState } from "react";
import Image from "next/image";

export function FlyToCart() {
  const items = useFlyCartStore((state) => state.items);
  const removeItem = useFlyCartStore((state) => state.removeItem);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {items.map((item) => {
          const { startRect, targetRect, id, imageSrc } = item;
          
          return (
            <motion.div
              key={id}
              initial={{
                opacity: 1,
                scale: 1,
                x: startRect.left,
                y: startRect.top,
                width: startRect.width,
                height: startRect.height,
              }}
              animate={{
                opacity: [1, 1, 0], // Fade out at the very end
                scale: [1, 0.75, 0.25], // Shrink
                x: targetRect.left + (targetRect.width / 2) - (startRect.width / 2),
                y: targetRect.top + (targetRect.height / 2) - (startRect.height / 2),
                rotate: [0, -3, 2, 0], // Subtle rotation
              }}
              transition={{
                duration: 1.1,
                times: [0, 0.8, 1],
                // We use slightly different easings for x and y to create an arc
                x: { ease: "linear" },
                y: { type: "spring", stiffness: 120, damping: 24 },
                scale: { ease: [0.16, 1, 0.3, 1] },
                opacity: { ease: "linear" }
              }}
              onAnimationComplete={() => removeItem(id)}
              className="absolute overflow-hidden rounded-[14px] shadow-[0_10px_30px_rgba(0,0,0,0.15)] bg-white pointer-events-none"
            >
              <Image 
                src={imageSrc} 
                alt="Adding to cart" 
                fill 
                className="object-cover" 
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
