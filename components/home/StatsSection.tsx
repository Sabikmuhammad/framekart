"use client";

import { motion } from "framer-motion";
import { Users, Package, Star, MessageCircle } from "lucide-react";

export default function StatsSection() {
  return (
    <section className="py-12 sm:py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {[
            { value: "10,000+", label: "Happy Customers", icon: Users },
            { value: "50,000+", label: "Frames Sold", icon: Package },
            { value: "4.9/5", label: "Average Rating", icon: Star },
            { value: "24/7", label: "Customer Support", icon: MessageCircle },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <stat.icon className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-3 opacity-90" />
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base opacity-90">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
