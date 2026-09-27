


          "use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight } from "lucide-react";

export default function NewsletterSection() {
  return (
    <section className="py-16 sm:py-24 bg-[#FAFAFA] relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-5xl mx-auto bg-white rounded-[32px] overflow-hidden border border-gray-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative"
        >
          {/* Subtle background element */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-50 rounded-full blur-[80px] pointer-events-none" />

          <div className="p-8 sm:p-12 md:p-16 relative z-10">
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#3B82F6]/10 text-[#3B82F6] px-3 py-1.5 rounded-full text-[11px] md:text-xs font-[700] tracking-wider mb-6 border border-[#3B82F6]/20">
                  <Mail className="h-3.5 w-3.5" />
                  STAY IN THE LOOP
                </div>
                <h2 className="text-[28px] sm:text-4xl md:text-[40px] font-[800] tracking-[-0.03em] text-[#111827] mb-4 leading-[1.1]">
                  Get 15% Off Your First Order.
                </h2>
                <p className="text-[#6B7280] text-[15px] md:text-[16px] font-medium leading-relaxed">
                  Join our newsletter for exclusive offers, new arrivals, and expert interior styling tips delivered to your inbox.
                </p>
              </div>
              
              <div className="w-full">
                <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="flex-1 h-14 px-5 rounded-xl border border-gray-200 bg-gray-50/50 text-[#111827] font-medium placeholder:text-gray-400 focus:bg-white focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 outline-none transition-all duration-200"
                    required
                  />
                  <Button size="lg" type="submit" className="h-14 px-8 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-[600] text-[15px] shadow-[0_8px_20px_-4px_rgba(59,130,246,0.3)] transition-all duration-200 group active:scale-[0.97] sm:w-auto w-full flex-shrink-0">
                    Subscribe
                    <ArrowRight className="h-4 w-4 ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
                <p className="text-[12px] text-[#9CA3AF] mt-4 font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  No spam. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
