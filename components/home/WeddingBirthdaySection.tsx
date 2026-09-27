"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Heart,
  Cake,
  Users,
  Package,
  MessageCircle,
  Gift,
  ImageIcon,
  Palette,
} from "lucide-react";

const CARDS = [
  {
    href: "/custom-frame/wedding",
    image: "/images/templates/wedding-template.jpeg",
    alt: "Wedding Frame Template",
    eyebrow: "FOR COUPLES",
    title: "Wedding Frames",
    description:
      "Preserve your most cherished moments in a frame crafted with care. Our design team transforms your photo into a timeless keepsake.",
    icon: Heart,
    tags: [
      { icon: Palette, label: "Custom Design" },
      { icon: Users, label: "Expert Team" },
      { icon: Package, label: "A4 Size" },
    ],
    cta: "Create Wedding Frame",
  },
  {
    href: "/custom-frame/birthday",
    image: "/images/templates/birthday-template.jpg",
    alt: "Birthday Frame Template",
    eyebrow: "FOR CELEBRATIONS",
    title: "Birthday Frames",
    description:
      "Turn a birthday into a memory that lasts forever. Upload a photo, add a message, and we'll handle the rest.",
    icon: Cake,
    tags: [
      { icon: ImageIcon, label: "Your Photo" },
      { icon: MessageCircle, label: "Custom Message" },
      { icon: Gift, label: "A4 Size" },
    ],
    cta: "Create Birthday Frame",
  },
];

const PROCESS = [
  { icon: ImageIcon, step: "01", title: "Upload Photo", description: "Share your favourite image with us" },
  { icon: Palette, step: "02", title: "Choose Style", description: "Pick from curated frame designs" },
  { icon: Users, step: "03", title: "We Design", description: "Our team crafts your frame" },
  { icon: Package, step: "04", title: "Delivered", description: "Premium print at your door" },
];

