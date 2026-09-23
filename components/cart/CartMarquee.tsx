"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

const MARQUEE_ITEMS = [
  "FREE SHIPPING",
  "✦",
  "15% LAUNCH OFFER",
  "✦",
  "SECURE CHECKOUT",
  "✦",
  "PREMIUM PACKAGING",
  "✦",
  "CRAFTED FOR YOUR SPACE",
  "✦"
];

export function CartMarquee() {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Moves slightly left as you scroll down
  const parallaxX = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"]);

  const [isHovered, setIsHovered] = useState(false);

  const MarqueeContent = () => (
    <div className="flex items-center gap-8 px-4 whitespace-nowrap">
      {MARQUEE_ITEMS.map((item, i) => (
        <span key={i} className={item === "✦" ? "text-primary/40 text-[10px]" : ""}>
          {item}
        </span>
      ))}
    </div>
  );

  if (shouldReduceMotion) {
    return (
      <div className="w-full max-w-[100vw] overflow-hidden py-4 border-y border-border/50 bg-secondary/20 my-8 sm:my-12">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[10px] sm:text-[11px] font-medium tracking-[0.2em] text-muted-foreground uppercase px-4 text-center">
          <span>FREE SHIPPING</span>
          <span className="text-primary/40 text-[10px] hidden sm:inline">✦</span>
          <span>15% LAUNCH OFFER</span>
          <span className="text-primary/40 text-[10px] hidden sm:inline">✦</span>
          <span>SECURE CHECKOUT</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="w-full max-w-[100vw] overflow-hidden py-4 border-y border-border/50 bg-secondary/20 my-8 sm:my-12 group cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(false)}
    >
      <motion.div style={{ x: parallaxX }} className="flex w-max">
        {/* CSS Marquee Implementation for flawless hover pause */}
        <div 
          className="flex whitespace-nowrap text-[10px] sm:text-[11px] font-medium tracking-[0.2em] text-muted-foreground uppercase animate-cart-marquee"
          style={{ animationPlayState: isHovered ? 'paused' : 'running' }}
        >
          <MarqueeContent />
          <MarqueeContent />
          <MarqueeContent />
          <MarqueeContent />
        </div>
      </motion.div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes cartMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-cart-marquee {
          animation: cartMarquee 40s linear infinite;
          width: fit-content;
        }
      `}} />
    </div>
  );
}
