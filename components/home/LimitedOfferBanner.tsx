"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight } from "lucide-react";

interface Eligibility {
  eligible: boolean;
  discountValue: number;
  offerActive: boolean;
  offerName: string;
}

interface LimitedOfferBannerProps {
  eligibility: Eligibility;
}

export default function LimitedOfferBanner({ eligibility }: LimitedOfferBannerProps) {
  const categoryImages = {
    offerBanner: "/images/banners/offer-banner.jpg",
  };

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950 dark:via-orange-950 dark:to-red-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-500 to-orange-500 text-white overflow-hidden relative">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <Image
                src={categoryImages.offerBanner}
                alt="Special Offer Background"
                fill
                className="object-cover opacity-20"
              />
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <CardContent className="py-8 sm:py-12 px-6 sm:px-12 relative z-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                    <Zap className="h-5 w-5" />
                    <span className="font-bold text-sm">{eligibility.offerName.toUpperCase()}</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                    FLAT {eligibility.discountValue}% OFF
                  </h2>
                  <p className="text-lg sm:text-xl mb-6 text-white/90">
                    On All Frames & Wall Art
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                    <Link href="/frames">
                      <Button size="lg" variant="secondary" className="gap-2 shadow-xl">
                        Shop Now
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="hidden md:flex justify-center items-center">
                  <div className="relative">
                    <div className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20">
                      <div className="text-6xl font-bold mb-2">30%</div>
                      <div className="text-2xl font-semibold">OFF</div>
                      <div className="mt-4 text-sm opacity-90"></div>
                    </div>
                    <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm rotate-12 shadow-lg">
                      SAVE BIG!
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
