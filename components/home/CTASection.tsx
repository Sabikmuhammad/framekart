"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative rounded-[32px] overflow-hidden bg-[#3B82F6]"
        >
          {/* Subtle Ambient Background */}
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.0)_0%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.0)_100%)] opacity-50" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[100px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
          
          <div className="py-16 sm:py-20 md:py-24 px-6 text-center relative z-10 max-w-3xl mx-auto">
            <h2 className="mb-4 sm:mb-6 text-[32px] sm:text-4xl md:text-5xl font-[800] text-white tracking-[-0.03em] leading-tight">
              Ready to Transform Your Space?
            </h2>
            <p className="mb-8 sm:mb-10 text-[16px] sm:text-[18px] text-white/90 font-medium leading-relaxed max-w-xl mx-auto">
              Explore our curated collection of premium gallery frames and find the perfect match for your memories today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/frames">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-xl bg-white text-[#3B82F6] hover:bg-gray-50 font-[600] text-[15px] shadow-xl shadow-black/10 transition-all duration-300 group active:scale-[0.97]">
                  Start Shopping
                  <ArrowRight className="h-4 w-4 ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
