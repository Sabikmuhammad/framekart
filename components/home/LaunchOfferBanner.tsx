"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Eligibility {
  eligible: boolean;
  discountValue: number;
  offerActive: boolean;
  offerName: string;
}

interface LaunchOfferBannerProps {
  eligibility: Eligibility;
}

export default function LaunchOfferBanner({ eligibility }: LaunchOfferBannerProps) {
  if (!eligibility.offerActive || !eligibility.eligible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground py-3 px-4"
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
        <span className="text-lg sm:text-xl font-bold flex items-center gap-2">
          🎉 {eligibility.offerName}: Flat {eligibility.discountValue}% OFF
        </span>
        <span className="text-sm sm:text-base opacity-90">
          Auto Applied at Checkout
        </span>
        <Link href="/frames" className="mt-1 sm:mt-0">
          <Button 
            variant="secondary" 
            size="sm" 
            className="gap-2 font-semibold shadow-lg hover:shadow-xl transition-shadow"
          >
            Shop Now & Save {eligibility.discountValue}%
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
