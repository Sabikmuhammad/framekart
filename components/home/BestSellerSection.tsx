"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Eligibility {
  eligible: boolean;
  discountValue: number;
  offerActive: boolean;
  offerName: string;
}

interface BestSellerSectionProps {
  frames: any[];
  eligibility: Eligibility;
}

export default function BestSellerSection({ frames, eligibility }: BestSellerSectionProps) {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#FAFAFA]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-600 px-3 py-1 rounded-full mb-3 md:mb-4 border border-orange-200/50">
            <TrendingUp className="h-4 w-4" />
            <span className="font-[700] text-[11px] md:text-xs tracking-wider">TRENDING NOW</span>
          </div>
          <h2 className="text-[26px] md:text-3xl font-[800] tracking-[-0.02em] text-[#111827] mb-2 md:mb-3">
            Best Selling Frames
          </h2>
          <p className="text-[#6B7280] text-[15px] md:text-base font-medium">
            Our most loved frames, trusted by thousands.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.05 } }
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 max-w-7xl mx-auto"
        >
          {frames.slice(4, 8).map((frame: any, index) => {
            const hasDiscount = eligibility.offerActive && eligibility.eligible && eligibility.discountValue > 0;
            const discountedPrice = hasDiscount
              ? frame.price - Math.round((frame.price * eligibility.discountValue) / 100)
              : frame.price;

            return (
              <motion.div
                key={frame._id}
                variants={{
                  hidden: { opacity: 0, scale: 0.97 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
                }}
              >
                <Link href={`/frames/${frame.slug}`} className="block h-full group">
                  <Card className="overflow-hidden transition-all duration-300 border border-gray-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#3B82F6]/30 h-full flex flex-col rounded-2xl bg-white">
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="relative aspect-[4/5] overflow-hidden bg-[#FAFAFA]">
                        <Image
                          src={frame.imageUrl}
                          alt={frame.title}
                          fill
                          className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                        />
                        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                          {index === 0 && (
                            <div className="bg-[#111827] text-white text-[9px] md:text-[10px] font-bold tracking-wider px-2 py-1 rounded-sm shadow-sm">
                              #1 BESTSELLER
                            </div>
                          )}
                          {hasDiscount && (
                            <div className="bg-[#3B82F6] text-white text-[9px] md:text-[10px] font-bold tracking-wider px-2 py-1 rounded-sm shadow-sm w-max">
                              {eligibility.discountValue}% OFF
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-3 md:p-4 flex-1 flex flex-col gap-1.5">
                        <h3 className="font-[600] text-[13px] md:text-[15px] line-clamp-2 leading-tight text-[#111827] group-hover:text-[#3B82F6] transition-colors duration-200">
                          {frame.title}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-[11px] md:text-[12px] font-medium text-[#6B7280] ml-1">(4.9)</span>
                        </div>
                        <div className="mt-auto pt-2">
                          {hasDiscount ? (
                            <div className="flex items-center gap-2">
                              <p className="text-[14px] md:text-[16px] font-bold text-[#111827]">
                                {formatPrice(discountedPrice)}
                              </p>
                              <p className="text-[11px] md:text-[13px] text-[#9CA3AF] line-through font-medium">
                                {formatPrice(frame.price)}
                              </p>
                            </div>
                          ) : (
                            <p className="text-[14px] md:text-[16px] font-bold text-[#111827]">
                              {formatPrice(frame.price)}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-10 md:mt-14 flex justify-center">
          <Link href="/frames">
            <Button size="lg" variant="outline" className="h-12 px-8 rounded-xl font-[600] text-[14px] border border-[#3B82F6]/30 text-[#3B82F6] bg-white hover:bg-[#EFF6FF] hover:border-[#3B82F6]/50 shadow-sm transition-all duration-200 group active:scale-[0.97]">
              View All Bestsellers
              <ArrowRight className="h-[18px] w-[18px] ml-2 transition-transform duration-250 ease-out group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
