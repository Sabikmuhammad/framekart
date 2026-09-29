"use client";

import { motion } from "framer-motion";
import HeroButtons from "./HeroButtons";
import type { HeroSlide } from "./heroData";

interface HeroCopyProps {
  slide: HeroSlide;
}

export default function HeroCopy({ slide }: HeroCopyProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        visible: { transition: { staggerChildren: 0.08 } }
      }}
      className="flex flex-col max-w-[290px] md:max-w-none"
    >
      {slide.eyebrow && (
        <motion.span
          variants={itemVariants}
          className="block mb-1.5 md:mb-3 text-[10px] md:text-xs lg:text-sm font-[600] md:font-[700] uppercase tracking-[0.16em] md:tracking-[0.2em] text-[#64748B]"
        >
          {slide.eyebrow}
        </motion.span>
      )}

      <motion.h1
        variants={itemVariants}
        className="mb-2 md:mb-5 lg:mb-6 text-[clamp(28px,8vw,34px)] md:text-5xl lg:text-[72px] lg:leading-[1.1] font-[750] md:font-[800] leading-[1.05] tracking-[-0.02em] text-[#0F172A]"
      >
        {slide.title} <span className="text-[#3B82F6]">{slide.highlight}</span>
      </motion.h1>

      {slide.description && (
        <motion.p 
          variants={itemVariants}
          className="mb-2.5 md:mb-7 lg:mb-8 text-[13px] md:text-lg lg:text-xl md:font-medium leading-[1.45] md:leading-relaxed text-[#64748B] md:text-[#4B5563] max-w-[280px] sm:max-w-none lg:max-w-md"
        >
          {slide.description}
        </motion.p>
      )}

      {slide.benefit && (
        <motion.div variants={itemVariants} className="mb-3 md:mb-5">
          <p className="text-[11px] md:text-[13px] font-[500] md:font-[600] text-[#475569] flex items-center gap-1.5 md:gap-2">
            {slide.benefit}
          </p>
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <HeroButtons buttons={slide.buttons} />
      </motion.div>
    </motion.div>
  );
}
