"use client";

import { motion } from "framer-motion";
import { Users, Package, Star, MessageCircle } from "lucide-react";

export default function StatsSection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white text-[#111827] relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.05)_0%,_transparent_50%)] pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto">
          {[
            { value: "10K+", label: "Happy Customers", icon: Users },
            { value: "50K+", label: "Frames Crafted", icon: Package },
            { value: "4.9/5", label: "Average Rating", icon: Star },
            { value: "24/7", label: "Expert Support", icon: MessageCircle },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 mb-5 group-hover:scale-110 group-hover:bg-[#3B82F6]/10 transition-all duration-300">
                <stat.icon className="h-5 w-5 text-[#3B82F6]" />
              </div>
              <div className="text-3xl sm:text-4xl md:text-[40px] font-[800] tracking-[-0.03em] mb-2 text-[#111827]">
                {stat.value}
              </div>
              <div className="text-[13px] sm:text-[14px] text-[#6B7280] font-medium tracking-wide uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
