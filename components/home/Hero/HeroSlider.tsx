"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import HeroCopy from "./HeroCopy";
import { HERO_SLIDES, type HeroSlide } from "./heroData";
import type { TouchEvent } from "react";

interface HeroSliderProps {
  currentSlide: number;
  currentHero: HeroSlide;
  setCurrentSlide: (index: number) => void;
  handleHeroTouchStart: (event: TouchEvent<HTMLElement>) => void;
  handleHeroTouchEnd: (event: TouchEvent<HTMLElement>) => void;
}

export default function HeroSlider({
  currentSlide,
  currentHero,
  setCurrentSlide,
  handleHeroTouchStart,
  handleHeroTouchEnd,
}: HeroSliderProps) {
  return (
    <section
      className="relative w-full h-[375px] sm:h-[400px] md:h-[560px] lg:h-[700px] overflow-hidden bg-[#F8FAFC] group mb-7 md:mb-0"
      onTouchStart={handleHeroTouchStart}
      onTouchEnd={handleHeroTouchEnd}
    >
      {/* 
        STATIC LCP LAYER
        This image renders completely outside of Framer Motion to guarantee 
        zero hydration delay or Element Render Delay for the LCP paint.
      */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <Image
          src={HERO_SLIDES[0].image}
          alt={HERO_SLIDES[0].highlight}
          fill
          sizes="100vw"
          className="object-cover object-[78%_center] md:object-right"
          priority
        />
      </div>

      {/* ANIMATED SLIDES (Slide 1, 2, 3...) */}
      <AnimatePresence>
        {currentSlide !== 0 && (
          <motion.div
            key={`bg-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full z-10 bg-[#F8FAFC]"
          >
            <Image
              src={currentHero.image}
              alt={currentHero.highlight}
              fill
              sizes="100vw"
              className="object-cover object-[78%_center] md:object-right"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* OVERLAYS */}
      <div 
        className="absolute inset-0 w-full h-full z-20 md:hidden"
        style={{
          background: 'linear-gradient(100deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 58%, rgba(255,255,255,0) 90%)'
        }}
      />
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white via-white/80 to-transparent z-20 hidden md:block" />

      {/* CONTENT & COPY */}
      <div className="relative z-30 h-full flex flex-col justify-center px-[22px] sm:px-7 md:px-8 container mx-auto">
        <div className="md:grid md:grid-cols-[52%_48%] lg:grid-cols-2 items-center h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`copy-${currentSlide}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col justify-center md:max-w-lg lg:max-w-xl md:pr-6 lg:pr-0"
            >
              <HeroCopy slide={currentHero} />
            </motion.div>
          </AnimatePresence>
          <div className="hidden md:block" aria-hidden="true" />
        </div>
      </div>

      {/* INDICATORS */}
      <div className="absolute bottom-5 md:bottom-10 left-1/2 z-40 flex -translate-x-1/2 gap-1.5 md:gap-2.5">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={`indicator-${index}`}
            onClick={() => setCurrentSlide(index)}
            className={`h-[7px] md:h-2 rounded-full transition-all duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              index === currentSlide 
                ? "w-[34px] md:w-10 bg-[#3B82F6]" 
                : "w-[7px] md:w-2 bg-[#CBD5E1] hover:bg-[#94A3B8] md:bg-black/20 md:hover:bg-black/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide}
          />
        ))}
      </div>
    </section>
  );
}
