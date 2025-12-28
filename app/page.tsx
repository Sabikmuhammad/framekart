"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Star, Shield, Truck, Heart, Sparkles, Frame, Image as ImageIcon, Gift, Home, Palette, Zap, Clock, TrendingUp, Instagram, Users, Package, MessageCircle, Mail, Send, Cake } from "lucide-react";
import { useEffect, useState } from "react";
import FrameCard from "@/components/FrameCard";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

const HERO_SLIDES = [
  {
    title: "Frame Your Memories,",
    highlight: "Beautifully",
    description: "Discover our curated collection of premium wall frames. Perfect for every space, every style.",
    buttons: [
      { label: "Shop Now", href: "/frames", variant: "default" as const, icon: ArrowRight },
      { label: "Create Custom Frame", href: "/custom-frame", variant: "outline" as const, icon: Sparkles },
    ],
    gradient: "from-primary/10 via-background to-secondary/10",
  },
  {
    title: "Create Your Own",
    highlight: "Custom Frame",
    description: "Design a personalized frame with your choice of size, style, and uploaded image. Bring your vision to life.",
    buttons: [
      { label: "Start Creating", href: "/custom-frame", variant: "default" as const, icon: Sparkles },
      { label: "View Gallery", href: "/frames", variant: "outline" as const, icon: ArrowRight },
    ],
    gradient: "from-purple-50 via-background to-blue-50 dark:from-purple-950/20 dark:via-background dark:to-blue-950/20",
  },
  {
    title: "Celebrate Forever,",
    highlight: "Wedding Frames",
    description: "Preserve your special day with our beautiful wedding frame templates. Our design team will create a romantic masterpiece.",
    buttons: [
      { label: "Explore Wedding Frames", href: "/frames/wedding", variant: "default" as const, icon: Heart },
      { label: "Shop All Frames", href: "/frames", variant: "outline" as const, icon: ArrowRight },
    ],
    gradient: "from-rose-50 via-background to-amber-50 dark:from-rose-950/20 dark:via-background dark:to-amber-950/20",
  },
  {
    title: "Make It Special,",
    highlight: "Birthday Frames",
    description: "Create unforgettable birthday memories with personalized frame designs. Perfect for celebrating every milestone.",
    buttons: [
      { label: "Explore Birthday Frames", href: "/frames/birthday", variant: "default" as const, icon: Cake },
      { label: "Shop All Frames", href: "/frames", variant: "outline" as const, icon: ArrowRight },
    ],
    gradient: "from-pink-50 via-background to-purple-50 dark:from-pink-950/20 dark:via-background dark:to-purple-950/20",
  },
];

