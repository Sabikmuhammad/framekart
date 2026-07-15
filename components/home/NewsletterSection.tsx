"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Send } from "lucide-react";

export default function NewsletterSection() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="border-2 border-primary/20">
            <CardContent className="py-8 sm:py-12 px-6 sm:px-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                    <Mail className="h-5 w-5" />
                    <span className="font-semibold text-sm">EXCLUSIVE DEALS</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                    Get 15% Off Your First Order
                  </h2>
                  <p className="text-muted-foreground text-sm sm:text-base mb-6">
                    Subscribe to our newsletter and receive exclusive offers, new arrivals, and design inspiration!
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-background focus:border-primary focus:outline-none"
                    />
                    <Button size="lg" className="gap-2">
                      Subscribe
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center sm:text-left">
                    🎁 Plus get free design tips and frame styling guides!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
