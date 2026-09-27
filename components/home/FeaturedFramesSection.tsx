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
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 md:mb-12 text-left md:text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <h2 className="mb-2 text-[26px] md:text-3xl font-[800] tracking-[-0.02em] text-[#111827]">Featured Frames</h2>
            <p className="text-[#6B7280] text-[15px] md:text-base font-medium">
              Handpicked selections to elevate your space
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 max-w-7xl mx-auto">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="h-80 animate-pulse bg-gray-100 rounded-2xl border-0" />
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.05 } }
            }}
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 max-w-7xl mx-auto"
          >
            {frames.map((frame: any) => (
              <motion.div
                key={frame._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
                }}
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

        <div className="mt-10 md:mt-14 flex justify-center">
          <Link href="/frames">
            <Button size="lg" variant="outline" className="h-12 px-8 rounded-xl font-[600] text-[14px] border border-[#3B82F6]/30 text-[#3B82F6] bg-white hover:bg-[#EFF6FF] hover:border-[#3B82F6]/50 shadow-sm transition-all duration-200 group active:scale-[0.97]">
              View All Frames
              <ArrowRight className="h-[18px] w-[18px] ml-2 transition-transform duration-250 ease-out group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
