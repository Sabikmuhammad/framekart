"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";

export default function LogoIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = prefersReducedMotion === true;

  useEffect(() => {
    setIsMounted(true);
    const seen = sessionStorage.getItem("framekart-logo-intro-seen");
    
    if (seen !== "true") {
      setIsVisible(true);
      // Lock body scrolling
      document.body.style.overflow = "hidden";
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Animation duration limits:
    // Total animation active duration should be around 1.8 to 2.2 seconds.
    // We exit after 1.8s for regular animation (leaving 0.3s for exit transition, completing at 2.1s),
    // and 0.4s for reduced motion (leaving 0.2s for exit transition, completing at 0.6s).
    const duration = shouldReduceMotion ? 400 : 1800;
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [isVisible, shouldReduceMotion]);

  // Clean up body scroll lock if unmounted prematurely
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!isMounted) return null;

  return (
    <AnimatePresence
      onExitComplete={() => {
        sessionStorage.setItem("framekart-logo-intro-seen", "true");
        document.body.style.overflow = "";
      }}
    >
      {isVisible && (
        <motion.div
          key="logo-intro"
          role="status"
          aria-label="FrameKart is loading"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
          initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{
            opacity: 0,
            scale: shouldReduceMotion ? 1 : 1.03,
            filter: shouldReduceMotion ? "blur(0px)" : "blur(8px)",
          }}
          transition={{
            duration: shouldReduceMotion ? 0.2 : 0.3,
            ease: "easeInOut",
          }}
        >
          <div className="relative flex flex-col items-center justify-center px-4">
            
            {/* 1. Very soft blue radial glow behind the logo */}
            {!shouldReduceMotion && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute w-56 h-56 md:w-80 md:h-80 rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.15)_0%,_transparent_70%)] blur-2xl -z-10"
              />
            )}

            {/* 2. Thin blue circular ring around the logo */}
            {!shouldReduceMotion && (
              <motion.div
                initial={{ scale: 0.6, rotate: 0, opacity: 0 }}
                animate={{ scale: 1.15, rotate: 180, opacity: [0, 0.7, 0.4, 0] }}
                transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
                className="absolute w-32 h-32 md:w-48 md:h-48 rounded-full border border-blue-500/20 -z-10"
              />
            )}

            {/* 3. FrameKart Logo reveal with spring animation */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.75, filter: "blur(10px)" }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.2 }
                  : { type: "spring", stiffness: 120, damping: 14, delay: 0.15 }
              }
              className="relative overflow-hidden p-2 rounded-xl flex items-center justify-center"
            >
              <Image
                src="/images/branding/Frame-2.png"
                alt="FrameKart Logo"
                width={180}
                height={50}
                priority
                className="w-[95px] md:w-[135px] h-auto object-contain"
              />

              {/* 4. Subtle blue light sweep moving left to right */}
              {!shouldReduceMotion && (
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 0.9, delay: 0.75, ease: "easeInOut" }}
                  className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-blue-500/15 to-transparent skew-x-12"
                />
              )}
            </motion.div>

            {/* 5. Title "FrameKart" with a smooth fade-up animation */}
            <motion.h1
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: shouldReduceMotion ? 0.1 : 0.4, ease: "easeOut" }}
              className="mt-6 text-xl md:text-2xl font-bold tracking-[0.2em] text-gray-800 uppercase"
            >
              FrameKart
            </motion.h1>

            {/* 6. Tagline "Frame Your Memories, Beautifully." with a delayed fade */}
            <motion.p
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
              transition={{ duration: 0.5, delay: shouldReduceMotion ? 0.2 : 0.75, ease: "easeOut" }}
              className="mt-2 text-xs md:text-sm text-gray-500 font-serif italic tracking-wide text-center"
            >
              Frame Your Memories, Beautifully.
            </motion.p>

            {/* 7. Three small animated loading dots */}
            {!shouldReduceMotion && (
              <div className="flex gap-2 mt-6 justify-center items-center">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={{
                      initial: { y: 0 },
                      animate: (i: number) => ({
                        y: [0, -5, 0],
                        transition: {
                          duration: 0.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.12,
                        },
                      }),
                    }}
                    initial="initial"
                    animate="animate"
                    className="w-1.5 h-1.5 rounded-full bg-blue-500/70"
                  />
                ))}
              </div>
            )}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