export default function WeddingBirthdaySection() {
  const containerRef = useRef<HTMLElement>(null);
  
  return (
    <section
      ref={containerRef}
      className="relative py-12 sm:py-16 lg:py-24 overflow-hidden bg-[#FAFAFA] text-[#111827]"
      aria-labelledby="occasions-heading"
    >
      {/* Extremely subtle ambient background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">

        {/* ── Section Header ── */}
        <div className="max-w-[600px] mb-10 sm:mb-14 lg:mb-20 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center mb-4 lg:mb-5"
          >
            <span className="text-[9px] lg:text-[10px] font-[600] tracking-[0.25em] uppercase text-[#64748B]">
              Special Occasions
            </span>
          </motion.div>

          <motion.h2
            id="occasions-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="text-[30px] sm:text-[34px] lg:text-[54px] font-[700] tracking-[-0.03em] leading-[1.1] mb-4 lg:mb-6"
          >
            Frames made for <br className="hidden sm:block" />
            <span className="text-[#3B82F6]">your moments.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="text-[14px] sm:text-[15px] lg:text-[17px] text-[#64748B] leading-relaxed mx-auto font-medium"
          >
            Upload your photo, add a personal message, and our design team will
            create a stunning custom frame.
          </motion.p>
        </div>

        {/* ── Compact Editorial Occasion Cards ── */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 max-w-[1100px] mx-auto">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            const numberStr = `0${i + 1}`;
            
            return (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 15, scale: 0.99 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                className="w-full"
              >
                <Link href={card.href} aria-label={card.cta} className="block w-full outline-none group">
                  <div className="bg-white rounded-[20px] lg:rounded-[22px] border border-[#E5E7EB] overflow-hidden shadow-[0_12px_40px_rgba(15,23,42,0.06)] group-hover:shadow-[0_20px_50px_rgba(15,23,42,0.10)] transition-shadow duration-[600ms] flex flex-col mx-auto max-w-[380px] sm:max-w-[420px] lg:max-w-none h-[380px] sm:h-[400px] lg:h-[460px]">
                    
                    {/* Compact Image Area */}
                    <div className="relative h-[180px] lg:h-[220px] w-full overflow-hidden shrink-0">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="w-full h-full bg-[#F1F5F9]"
                      >
                        <Image
                          src={card.image}
                          alt={card.alt}
                          fill
                          className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.035]"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </motion.div>
                    </div>

                    {/* Clean Content Area */}
                    <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-1 bg-white">
                      
                      {/* Top Meta */}
                      <div className="flex items-center justify-between mb-2 lg:mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <Icon className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-[#64748B]" />
                          <span className="text-[9px] lg:text-[10px] text-[#64748B] font-[600] tracking-[0.18em] uppercase">
                            {card.eyebrow}
                          </span>
                          <span className="bg-[#EFF6FF] text-[#3B82F6] border border-[#DBEAFE] text-[8px] lg:text-[9px] font-[700] tracking-wider uppercase px-1.5 py-[2px] rounded-full ml-1">
                            NEW
                          </span>
                        </div>
                        <span className="text-[10px] text-[#CBD5E1] font-[600] tracking-wider">
                          {numberStr}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-[20px] sm:text-[22px] lg:text-[26px] font-[600] text-[#111827] tracking-[-0.025em] leading-[1.1] mb-1.5">
                        {card.title}
                      </h3>

                      {/* Description */}
                      <p className="text-[12px] lg:text-[13px] text-[#64748B] leading-[1.5] line-clamp-2 mb-3 lg:mb-3.5">
                        {card.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 lg:gap-2 mb-auto">
                        {card.tags.map((tag, tagIdx) => {
                          const TagIcon = tag.icon;
                          const displayClass = tagIdx > 1 ? "hidden lg:inline-flex" : "inline-flex";
                          return (
                            <span
                              key={tagIdx}
                              className={`${displayClass} items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] text-[9px] lg:text-[10px] font-medium px-2 py-1 lg:px-2.5 lg:py-1.5 rounded-full`}
                            >
                              <TagIcon className="h-2.5 w-2.5" />
                              {tag.label}
                            </span>
                          );
                        })}
                      </div>

                      {/* Minimal Premium CTA */}
                      <div className="pt-3 lg:pt-4 flex items-center gap-1.5 group/link mt-auto w-max">
                        <span className="text-[12px] lg:text-[13px] font-[600] text-[#3B82F6] relative">
                          {card.cta}
                          <span className="absolute -bottom-[2px] left-0 right-0 h-[1px] bg-[#3B82F6] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover/link:scale-x-100" />
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#3B82F6] transition-transform duration-300 ease-out group-hover/link:translate-x-1" />
                      </div>

                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ── Process Timeline ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mt-20 sm:mt-24 lg:mt-28 max-w-[900px] mx-auto"
        >
          {/* Subtle Divider Header */}
          <div className="flex items-center justify-center mb-10 sm:mb-12 lg:mb-16">
            <span className="text-[10px] lg:text-[11px] font-[600] tracking-[0.2em] uppercase text-[#64748B]">
              How it works
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-6">
            {PROCESS.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center group cursor-default"
                >
                  {/* Minimal Circle */}
                  <div className="relative w-[48px] h-[48px] lg:w-[54px] lg:h-[54px] rounded-full bg-white border border-[#E5E7EB] shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex items-center justify-center mb-3 lg:mb-4 group-hover:border-[#3B82F6] transition-colors duration-300">
                    <StepIcon className="h-[18px] w-[18px] lg:h-5 lg:w-5 text-[#111827] group-hover:text-[#3B82F6] transition-colors duration-300" />
                  </div>

                  <div className="flex flex-col items-center">
                    <p className="text-[9px] lg:text-[10px] font-[700] tracking-[0.15em] text-[#3B82F6] uppercase mb-1">
                      {step.step}
                    </p>
                    <h4 className="text-[15px] lg:text-[16px] font-[600] text-[#111827] mb-1 tracking-tight">
                      {step.title}
                    </h4>
                    <p className="text-[12px] lg:text-[13px] text-[#64748B] font-medium leading-[1.4] max-w-[140px] lg:max-w-[160px]">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Final Compact CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mt-20 lg:mt-28 mx-auto px-0 sm:px-4 lg:px-0"
        >
          <div className="relative overflow-hidden rounded-[22px] lg:rounded-[24px] bg-white px-5 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-10 border border-[#E5E7EB] max-w-[900px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left shadow-[0_12px_40px_rgba(15,23,42,0.06)] mx-4 sm:mx-0">
            
            {/* Subtle Luxury CTA Background Ambience */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div 
                className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
              />
              <motion.div 
                animate={{ 
                  x: ["0%", "15%", "0%", "-15%", "0%"],
                  y: ["0%", "10%", "0%", "-10%", "0%"]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-[300px] h-[300px] bg-[#3B82F6]/5 rounded-full blur-[80px]" 
              />
            </div>

            <div className="relative z-10">
              <h3 className="text-[22px] sm:text-[24px] lg:text-[32px] font-[700] text-[#111827] tracking-[-0.02em] leading-[1.2] mb-2 lg:mb-3">
                Ready to create something special?
              </h3>
              <p className="text-[13px] lg:text-[14px] text-[#64748B] font-medium">
                Trusted by thousands of happy customers.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full lg:w-auto shrink-0">
              <Link href="/custom-frame/wedding" className="w-full sm:w-auto outline-none">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-[44px] lg:h-[48px] px-6 lg:px-8 rounded-full bg-transparent border-[#3B82F6]/30 text-[#3B82F6] font-[600] text-[13px] lg:text-[14px] hover:bg-[#EFF6FF] hover:border-[#3B82F6]/50 transition-all duration-300"
                >
                  Wedding
                </Button>
              </Link>
              <Link href="/custom-frame/birthday" className="w-full sm:w-auto outline-none group/cta-btn">
                <Button
                  className="w-full sm:w-auto h-[44px] lg:h-[48px] px-6 lg:px-8 rounded-full bg-[#3B82F6] text-white font-[600] text-[13px] lg:text-[14px] hover:bg-[#2563EB] hover:shadow-[0_8px_20px_-4px_rgba(59,130,246,0.3)] transition-all duration-300 border border-transparent"
                >
                  Birthday
                  <ArrowRight className="h-3.5 w-3.5 ml-2 text-white/90 group-hover/cta-btn:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
            
          </div>

        </motion.div>

      </div>
    </section>
  );
}
