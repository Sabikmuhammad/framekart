"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Palette, ArrowRight } from "lucide-react";

export default function CustomFrameBanner() {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          className="rounded-[32px] overflow-hidden bg-[#FAFAFA] border border-gray-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative"
        >
          {/* Background Ambient Glow */}
          <div className="absolute top-0 left-1/4 w-3/4 h-3/4 bg-[#3B82F6]/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="p-8 sm:p-12 md:p-16 lg:p-20 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              
              {/* Text Content */}
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 bg-[#3B82F6]/10 text-[#3B82F6] px-3 py-1.5 rounded-full text-[11px] md:text-xs font-[700] tracking-wider mb-6 border border-[#3B82F6]/20">
                  <Palette className="h-3.5 w-3.5" />
                  THE STUDIO EXPERIENCE
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-[800] text-[#111827] leading-[1.1] tracking-[-0.03em] mb-6">
                  Design Your Perfect <br />
                  <span className="text-[#3B82F6]">Custom Frame.</span>
                </h2>
                <p className="text-[#6B7280] mb-10 text-[16px] md:text-[18px] leading-relaxed max-w-lg font-medium">
                  Upload your photo, choose your exact dimensions, select premium materials, and we&apos;ll handcraft a gallery-quality frame just for you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/custom-frame">
                    <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-[600] text-[15px] shadow-[0_8px_20px_-4px_rgba(59,130,246,0.4)] transition-all duration-300 group active:scale-[0.97]">
                      <Palette className="h-5 w-5 mr-2" />
                      Start Creating
                      <ArrowRight className="h-4 w-4 ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/frames">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-xl font-[600] text-[15px] bg-white border-[#3B82F6]/30 text-[#3B82F6] hover:bg-[#EFF6FF] hover:border-[#3B82F6]/50 transition-all duration-300 active:scale-[0.97]">
                      Explore Ready Frames
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Image Grid */}
              <div className="order-1 lg:order-2 relative w-full max-w-[500px] mx-auto lg:mx-0 lg:ml-auto">
                <div className="grid grid-cols-2 gap-4 md:gap-5">
                  <div className="space-y-4 md:space-y-5">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="aspect-square rounded-2xl overflow-hidden shadow-2xl transform rotate-2 relative ring-1 ring-white/10 group cursor-pointer"
                    >
                      <Image
                        src="/images/custom-banner/p4.png"
                        alt="Custom Frame Example"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="aspect-square rounded-2xl overflow-hidden shadow-2xl transform -rotate-3 relative ring-1 ring-white/10 group cursor-pointer"
                    >
                      <Image
                        src="/images/custom-banner/p3.png"
                        alt="Custom Frame Example"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  </div>
                  <div className="space-y-4 md:space-y-5 pt-8 md:pt-10">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl transform -rotate-2 relative ring-1 ring-white/10 group cursor-pointer"
                    >
                      <Image
                        src="/images/custom-banner/p7.webp"
                        alt="Custom Frame Example"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
