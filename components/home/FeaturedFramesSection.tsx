"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import FrameCard from "@/components/FrameCard";

interface Eligibility {
  eligible: boolean;
  discountValue: number;
  offerActive: boolean;
  offerName: string;
}

interface FeaturedFramesSectionProps {
  frames: any[];
  loading: boolean;
  eligibility: Eligibility;
}

export default function FeaturedFramesSection({
  frames,
  loading,
  eligibility,
}: FeaturedFramesSectionProps) {
  return (
    <section className="py-12 sm:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-8 sm:mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold">Featured Frames</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Handpicked selections to elevate your space
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="h-80 animate-pulse bg-muted" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
          >
            {frames.map((frame: any, index: number) => (
              <motion.div
                key={frame._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <FrameCard 
                  frame={frame} 
                  showDiscountBadge={eligibility.eligible && eligibility.offerActive}
                  discountValue={eligibility.discountValue}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-8 sm:mt-12 text-center">
          <Link href="/frames">
            <Button size="lg" variant="outline" className="gap-2">
              View All Frames
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
