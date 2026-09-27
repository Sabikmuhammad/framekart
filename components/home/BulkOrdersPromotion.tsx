"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Image as ImageIcon, Layers, Sparkles, CircleDot } from "lucide-react";

export default function BulkOrdersPromotion() {
  const containerRef = useRef<HTMLElement>(null);
  
  return (
    <section 
      ref={containerRef}
      className="relative py-12 md:py-20 bg-[#F8FAFC] overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-[1200px]">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-50px" }}
          className="bg-white rounded-[28px] md:rounded-[36px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-[#E2E8F0]/80 overflow-hidden relative"
        >
          {/* Subtle background texture/glow in the card */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#3B82F6]/5 to-transparent rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
          
          <div className="flex flex-col lg:flex-row relative z-10">
            
            {/* LEFT: IMAGE COLLAGE (55% on desktop, Top on mobile) */}
            <div className="w-full lg:w-[55%] relative p-6 sm:p-10 md:p-12 pb-0 lg:pb-12 min-h-[380px] sm:min-h-[480px] lg:min-h-[550px] flex items-center justify-center lg:justify-start">
              
              <div className="relative w-full max-w-[450px] lg:max-w-[500px] aspect-[4/3] sm:aspect-square lg:aspect-[4/3] lg:translate-x-8">
                
                {/* Main Large Frame */}
                <motion.div
                  initial={{ opacity: 0, y: 20, rotate: 1 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 2 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  className="absolute top-[5%] right-[5%] w-[65%] h-[80%] rounded-[16px] overflow-hidden shadow-2xl border-[6px] border-white z-10"
                >
                  <Image 
                    src="/images/templates/birthday-template.jpg"
                    alt="Main large premium frame for bulk orders"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    sizes="(max-width: 768px) 60vw, 35vw"
                    priority
                  />
                  <div className="absolute inset-0 ring-1 ring-black/5 rounded-[10px] pointer-events-none" />
                </motion.div>
                
                {/* Secondary Floating Frame (Bottom Left) */}
                <motion.div
                  initial={{ opacity: 0, y: -20, x: -10, rotate: -3 }}
                  whileInView={{ opacity: 1, y: 0, x: 0, rotate: -4 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  className="absolute bottom-[5%] left-[5%] w-[45%] h-[55%] rounded-[12px] overflow-hidden shadow-xl border-[4px] border-white z-20"
                >
                  <Image 
                    src="/images/custom-banner/p3.png" 
                    alt="Secondary premium frame showing a wedding photo"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    sizes="(max-width: 768px) 40vw, 25vw"
                  />
                  <div className="absolute inset-0 ring-1 ring-black/5 rounded-[8px] pointer-events-none" />
                </motion.div>
                
                {/* Third Partially Visible Frame (Top Left, behind) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  className="absolute top-[8%] left-[15%] w-[35%] h-[40%] rounded-[10px] overflow-hidden shadow-lg border-[3px] border-white z-0"
                >
                  <Image 
                    src="/images/custom-banner/p4.png" 
                    alt="Tertiary frame partially visible"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 30vw, 15vw"
                  />
                  <div className="absolute inset-0 bg-white/20 pointer-events-none" />
                </motion.div>

                {/* Cute Handwritten Note */}
                <motion.div 
                  initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                  whileInView={{ opacity: 1, rotate: -6, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: "backOut" }}
                  viewport={{ once: true }}
                  className="absolute bottom-[20%] -right-[5%] z-30 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-[#E2E8F0]"
                >
                  <p className="font-['Caveat',cursive,sans-serif] text-[20px] text-[#475569] leading-none tracking-wide">
                    Made for your moments.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* RIGHT: CONTENT (45% on desktop, Bottom on mobile) */}
            <div className="w-full lg:w-[45%] p-6 pt-0 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center relative z-20">
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
              >
                {/* Editorial Label */}
                <div className="inline-flex items-center gap-2 mb-6 sm:mb-8 border-b border-[#3B82F6]/30 pb-1">
                  <CircleDot className="w-3 h-3 text-[#3B82F6]" />
                  <span className="text-[11px] font-[700] tracking-[0.15em] uppercase text-[#334155]">
                    BULK ORDER STUDIO
                  </span>
                </div>
                
                {/* Headline */}
                <h2 className="text-[34px] sm:text-[40px] lg:text-[48px] font-[800] tracking-tight leading-[1.08] text-[#0F172A] mb-5">
                  More Memories.<br />
                  One Beautiful <br className="hidden lg:block" />
                  <span className="text-[#3B82F6]">Order.</span>
                </h2>
                
                {/* Description */}
                <p className="text-[16px] sm:text-[17px] leading-[1.6] text-[#64748B] mb-5 max-w-[440px]">
                  Choose from our premium frames or upload your own photos and create beautiful framed memories in bulk.
                </p>
                
                <p className="text-[13px] font-[600] text-[#94A3B8] mb-8 tracking-widest uppercase">
                  Weddings · Events · Corporate · Gifting
                </p>

                {/* Micro Benefits Row */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mb-8 pb-8 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-1.5 text-[13px] font-[500] text-[#475569]">
                    <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>Premium Framing</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] font-[500] text-[#475569]">
                    <Layers className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>Custom Quantities</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] font-[500] text-[#475569]">
                    <ImageIcon className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>Your Photos</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link href="/bulk-orders" className="w-full sm:w-auto">
                    <Button 
                      className="w-full h-12 sm:h-14 px-8 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-[500] text-[15px] sm:text-[16px] shadow-[0_8px_20px_-4px_rgba(15,23,42,0.2)] transition-all duration-300 group active:scale-[0.98]"
                    >
                      Explore Bulk Orders
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <p className="text-[12px] text-[#94A3B8] hidden sm:block">
                    Choose our frames or <br/> bring your own photos.
                  </p>
                </div>
                
              </motion.div>
            </div>
            
          </div>
        </motion.div>
      </div>
    </section>
  );
}
