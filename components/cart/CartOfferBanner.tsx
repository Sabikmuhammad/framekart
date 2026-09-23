"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CartOfferBanner() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className="w-full bg-secondary/30 rounded-2xl p-8 sm:p-12 my-12 text-center border border-border/50">
        <h2 className="text-xl sm:text-2xl font-light mb-2">15% OFF YOUR FIRST FRAME</h2>
        <p className="text-muted-foreground text-sm mb-6">Launch offer automatically applied</p>
        <Link 
          href="/frames" 
          className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
        >
          SHOP FRAMES <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full bg-secondary/10 rounded-2xl p-8 sm:p-16 my-16 text-center border border-border/20 overflow-hidden relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        className="absolute inset-0 bg-secondary/30 -z-10"
        initial={{ scale: 1.1, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      
      <motion.h2 
        className="text-2xl sm:text-3xl font-light tracking-wide mb-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        15% OFF YOUR FIRST FRAME
      </motion.h2>
      
      <motion.p 
        className="text-muted-foreground text-sm sm:text-base mb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        Launch offer automatically applied
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Link 
          href="/frames" 
          className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider hover:text-primary transition-colors group"
        >
          SHOP FRAMES 
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
