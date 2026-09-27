"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { EASING, MOTION } from "./motion-config";
import { ReactNode } from "react";

interface MotionRevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  yOffset?: number;
  delay?: number;
  duration?: number;
  staggerChildren?: number;
  className?: string;
  once?: boolean;
}

export function MotionReveal({
  children,
  yOffset = 20,
  delay = 0,
  duration = MOTION.smooth,
  staggerChildren,
  className,
  once = true,
  ...props
}: MotionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-50px" }}
      transition={{ 
        duration, 
        delay, 
        ease: EASING.primary,
        ...(staggerChildren ? { staggerChildren } : {})
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export const revealVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: MOTION.smooth,
      ease: EASING.primary
    }
  }
};
