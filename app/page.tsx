"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Star, Shield, Truck, Heart, Sparkles, Frame, Image as ImageIcon, Gift, Home, Palette, Zap, Clock, TrendingUp, Instagram, Users, Package, MessageCircle, Mail, Send } from "lucide-react";
import { useEffect, useState } from "react";
import FrameCard from "@/components/FrameCard";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

export default function HomePage() {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/frames")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFrames(data.data.slice(0, 8));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 sm:py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl font-bold tracking-tight md:text-6xl">
              Frame Your Memories,{" "}
              <span className="text-primary">Beautifully</span>
            </h1>
            <p className="mb-6 sm:mb-8 text-base sm:text-lg text-muted-foreground md:text-xl">
              Discover our curated collection of premium wall frames. Perfect for every space, every style.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/frames">
                <Button size="lg" className="gap-2">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/custom-frame">
                <Button size="lg" variant="outline" className="gap-2 border-2">
                  <Sparkles className="h-4 w-4" />
                  Create Custom Frame
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
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
                          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/framekart/categories/custom-frames.jpg`}
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
                            <Sparkles className="h-8 w-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform drop-shadow-lg" />
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

              {/* Photo Frames */}
              <Link href="/frames?category=Photo Frames">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border hover:border-primary/50 w-32">
                    <CardContent className="p-0">
                      <div className="relative aspect-square bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                        </div>
                      </div>
                      <div className="p-2 text-center">
                        <h3 className="font-semibold text-xs group-hover:text-primary transition-colors line-clamp-2">
                          Photo Frames
                        </h3>
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
                      <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-950 dark:to-purple-900">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Frame className="h-8 w-8 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
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

              {/* Birthday Frames */}
              <Link href="/frames?category=Birthday Frames">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border hover:border-primary/50 w-32">
                    <CardContent className="p-0">
                      <div className="relative aspect-square bg-gradient-to-br from-pink-100 to-pink-50 dark:from-pink-950 dark:to-pink-900">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Gift className="h-8 w-8 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform" />
                        </div>
                      </div>
                      <div className="p-2 text-center">
                        <h3 className="font-semibold text-xs group-hover:text-primary transition-colors line-clamp-2">
                          Birthday Frames
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
                      <div className="relative aspect-square bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-950 dark:to-amber-900">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Palette className="h-8 w-8 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
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

              {/* Home Decor */}
              <Link href="/frames">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border hover:border-primary/50 w-32">
                    <CardContent className="p-0">
                      <div className="relative aspect-square bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-950 dark:to-emerald-900">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Home className="h-8 w-8 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                        </div>
                      </div>
                      <div className="p-2 text-center">
                        <h3 className="font-semibold text-xs group-hover:text-primary transition-colors line-clamp-2">
                          Home Decor
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </div>
          </div>

          {/* Desktop/Tablet: Single Row Grid */}
          <div className="hidden md:grid md:grid-cols-6 gap-4">
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
                        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/framekart/categories/custom-frames.jpg`}
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
                          <Sparkles className="h-10 w-10 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform drop-shadow-lg" />
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

            {/* Photo Frames */}
            <Link href="/frames?category=Photo Frames">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border hover:border-primary/50 h-full">
                  <CardContent className="p-0">
                    <div className="relative aspect-square bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-10 w-10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                        Photo Frames
                      </h3>
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
                    <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-950 dark:to-purple-900">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Frame className="h-10 w-10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
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

            {/* Birthday Frames */}
            <Link href="/frames?category=Birthday Frames">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border hover:border-primary/50 h-full">
                  <CardContent className="p-0">
                    <div className="relative aspect-square bg-gradient-to-br from-pink-100 to-pink-50 dark:from-pink-950 dark:to-pink-900">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Gift className="h-10 w-10 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                        Birthday
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
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border hover:border-primary/50 h-full">
                  <CardContent className="p-0">
                    <div className="relative aspect-square bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-950 dark:to-amber-900">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Palette className="h-10 w-10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
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

            {/* Home Decor */}
            <Link href="/frames">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border hover:border-primary/50 h-full">
                  <CardContent className="p-0">
                    <div className="relative aspect-square bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-950 dark:to-emerald-900">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Home className="h-10 w-10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                        Home Decor
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Frame Promotion Banner */}
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
                      <Sparkles className="h-4 w-4" />
                      NEW FEATURE
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                      Create Your Own <span className="text-primary">Custom Frame</span>
                    </h2>
                    <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                      Upload your photo, choose your size and style, and we'll create a stunning custom frame just for you. Perfect for special memories, gifts, and unique home decor.
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
                        <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-white dark:border-gray-800 shadow-lg transform rotate-2"></div>
                        <div className="aspect-square rounded-lg bg-gradient-to-br from-blue-200 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-4 border-white dark:border-gray-800 shadow-lg transform -rotate-3"></div>
                      </div>
                      <div className="space-y-3 pt-6">
                        <div className="aspect-square rounded-lg bg-gradient-to-br from-purple-200 to-purple-100 dark:from-purple-900 dark:to-purple-800 border-4 border-white dark:border-gray-800 shadow-lg transform -rotate-2"></div>
                        <div className="aspect-square rounded-lg bg-gradient-to-br from-pink-200 to-pink-100 dark:from-pink-900 dark:to-pink-800 border-4 border-white dark:border-gray-800 shadow-lg transform rotate-3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Featured Frames */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-8 sm:mb-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold">Featured Frames</h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Handpicked selections to elevate your space
              </p>
            </motion.div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="h-80 animate-pulse bg-muted" />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
            >
              {frames.map((frame: any, index: number) => (
                <motion.div
                  key={frame._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <FrameCard frame={frame} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="mt-8 sm:mt-12 text-center">
            <Link href="/frames">
              <Button size="lg" variant="outline" className="gap-2">
                View All Frames
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold">Why Choose FrameKart?</h2>
            <p className="text-muted-foreground">
              Experience excellence in every detail
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Star,
                title: "Premium Quality",
                description: "Handcrafted frames with attention to detail",
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                description: "Free shipping on orders over ₹2000",
              },
              {
                icon: Shield,
                title: "Secure Payment",
                description: "100% secure checkout with cashfree",
              },
              {
                icon: Heart,
                title: "Customer Love",
                description: "Rated 4.9/5 by 1000+ happy customers",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center">
                  <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                    <feature.icon className="mx-auto mb-3 sm:mb-4 h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                    <h3 className="mb-2 font-semibold text-sm sm:text-base">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Limited Time Offer Banner */}
      <section className="py-8 sm:py-12 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950 dark:via-orange-950 dark:to-red-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-500 to-orange-500 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <CardContent className="py-8 sm:py-12 px-6 sm:px-12 relative z-10">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                      <Zap className="h-5 w-5" />
                      <span className="font-bold text-sm">LIMITED TIME OFFER</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                      FLAT 30% OFF
                    </h2>
                    <p className="text-lg sm:text-xl mb-6 text-white/90">
                      On All Photo Frames & Wall Art
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                      <Link href="/frames">
                        <Button size="lg" variant="secondary" className="gap-2 shadow-xl">
                          Shop Now
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </Link>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-5 w-5" />
                        <span className="font-semibold">Ends in 3 days!</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex justify-center items-center">
                    <div className="relative">
                      <div className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20">
                        <div className="text-6xl font-bold mb-2">30%</div>
                        <div className="text-2xl font-semibold">OFF</div>
                        <div className="mt-4 text-sm opacity-90">Use code: FRAME30</div>
                      </div>
                      <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm rotate-12 shadow-lg">
                        SAVE BIG!
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Best Sellers Carousel */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <TrendingUp className="h-5 w-5" />
              <span className="font-semibold text-sm">TRENDING NOW</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Best Selling Frames
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              Join thousands of happy customers who chose these popular frames
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {frames.slice(0, 4).map((frame: any, index) => (
              <motion.div
                key={frame._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/frames/${frame.slug}`}>
                  <Card className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary">
                    <CardContent className="p-0">
                      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={frame.imageUrl}
                          alt={frame.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            #1 SELLER
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {Math.floor(Math.random() * 30) + 20}% OFF
                        </div>
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                          {frame.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold">4.8</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary text-base sm:text-lg">
                              {formatPrice(frame.price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/frames">
              <Button size="lg" variant="outline" className="gap-2">
                View All Products
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Instagram Follow Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Instagram className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-6 text-pink-600" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Follow Us on Instagram
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-8">
              Stay updated with our latest designs and exclusive offers
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 gap-2"
              onClick={() => window.open('https://instagram.com/framekart', '_blank')}
            >
              <Instagram className="h-5 w-5" />
              Follow Us @framekart
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Banner */}
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

      {/* Newsletter Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
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

      {/* Testimonials */}
      {/* <section className="bg-muted/40 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold">What Our Customers Say</h2>
            <p className="text-muted-foreground">
              Real reviews from real customers
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                name: "",
                review: "Absolutely love my frames! The quality is outstanding and delivery was super fast.",
                rating: 5,
              },
              {
                name: "",
                review: "Best online frame store in India. Great variety and excellent customer service.",
                rating: 5,
              },
              {
                name: "",
                review: "The frames transformed my living room. Highly recommend FrameKart!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                    <div className="mb-4 flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="mb-4 text-sm">{testimonial.review}</p>
                    <p className="font-semibold">{testimonial.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
            <CardContent className="py-8 sm:py-12 px-4 text-center">
              <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold">
                Ready to Transform Your Space?
              </h2>
              <p className="mb-6 sm:mb-8 text-base sm:text-lg opacity-90">
                Explore our collection and find the perfect frame today
              </p>
              <Link href="/frames">
                <Button size="lg" variant="secondary">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