export default function HomePage() {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [eligibility, setEligibility] = useState({
    eligible: true,
    discountValue: 15,
    offerActive: true,
    offerName: "Launch Offer",
  });

  useEffect(() => {
    fetch("/api/frames")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFrames(data.data.slice(0, 8));
        }
      })
      .finally(() => setLoading(false));

    // Fetch eligibility
    fetch("/api/offers/eligibility")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Eligibility data:", data);
        if (data.success) {
          setEligibility({
            eligible: data.eligible ?? true,
            discountValue: data.discountValue ?? 15,
            offerActive: data.offerActive ?? true,
            offerName: data.offerName ?? "Launch Offer",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching eligibility:", error);
        // Keep default values (show offer for guests)
      });
  }, []);

  // Auto-rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const currentHero = HERO_SLIDES[currentSlide];

  // Category images configuration - Local paths from public folder
  const categoryImages = {
    photoFrames: "/images/categories/p2.png",
    wallFrames: "/images/categories/p3.png",
    birthday: "/images/categories/p2.png", // Using existing image for now
    wedding: "/images/categories/p3.png", // Using existing image for now
    calligraphy: "/images/categories/p9.png",
    homeDecor: "/images/categories/p7.png",
    customFrames: "/images/categories/custom-frames.jpg",
    offerBanner: "/images/banners/offer-banner.jpg",
  };

  return (
    <div className="flex flex-col">
      {/* Launch Offer Banner */}
      {eligibility.offerActive && eligibility.eligible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground py-3 px-4"
        >
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
            <span className="text-lg sm:text-xl font-bold flex items-center gap-2">
              🎉 {eligibility.offerName}: Flat {eligibility.discountValue}% OFF
            </span>
            <span className="text-sm sm:text-base opacity-90">
              Auto Applied at Checkout
            </span>
            <Link href="/frames" className="mt-1 sm:mt-0">
              <Button 
                variant="secondary" 
                size="sm" 
                className="gap-2 font-semibold shadow-lg hover:shadow-xl transition-shadow"
              >
                Shop Now & Save {eligibility.discountValue}%
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${currentHero.gradient} py-12 sm:py-20 md:py-32 transition-all duration-700`}>
        <div className="container mx-auto px-4">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl font-bold tracking-tight md:text-6xl">
              {currentHero.title}{" "}
              <span className="text-primary">{currentHero.highlight}</span>
            </h1>
            <p className="mb-6 sm:mb-8 text-base sm:text-lg text-muted-foreground md:text-xl">
              {currentHero.description}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              {currentHero.buttons.map((button, index) => {
                const Icon = button.icon;
                return (
                  <Link key={index} href={button.href}>
                    <Button size="lg" variant={button.variant} className={`gap-2 ${button.variant === "outline" ? "border-2" : ""}`}>
                      {button.variant === "default" && <Icon className="h-4 w-4" />}
                      {button.label}
                      {button.variant === "outline" && <Icon className="h-4 w-4" />}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? "w-8 bg-primary" : "w-2 bg-gray-400 hover:bg-gray-600"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
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
{/* Birthday Frames */}
              <Link href="/frames/birthday">
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
              <Link href="/frames/wedding">
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
                      <div className="relative aspect-square">
                        <Image
                          src={categoryImages.photoFrames}
                          alt="Photo Frames"
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
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
                      <div className="relative aspect-square">
                        <Image
                          src={categoryImages.homeDecor}
                          alt="Home Decor"
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Home className="h-8 w-8 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
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
{/* Birthday Frames */}
            <Link href="/frames/birthday">
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
            <Link href="/frames/wedding">
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
                    <div className="relative aspect-square">
                      <Image
                        src={categoryImages.photoFrames}
                        alt="Photo Frames"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-10 w-10 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
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
                    <div className="relative aspect-square">
                      <Image
                        src={categoryImages.homeDecor}
                        alt="Home Decor"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Home className="h-10 w-10 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
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
                  <FrameCard 
                    frame={frame} 
                    showDiscountBadge={eligibility.eligible && eligibility.offerActive}
                    discountValue={eligibility.discountValue}
                  />
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

      {/* Why Choose Us
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
      </section> */}

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
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={categoryImages.offerBanner}
                  alt="Special Offer Background"
                  fill
                  className="object-cover opacity-20"
                />
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <CardContent className="py-8 sm:py-12 px-6 sm:px-12 relative z-10">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                      <Zap className="h-5 w-5" />
                      <span className="font-bold text-sm">{eligibility.offerName.toUpperCase()}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                      FLAT {eligibility.discountValue}% OFF
                    </h2>
                    <p className="text-lg sm:text-xl mb-6 text-white/90">
                      On All Frames & Wall Art
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                      <Link href="/frames">
                        <Button size="lg" variant="secondary" className="gap-2 shadow-xl">
                          Shop Now
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </Link>
                      {/* <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-5 w-5" />
                        <span className="font-semibold">Ends in 3 days!</span>
                      </div> */}
                    </div>
                  </div>
                  <div className="hidden md:flex justify-center items-center">
                    <div className="relative">
                      <div className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20">
                        <div className="text-6xl font-bold mb-2">30%</div>
                        <div className="text-2xl font-semibold">OFF</div>
                        <div className="mt-4 text-sm opacity-90"></div>
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
              {/* Join thousands of happy customers who chose these popular frames */}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {frames.slice(4, 8).map((frame: any, index) => (
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
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            BESTSELLER
                          </div>
                        )}
                        {eligibility.offerActive && eligibility.eligible && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            {eligibility.discountValue}% OFF
                          </div>
                        )}
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                          {frame.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold">4.9</span>
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

      {/* Wedding & Birthday Frames Promotion - Advanced Modern Design */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/30">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-blue-200/20 to-blue-300/20 dark:from-blue-500/10 dark:to-blue-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-blue-300/20 to-blue-400/20 dark:from-blue-600/10 dark:to-blue-700/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full mb-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
              <span className="font-bold text-xs sm:text-sm tracking-wide">CELEBRATE SPECIAL MOMENTS</span>
            </motion.div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Personalized
              </span>
              <br className="sm:hidden" />
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent ml-0 sm:ml-3">
                Template Frames
              </span>
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
              Upload your photo, add your personal message, and let our expert design team create a 
              <span className="font-semibold text-gray-900 dark:text-white"> stunning custom frame </span>
              for your special occasion
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Professional Design</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Premium Quality</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Truck className="h-4 w-4 text-blue-700" />
                <span className="font-medium">Fast Delivery</span>
              </div>
            </div>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto">
            {/* Wedding Frame Card */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href="/frames/wedding">
                <Card className="relative border-0 overflow-hidden hover:shadow-2xl transition-all duration-500 h-full bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/20">
                  <CardContent className="p-0">
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
                      {/* Background Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-400/10 to-transparent z-10" />
                      
                      {/* Image with Parallax Effect */}
                      <div className="absolute inset-0 transform group-hover:scale-110 transition-transform duration-700">
                        <Image
                          src="/images/templates/wedding-template.jpg"
                          alt="Wedding Frame Template"
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20" />

                      {/* NEW Badge */}
                      <div className="absolute top-4 right-4 z-30">
                        <div className="relative">
                          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xl backdrop-blur-sm border border-white/20">
                            NEW
                          </div>
                          <div className="absolute inset-0 bg-blue-400 rounded-full blur animate-ping opacity-30" />
                        </div>
                      </div>

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8 z-30">
                        {/* Icon & Title */}
                        <div className="flex items-center gap-3 mb-3 sm:mb-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                          </div>
                          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                            Wedding Frames
                          </h3>
                        </div>

                        {/* Description */}
                        <p className="text-white/90 text-xs sm:text-sm md:text-base mb-4 sm:mb-5 leading-relaxed max-w-md">
                          Celebrate your love story with elegant wedding frames. Perfect for anniversaries and special memories.
                        </p>

                        {/* Feature Tags */}
                        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm px-3 py-1.5 rounded-full border border-white/30 hover:bg-white/30 transition-colors">
                            <Sparkles className="h-3 w-3" />
                            Custom Design
                          </span>
                          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm px-3 py-1.5 rounded-full border border-white/30 hover:bg-white/30 transition-colors">
                            <Users className="h-3 w-3" />
                            Professional Team
                          </span>
                          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm px-3 py-1.5 rounded-full border border-white/30 hover:bg-white/30 transition-colors">
                            <Package className="h-3 w-3" />
                            A4 Size
                          </span>
                        </div>

                        {/* CTA Button */}
                        <Button 
                          size="lg" 
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl border-0 group-hover:scale-[1.02] transition-all text-sm sm:text-base py-5 sm:py-6"
                        >
                          <span className="font-semibold">Create Wedding Frame</span>
                          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>

                    {/* Bottom Accent */}
                    <div className="h-1.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            {/* Birthday Frame Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href="/frames/birthday">
                <Card className="relative border-0 overflow-hidden hover:shadow-2xl transition-all duration-500 h-full bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/20">
                  <CardContent className="p-0">
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
                      {/* Background Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-blue-500/10 to-transparent z-10" />
                      
                      {/* Image with Parallax Effect */}
                      <div className="absolute inset-0 transform group-hover:scale-110 transition-transform duration-700">
                        <Image
                          src="/images/templates/birthday-template.jpg"
                          alt="Birthday Frame Template"
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20" />

                      {/* NEW Badge */}
                      <div className="absolute top-4 right-4 z-30">
                        <div className="relative">
                          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xl backdrop-blur-sm border border-white/20">
                            NEW
                          </div>
                          <div className="absolute inset-0 bg-blue-500 rounded-full blur animate-ping opacity-30" />
                        </div>
                      </div>

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8 z-30">
                        {/* Icon & Title */}
                        <div className="flex items-center gap-3 mb-3 sm:mb-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Cake className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                          </div>
                          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                            Birthday Frames
                          </h3>
                        </div>

                        {/* Description */}
                        <p className="text-white/90 text-xs sm:text-sm md:text-base mb-4 sm:mb-5 leading-relaxed max-w-md">
                          Make birthdays extra special with personalized frames. Perfect gifts for loved ones!
                        </p>

                        {/* Feature Tags */}
                        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm px-3 py-1.5 rounded-full border border-white/30 hover:bg-white/30 transition-colors">
                            <Sparkles className="h-3 w-3" />
                            Fun Designs
                          </span>
                          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm px-3 py-1.5 rounded-full border border-white/30 hover:bg-white/30 transition-colors">
                            <MessageCircle className="h-3 w-3" />
                            Custom Message
                          </span>
                          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm px-3 py-1.5 rounded-full border border-white/30 hover:bg-white/30 transition-colors">
                            <Gift className="h-3 w-3" />
                            A4 Size
                          </span>
                        </div>

                        {/* CTA Button */}
                        <Button 
                          size="lg" 
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl border-0 group-hover:scale-[1.02] transition-all text-sm sm:text-base py-5 sm:py-6"
                        >
                          <span className="font-semibold">Create Birthday Frame</span>
                          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>

                    {/* Bottom Accent */}
                    <div className="h-1.5 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </div>

          {/* Features Grid - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto"
          >
            {[
              { 
                icon: Sparkles, 
                title: "Design Team", 
                description: "Expert designers create your frame",
                color: "from-blue-500 to-blue-600"
              },
              { 
                icon: ImageIcon, 
                title: "Your Photo", 
                description: "Upload in seconds",
                color: "from-blue-600 to-blue-700"
              },
              { 
                icon: Palette, 
                title: "Custom Style", 
                description: "Choose from 3 frame styles",
                color: "from-blue-400 to-blue-500"
              },
              { 
                icon: Package, 
                title: "Fast Delivery", 
                description: "Premium quality guaranteed",
                color: "from-blue-700 to-blue-800"
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-full group hover:-translate-y-1">
                  <CardContent className="pt-6 pb-5 px-4">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <feature.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <h4 className="font-bold text-sm sm:text-base mb-2 text-gray-900 dark:text-white">
                      {feature.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTA Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 sm:mt-16 text-center"
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 px-6 sm:px-8 py-5 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-900">
              <div className="flex items-center gap-2.5">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                  Most Loved Templates
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-full text-xs sm:text-sm font-semibold shadow-sm border border-blue-200 dark:border-blue-800">
                  💕 Weddings
                </span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-500 rounded-full text-xs sm:text-sm font-semibold shadow-sm border border-blue-300 dark:border-blue-700">
                  🎂 Birthdays
                </span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white dark:bg-gray-800 text-blue-500 dark:text-blue-300 rounded-full text-xs sm:text-sm font-semibold shadow-sm border border-blue-100 dark:border-blue-900">
                  🎉 Celebrations
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Instagram Follow Section */}
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
