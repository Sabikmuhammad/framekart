"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Truck, Tag, ShieldCheck, Package } from "lucide-react";

const BENEFITS = [
  {
    title: "FREE SHIPPING",
    description: "Complimentary delivery on your order",
    icon: Truck,
  },
  {
    title: "15% LAUNCH OFFER",
    description: "Your launch discount is already applied",
    icon: Tag,
  },
  {
    title: "SECURE CHECKOUT",
    description: "Safe and secure payment",
    icon: ShieldCheck,
  },
  {
    title: "PREMIUM PACKAGING",
    description: "Your frame is carefully prepared for delivery",
    icon: Package,
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function CartBenefits() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 sm:gap-y-8 gap-x-8 my-10 border-t border-border/50 pt-10">
        {BENEFITS.map((benefit, i) => (
          <div key={i} className="flex flex-col gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary/50 flex items-center justify-center text-primary">
              <benefit.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-[12px] sm:text-[13px] font-semibold tracking-wider uppercase mb-1">{benefit.title}</h3>
              <p className="text-[11px] sm:text-[12px] text-muted-foreground">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 sm:gap-y-12 my-10 sm:my-24 border-t border-border/50 pt-10 sm:pt-24"
    >
      {BENEFITS.map((benefit, i) => (
        <motion.div key={i} variants={itemVariants} className="flex gap-4 sm:gap-6 group min-h-[64px]">
          <motion.div 
            className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-full bg-secondary/40 flex items-center justify-center text-primary/80 transition-colors group-hover:bg-primary/10 group-hover:text-primary"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <benefit.icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.div>
          <div>
            <h3 className="text-[12px] sm:text-[13px] font-semibold tracking-wider uppercase mb-1 sm:mb-1.5">{benefit.title}</h3>
            <p className="text-[11px] sm:text-[12px] text-muted-foreground leading-relaxed">{benefit.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
