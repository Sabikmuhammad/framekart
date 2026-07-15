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
    customFrames: "/images/categories/custom-frames.jpg",
  };

  return (
    <section className="py-12 sm:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-8 sm:mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold">Shop by Category</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Discover the perfect frame for every occasion
            </p>
          </motion.div>
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 md:hidden">
          <div className="flex gap-3 w-max">
            {/* Custom Frames - Featured */}
            <Link href="/custom-frame">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary transition-all duration-300 cursor-pointer w-32">
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={categoryImages.customFrames}
                        alt="Custom Frames"
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center p-3">
                        <div className="text-center">
                          <Palette className="h-8 w-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform drop-shadow-lg" />
                          <h3 className="text-xs font-bold mb-1 group-hover:text-primary transition-colors line-clamp-2 drop-shadow">
                            Custom Frames
                          </h3>
                        </div>
                      </div>
                      <div className="absolute top-1 right-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        NEW
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>

            {/* Birthday Frames */}
            <Link href="/custom-frame/birthday">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary transition-all duration-300 cursor-pointer w-32">
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={categoryImages.birthday}
                        alt="Birthday Frames"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center p-2">
                        <div className="text-center">
                          <Cake className="h-8 w-8 text-primary mx-auto mb-1 group-hover:scale-110 transition-transform drop-shadow-lg" />
                          <h3 className="text-xs font-bold group-hover:text-primary transition-colors line-clamp-2 drop-shadow text-white">
                            Birthday Frames
                          </h3>
                        </div>
                      </div>
                      <div className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        NEW
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>

            {/* Wedding Frames */}
            <Link href="/custom-frame/wedding">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary transition-all duration-300 cursor-pointer w-32">
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={categoryImages.wedding}
                        alt="Wedding Frames"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center p-2">
                        <div className="text-center">
                          <Heart className="h-8 w-8 text-primary mx-auto mb-1 group-hover:scale-110 transition-transform drop-shadow-lg" />
                          <h3 className="text-xs font-bold group-hover:text-primary transition-colors line-clamp-2 drop-shadow text-white">
                            Wedding Frames
                          </h3>
                        </div>
                      </div>
                      <div className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        NEW
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>

            {/* Wall Frames */}
            <Link href="/frames?category=Wall Frames">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border hover:border-primary/50 w-32">
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <Image
                        src={categoryImages.wallFrames}
                        alt="Wall Frames"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Frame className="h-8 w-8 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <div className="p-2 text-center">
                      <h3 className="font-semibold text-xs group-hover:text-primary transition-colors line-clamp-2">
                        Wall Frames
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>

            {/* Calligraphy Frames */}
            <Link href="/frames?category=Calligraphy Frames">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border hover:border-primary/50 w-32">
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <Image
                        src={categoryImages.calligraphy}
                        alt="Calligraphy Frames"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Palette className="h-8 w-8 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <div className="p-2 text-center">
                      <h3 className="font-semibold text-xs group-hover:text-primary transition-colors line-clamp-2">
                        Calligraphy
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </div>
        </div>

        {/* Desktop/Tablet: Single Row Grid */}
        <div className="hidden md:grid md:grid-cols-5 gap-4 max-w-3xl mx-auto">
          {/* Custom Frames - Featured */}
          <Link href="/custom-frame">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-xl cursor-pointer h-full">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={categoryImages.customFrames}
                      alt="Custom Frames"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="text-center">
                        <Palette className="h-10 w-10 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform drop-shadow-lg" />
                        <h3 className="text-sm font-bold mb-1 group-hover:text-primary transition-colors drop-shadow">
                          Custom Frames
                        </h3>
                        <p className="text-[10px] text-muted-foreground drop-shadow">Design Your Own</p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                      NEW
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          {/* Birthday Frames */}
          <Link href="/custom-frame/birthday">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-xl cursor-pointer h-full">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={categoryImages.birthday}
                      alt="Birthday Frames"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="text-center">
                        <Cake className="h-10 w-10 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform drop-shadow-lg" />
                        <h3 className="text-sm font-bold group-hover:text-primary transition-colors drop-shadow text-white">
                          Birthday Frames
                        </h3>
                        <p className="text-[10px] text-white/80 drop-shadow">Personalize It</p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      NEW
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          {/* Wedding Frames */}
          <Link href="/custom-frame/wedding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-xl cursor-pointer h-full">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={categoryImages.wedding}
                      alt="Wedding Frames"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="text-center">
                        <Heart className="h-10 w-10 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform drop-shadow-lg" />
                        <h3 className="text-sm font-bold group-hover:text-primary transition-colors drop-shadow text-white">
                          Wedding Frames
                        </h3>
                        <p className="text-[10px] text-white/80 drop-shadow">Celebrate Love</p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      NEW
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          {/* Wall Frames */}
          <Link href="/frames?category=Wall Frames">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border hover:border-primary/50 h-full">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={categoryImages.wallFrames}
                      alt="Wall Frames"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Frame className="h-10 w-10 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      Wall Frames
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          {/* Calligraphy Frames */}
          <Link href="/frames?category=Calligraphy Frames">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border hover:border-primary/50 h-full">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={categoryImages.calligraphy}
                      alt="Calligraphy Frames"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Palette className="h-10 w-10 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      Calligraphy
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  );
}
