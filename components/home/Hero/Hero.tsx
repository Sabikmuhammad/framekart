"use client";

import { useState, useEffect, type TouchEvent } from "react";
import HeroSlider from "./HeroSlider";
import { HERO_SLIDES } from "./heroData";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Auto-rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleHeroTouchStart = (event: TouchEvent<HTMLElement>) => {
    setTouchStartX(event.touches[0]?.clientX ?? null);
  };

  const handleHeroTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (touchStartX === null) return;

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
    const deltaX = touchStartX - touchEndX;

    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    setTouchStartX(null);
  };

  const currentHero = HERO_SLIDES[currentSlide];

  return (
    <HeroSlider
      currentSlide={currentSlide}
      currentHero={currentHero}
      setCurrentSlide={setCurrentSlide}
      handleHeroTouchStart={handleHeroTouchStart}
      handleHeroTouchEnd={handleHeroTouchEnd}
    />
  );
}
