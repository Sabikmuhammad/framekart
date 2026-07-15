"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

export default function CustomFrameBanner() {
  return (
    <section className="py-8 sm:py-12 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="border-2 border-primary/20 overflow-hidden">
            <CardContent className="p-6 sm:p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    <Palette className="h-4 w-4" />
                    NEW FEATURE
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                    Create Your Own <span className="text-primary">Custom Frame</span>
                  </h2>
                  <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                    Upload your photo, choose your size and style, and we&apos;ll create a stunning custom frame just for you. Perfect for special memories, gifts, and unique home decor.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/custom-frame">
                      <Button size="lg" className="gap-2 w-full sm:w-auto">
                        <Palette className="h-5 w-5" />
                        Start Creating
                      </Button>
                    </Link>
                    <Link href="/frames">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        Browse Ready Frames
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="relative">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-3">
                      <div className="aspect-square rounded-lg overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg transform rotate-2">
                        <Image
                          src="/images/custom-banner/p4.png"
                          alt="Custom Frame Example 1"
                          width={300}
                          height={300}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="aspect-square rounded-lg overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg transform -rotate-3">
                        <Image
                          src="/images/custom-banner/p3.png"
                          alt="Custom Frame Example 2"
                          width={300}
                          height={300}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="space-y-3 pt-6">
                      <div className="aspect-square rounded-lg overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg transform -rotate-2">
                        <Image
                          src="/images/custom-banner/p7.png"
                          alt="Custom Frame Example 3"
                          width={300}
                          height={300}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="aspect-square rounded-lg overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg transform rotate-3">
                        <Image
                          src="/images/custom-banner/p9.png"
                          alt="Custom Frame Example 4"
                          width={300}
                          height={300}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
