"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

export default function InstagramSection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-pink-500/5 via-purple-500/5 to-orange-500/5 rounded-full blur-[80px]" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 mb-8 shadow-lg shadow-pink-500/20 transform -rotate-3 hover:rotate-0 transition-transform duration-500 cursor-default">
            <Instagram className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h2 className="text-[28px] sm:text-4xl md:text-5xl font-[800] tracking-[-0.02em] text-[#111827] mb-4">
            Join Our Community
          </h2>
          <p className="text-[16px] sm:text-[18px] text-[#6B7280] font-medium mb-10 leading-relaxed">
            Follow <span className="font-bold text-[#111827]">@framekart</span> for daily interior inspiration, behind-the-scenes, and exclusive drops.
          </p>
          <Button 
            size="lg" 
            className="h-14 px-8 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-[600] text-[15px] shadow-[0_8px_20px_-4px_rgba(59,130,246,0.3)] transition-all duration-300 group active:scale-[0.97]"
            onClick={() => window.open('https://instagram.com/framekartofficial', '_blank')}
          >
            <Instagram className="h-5 w-5 mr-2 opacity-80 group-hover:scale-110 transition-transform duration-300" />
            Follow on Instagram
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
