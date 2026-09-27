"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Cake, Heart, Frame, Palette } from "lucide-react";

export default function CategoriesSection() {
  const categoryImages = {
    photoFrames: "/images/categories/p2.png",
    wallFrames: "/images/categories/p3.png",
    birthday: "/images/categories/p2.png",
    wedding: "/images/categories/p3.png",
    calligraphy: "/images/categories/p9.png",
    homeDecor: "/images/categories/p7.png",
    customFrames: "/images/categories/p2.png",
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FAFAFA]">
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 md:mb-12 text-left md:text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <h2 className="mb-2 text-[26px] md:text-3xl font-[800] tracking-[-0.02em] text-[#111827]">Shop by Category</h2>
            <p className="text-[#6B7280] text-[15px] md:text-base font-medium">
              Discover the perfect frame for every occasion
            </p>
          </motion.div>
        </div>

        {/* Mobile & Desktop: Horizontal Scroll */}
        <div className="overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar snap-x snap-mandatory">
          <div className="flex gap-4 md:gap-5 w-max md:w-auto md:grid md:grid-cols-5 md:max-w-5xl md:mx-auto">
            
            {/* Custom Frames - Featured */}
            <Link href="/custom-frame" className="snap-start shrink-0">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                className="group relative w-[120px] md:w-auto md:h-full"
              >
                <Card className="relative overflow-hidden border border-gray-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#3B82F6]/30 transition-all duration-300 cursor-pointer h-full rounded-2xl">
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={categoryImages.customFrames}
                        alt="Custom Frames"
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <div className="flex flex-col">
                          <Palette className="h-6 w-6 text-white mb-2" />
                          <h3 className="text-[14px] font-[700] text-white leading-tight drop-shadow-sm">
                            Custom Frames
                          </h3>
                        </div>
                      </div>
                      <div className="absolute top-3 left-3 bg-[#3B82F6] text-white text-[9px] tracking-wider font-[700] px-2 py-0.5 rounded-full shadow-sm">
                        NEW
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>

            {/* Birthday Frames */}
            <Link href="/custom-frame/birthday" className="snap-start shrink-0">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                className="group relative w-[120px] md:w-auto md:h-full"
              >
                <Card className="relative overflow-hidden border border-gray-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#3B82F6]/30 transition-all duration-300 cursor-pointer h-full rounded-2xl">
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={categoryImages.birthday}
                        alt="Birthday Frames"
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <div className="flex flex-col">
                          <Cake className="h-6 w-6 text-white mb-2" />
                          <h3 className="text-[14px] font-[700] text-white leading-tight drop-shadow-sm">
                            Birthday Frames
                          </h3>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>

            {/* Wedding Frames */}
            <Link href="/custom-frame/wedding" className="snap-start shrink-0">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                className="group relative w-[120px] md:w-auto md:h-full"
              >
                <Card className="relative overflow-hidden border border-gray-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#3B82F6]/30 transition-all duration-300 cursor-pointer h-full rounded-2xl">
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={categoryImages.wedding}
                        alt="Wedding Frames"
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <div className="flex flex-col">
                          <Heart className="h-6 w-6 text-white mb-2" />
                          <h3 className="text-[14px] font-[700] text-white leading-tight drop-shadow-sm">
                            Wedding Frames
                          </h3>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>

            {/* Wall Frames */}
            <Link href="/frames?category=Wall Frames" className="snap-start shrink-0">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                className="group relative w-[120px] md:w-auto md:h-full"
              >
                <Card className="relative overflow-hidden border border-gray-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#3B82F6]/30 transition-all duration-300 cursor-pointer h-full rounded-2xl">
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={categoryImages.wallFrames}
                        alt="Wall Frames"
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <div className="flex flex-col">
                          <Frame className="h-6 w-6 text-white mb-2" />
                          <h3 className="text-[14px] font-[700] text-white leading-tight drop-shadow-sm">
                            Wall Frames
                          </h3>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>

            {/* Calligraphy Frames */}
            <Link href="/frames?category=Calligraphy Frames" className="snap-start shrink-0">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                className="group relative w-[120px] md:w-auto md:h-full"
              >
                <Card className="relative overflow-hidden border border-gray-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#3B82F6]/30 transition-all duration-300 cursor-pointer h-full rounded-2xl">
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={categoryImages.calligraphy}
                        alt="Calligraphy Frames"
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <div className="flex flex-col">
                          <Palette className="h-6 w-6 text-white mb-2" />
                          <h3 className="text-[14px] font-[700] text-white leading-tight drop-shadow-sm">
                            Calligraphy
                          </h3>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}
