"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { EASING } from "./motion-config";
import { ReactNode } from "react";

interface MotionButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  className?: string;
  scaleHover?: number;
  scaleTap?: number;
  disabled?: boolean;
}

export function MotionButton({
  children,
  className,
  scaleHover = 1.01,
  scaleTap = 0.97,
  disabled = false,
  ...props
}: MotionButtonProps) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: scaleHover } : {}}
      whileTap={!disabled ? { scale: scaleTap } : {}}
      transition={EASING.spring}
      className={className}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
