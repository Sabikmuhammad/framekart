"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

export default function InstagramSection() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Instagram className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Follow Us on <span className="text-primary">Instagram</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            Stay updated with our latest designs and exclusive offers
          </p>
          <Button 
            size="lg" 
            className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 gap-2"
            onClick={() => window.open('https://instagram.com/framekartofficial', '_blank')}
          >
            <Instagram className="h-5 w-5" />
            Follow Us @framekart
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
