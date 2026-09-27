"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Building2, GraduationCap, Gift, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function BulkOrdersLandingPage() {
  const router = useRouter();

  const benefits = [
    "Bulk pricing tiers",
    "Customisation available",
    "Consistent premium quality",
    "Secure protective packaging",
    "Pan-India free delivery",
    "Dedicated order support",
  ];

  const categories = [
    { id: "Wedding", label: "Weddings", icon: Users },
    { id: "Corporate", label: "Corporate", icon: Building2 },
    { id: "Event", label: "Events", icon: Briefcase },
    { id: "School/College", label: "Schools & Colleges", icon: GraduationCap },
    { id: "Gift", label: "Return Gifts", icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-16 sm:py-24 max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                Bulk Frames, <br className="hidden sm:block" />
                Made for Your Occasion.
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl leading-relaxed">
                Shop our frames <strong>OR</strong> upload your own photos. Whether you&apos;re ordering for a wedding, corporate event, celebration or business, FrameKart makes bulk ordering simple, fast, and premium.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/bulk-orders/build">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base rounded-xl">
                    Start Bulk Order
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/bulk-orders/quote">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base rounded-xl">
                    Request a Quote
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-sm font-semibold tracking-widest text-gray-400 uppercase mb-8 text-center">Why Order in Bulk with FrameKart</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-200 font-medium text-sm sm:text-base">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-16 bg-white dark:bg-gray-900 border-t">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">What are you ordering for?</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <Card 
                    className="cursor-pointer hover:border-primary hover:shadow-md transition-all h-full"
                    onClick={() => router.push(`/bulk-orders/build?type=${cat.id}`)}
                  >
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-4 h-full">
                      <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">{cat.label}</span>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
