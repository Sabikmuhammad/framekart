"use client";

import HeroButtons from "./HeroButtons";
import type { HeroSlide } from "./heroData";

interface HeroCopyProps {
  slide: HeroSlide;
  mobile?: boolean;
}

export default function HeroCopy({ slide, mobile = false }: HeroCopyProps) {
  return (
    <>
      <h1
        className={
          mobile
            ? "mb-2 text-[28px] font-black leading-tight tracking-tight text-black"
            : "mb-3 text-3xl font-bold tracking-tight text-black sm:mb-4 sm:text-4xl md:mb-5 md:text-5xl lg:mb-6 lg:text-6xl"
        }
      >
        {slide.title} <span className="text-primary">{slide.highlight}</span>
      </h1>
      {!mobile && (
        <p className="mb-5 text-sm leading-snug text-black/80 sm:mb-6 sm:text-base md:mb-7 md:text-lg lg:mb-8 lg:text-xl">
          {slide.description}
        </p>
      )}
      <HeroButtons buttons={slide.buttons} mobile={mobile} />
    </>
  );
}
