"use client";

import { motion } from "framer-motion";
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
      <div className="px-4 py-4 md:hidden">
        <div className="relative h-[220px] overflow-hidden rounded-[24px] bg-background shadow-[0_16px_40px_rgba(15,23,42,0.12)] ring-1 ring-black/5">
          <Image
            key={`mobile-${currentSlide}`}
            src={currentHero.image}
            alt={currentHero.highlight}
            fill
            sizes="100vw"
            className="object-cover object-right opacity-100 brightness-100 contrast-100 saturate-100"
            priority
          />
          <div className="absolute inset-y-0 left-0 w-[38%] bg-gradient-to-r from-white/10 via-transparent to-transparent" />
          <div className="relative z-10 grid h-full grid-cols-[55%_45%] p-5">
            <motion.div
              key={`mobile-copy-${currentSlide}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className="flex w-[55%] max-w-[55%] flex-col justify-center"
            >
              <HeroCopy slide={currentHero} mobile />
            </motion.div>
            <div aria-hidden="true" />
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={`mobile-indicator-${index}`}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? "w-8 bg-primary" : "w-2 bg-black/15 hover:bg-black/30"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide}
            />
          ))}
        </div>
      </div>

      {/* Desktop Slider */}
      <div className="relative hidden h-[560px] overflow-hidden md:block lg:h-[700px]">
        <Image
          key={`desktop-${currentSlide}`}
          src={currentHero.image}
          alt={currentHero.highlight}
          fill
          sizes="100vw"
          className="object-cover object-right transition-opacity duration-700"
          priority
        />

        <div className="relative z-10 h-full">
          <div className="container mx-auto grid h-full grid-cols-[52%_48%] items-center px-8 lg:grid-cols-2">
            <motion.div
              key={`desktop-copy-${currentSlide}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-full pr-6 md:max-w-lg lg:max-w-xl lg:pr-0"
            >
              <HeroCopy slide={currentHero} />
            </motion.div>
            <div aria-hidden="true" />
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={`desktop-indicator-${index}`}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? "w-8 bg-primary" : "w-2 bg-white/50 hover:bg-white"
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
