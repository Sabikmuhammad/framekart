"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="pt-8 sm:pt-12 pb-12 sm:pb-16 md:pb-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-50px" }}
          className="relative rounded-[24px] md:rounded-[32px] overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0] shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
        >
          {/* Subtle Ambient Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] sm:w-[80%] h-[120%] sm:h-[80%] bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.08)_0%,_transparent_70%)] rounded-full pointer-events-none" />
          
          <div className="absolute -top-4 -left-4 opacity-[0.03] pointer-events-none transform -rotate-12">
            <ImageIcon className="w-32 h-32" strokeWidth={1} />
          </div>

          <div className="py-10 sm:py-12 md:py-14 px-6 md:px-12 text-center relative z-10 flex flex-col items-center">
            
            <h2 className="mb-3 text-[26px] sm:text-[32px] md:text-[40px] font-[800] text-[#0F172A] tracking-tight leading-[1.1] max-w-2xl">
              READY TO FRAME <br className="hidden sm:block" /> SOMETHING <span className="text-[#3B82F6]">BEAUTIFUL?</span>
            </h2>
            
            <p className="mb-8 text-[14px] sm:text-[16px] text-[#64748B] font-medium leading-[1.5] max-w-md mx-auto">
              Explore our curated collection of premium frames and find the perfect piece for your space.
            </p>
            
            <div className="w-full sm:w-auto">
              <Link href="/frames" className="inline-block w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-[48px] px-8 rounded-[12px] bg-[#3B82F6] hover:bg-[#2563EB] text-white font-[500] text-[15px] shadow-[0_4px_14px_rgba(59,130,246,0.3)] transition-all duration-300 group active:scale-[0.98]">
                  Explore Frames
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
