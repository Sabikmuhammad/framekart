"use client";

import { motion } from "framer-motion";
import HeroButtons from "./HeroButtons";
import type { HeroSlide } from "./heroData";

interface HeroCopyProps {
  slide: HeroSlide;
  mobile?: boolean;
}

export default function HeroCopy({ slide, mobile = false }: HeroCopyProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: mobile ? 8 : 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: mobile ? -6 : -10, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        visible: { transition: { staggerChildren: mobile ? 0.05 : 0.1 } }
      }}
      className={mobile ? "flex flex-col max-w-[290px]" : ""}
    >
      {slide.eyebrow && (
        <motion.span
          variants={itemVariants}
          className={
            mobile
              ? "block mb-1.5 text-[10px] font-[600] uppercase tracking-[0.16em] text-[#64748B]"
              : "block mb-3 text-xs font-[700] uppercase tracking-[0.2em] text-[#64748B] lg:text-sm"
          }
        >
          {slide.eyebrow}
        </motion.span>
      )}

      <motion.h1
        variants={itemVariants}
        className={
          mobile
            ? "mb-2 text-[clamp(28px,8vw,34px)] font-[750] leading-[1.05] tracking-[-0.02em] text-[#0F172A]"
            : "mb-3 text-4xl font-[800] tracking-[-0.02em] text-[#0F172A] sm:mb-4 sm:text-5xl md:mb-5 md:text-6xl lg:mb-6 lg:text-[72px] lg:leading-[1.1]"
        }
      >
        {slide.title} <span className="text-[#3B82F6]">{slide.highlight}</span>
      </motion.h1>

      {(slide.description && (!mobile || true)) && (
        <motion.p 
          variants={itemVariants}
          className={
            mobile
              ? "mb-2.5 text-[13px] leading-[1.45] text-[#64748B] max-w-[280px]"
              : "mb-5 text-[15px] leading-relaxed text-[#4B5563] sm:mb-6 sm:text-base md:mb-7 md:text-lg lg:mb-8 lg:text-xl lg:max-w-md font-medium"
          }
        >
          {slide.description}
        </motion.p>
      )}

      {slide.benefit && (
        <motion.div variants={itemVariants} className={mobile ? "mb-3" : "mb-5"}>
          <p className={
            mobile 
              ? "text-[11px] font-[500] text-[#475569] flex items-center gap-1.5"
              : "text-[13px] font-[600] text-[#475569] flex items-center gap-2"
          }>
            {slide.benefit}
          </p>
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <HeroButtons buttons={slide.buttons} mobile={mobile} />
      </motion.div>
    </motion.div>
  );
}
