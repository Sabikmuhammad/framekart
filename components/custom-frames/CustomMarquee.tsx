"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const CUSTOM_ITEMS = [
  "PREMIUM QUALITY",
  "✦",
  "FAST DELIVERY",
  "✦",
  "SECURE PACKAGING",
  "✦",
  "CUSTOM MADE FOR YOU",
  "✦",
  "CAREFULLY CRAFTED",
  "✦",
  "MUSEUM-QUALITY PRINTING",
  "✦",
  "MADE FOR YOUR SPACE",
  "✦"
];

interface CustomMarqueeProps {
  className?: string;
}

export function CustomMarquee({ className = "" }: CustomMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Subtle parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const parallaxX = useTransform(scrollYProgress, [0, 1], ["0%", "-4%"]);

  if (shouldReduceMotion) {
    return (
      <div 
        className={`w-full py-4 border-y border-gray-200 bg-gray-50/50 flex flex-wrap justify-center gap-x-4 gap-y-2 px-4 ${className}`}
        aria-label="FrameKart premium benefits"
      >
        {CUSTOM_ITEMS.filter((item) => item !== "✦").slice(0, 4).map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
             <span className="text-[10px] md:text-[11px] font-medium tracking-[0.18em] text-gray-500 uppercase">
               {item}
             </span>
             {idx < 3 && <span className="text-[#3B82F6]/40 text-[8px]">✦</span>}
          </div>
        ))}
      </div>
    );
  }

  // We duplicate the entire array block TWICE so that the entire block is 200% wide.
  // The CSS animation shifts the container by -50%, perfectly looping it.
  const MARQUEE_CONTENT = [...CUSTOM_ITEMS, ...CUSTOM_ITEMS, ...CUSTOM_ITEMS, ...CUSTOM_ITEMS];

  return (
    <div 
      ref={containerRef}
      className={`w-full max-w-[100vw] overflow-hidden border-y border-gray-200 bg-gray-50/50 py-3.5 md:py-4.5 flex select-none ${className}`}
      aria-label="FrameKart premium benefits"
    >
      <motion.div 
        style={{ x: parallaxX }}
        className="flex min-w-max"
      >
        <div 
          className="flex min-w-max items-center animate-[customMarquee_34s_linear_infinite] md:animate-[customMarquee_42s_linear_infinite] hover:[animation-play-state:paused] active:[animation-play-state:paused] will-change-transform"
        >
          {/* First block (50% of width) */}
          <div className="flex items-center min-w-max">
            {MARQUEE_CONTENT.map((item, idx) => (
              <span 
                key={idx} 
                className={`mx-4 md:mx-6 flex-shrink-0 ${
                  item === "✦" 
                    ? "text-[#3B82F6]/40 text-[9px] md:text-[10px]" 
                    : "text-[9px] md:text-[11px] font-medium tracking-[0.18em] text-gray-500 uppercase"
                }`}
              >
                {item}
              </span>
            ))}
          </div>
          {/* Second block (50% of width) - Exact duplicate for seamless looping */}
          <div className="flex items-center min-w-max">
            {MARQUEE_CONTENT.map((item, idx) => (
              <span 
                key={`dup-${idx}`} 
                className={`mx-4 md:mx-6 flex-shrink-0 ${
                  item === "✦" 
                    ? "text-[#3B82F6]/40 text-[9px] md:text-[10px]" 
                    : "text-[9px] md:text-[11px] font-medium tracking-[0.18em] text-gray-500 uppercase"
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
