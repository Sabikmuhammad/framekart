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
      className="relative"
      onTouchStart={handleHeroTouchStart}
      onTouchEnd={handleHeroTouchEnd}
    >
      {/* Mobile Slider */}
      <div className="w-full md:hidden mb-7">
        <div className="relative h-[375px] sm:h-[400px] w-full overflow-hidden bg-[#F8FAFC]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`mobile-bg-${currentSlide}`}
              initial={{ scale: 1.015, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.015, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={currentHero.image}
                alt={currentHero.highlight}
                fill
                sizes="100vw"
                className="object-cover object-[78%_center]"
                priority
              />
            </motion.div>
          </AnimatePresence>
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              background: 'linear-gradient(100deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 58%, rgba(255,255,255,0) 90%)'
            }}
          />
          <div className="relative z-10 flex h-full flex-col justify-center px-[22px] sm:px-7 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`mobile-copy-${currentSlide}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="flex w-full flex-col justify-center"
              >
                <HeroCopy slide={currentHero} mobile />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-5 flex justify-center gap-1.5">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={`mobile-indicator-${index}`}
              onClick={() => setCurrentSlide(index)}
              className={`h-[7px] rounded-full transition-all duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                index === currentSlide ? "w-[34px] bg-[#3B82F6]" : "w-[7px] bg-[#CBD5E1] hover:bg-[#94A3B8]"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide}
            />
          ))}
        </div>
      </div>

      {/* Desktop Slider */}
      <div className="relative hidden h-[560px] overflow-hidden md:block lg:h-[700px] group">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`desktop-bg-${currentSlide}`}
            initial={{ scale: 1.04, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.04, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={currentHero.image}
              alt={currentHero.highlight}
              fill
              sizes="100vw"
              className="object-cover object-right"
              priority
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white via-white/80 to-transparent" />

        <div className="relative z-10 h-full">
          <div className="container mx-auto grid h-full grid-cols-[52%_48%] items-center px-8 lg:grid-cols-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={`desktop-copy-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-full pr-6 md:max-w-lg lg:max-w-xl lg:pr-0"
              >
                <HeroCopy slide={currentHero} />
              </motion.div>
            </AnimatePresence>
            <div aria-hidden="true" />
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-2.5">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={`desktop-indicator-${index}`}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                index === currentSlide ? "w-10 bg-[#3B82F6]" : "w-2 bg-black/20 hover:bg-black/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
