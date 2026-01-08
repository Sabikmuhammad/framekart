"use client";

import { motion } from "framer-motion";
import { Cake, Heart, Sparkles, ArrowRight, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface OccasionPromoProps {
  exclude?: "custom" | "birthday" | "wedding";
}

export function OccasionPromo({ exclude }: OccasionPromoProps = {}) {
  const showCustom = exclude !== "custom";
  const showBirthday = exclude !== "birthday";
  const showWedding = exclude !== "wedding";

  // Count visible cards to determine grid columns
  const visibleCount = [showCustom, showBirthday, showWedding].filter(Boolean).length;
  const gridClass = visibleCount === 3 ? "md:grid-cols-3" : visibleCount === 2 ? "md:grid-cols-2" : "md:grid-cols-1";

  // Don't render if no cards to show
  if (visibleCount === 0) return null;

  console.log('OccasionPromo render:', { exclude, showCustom, showBirthday, showWedding, visibleCount });

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-5 py-2.5 rounded-full text-sm font-semibold mb-5 border border-primary/20"
          >
            <Sparkles className="h-4 w-4 animate-pulse" />
            {exclude ? "MORE FRAME OPTIONS" : "SPECIAL OCCASIONS"}
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {exclude ? (
              <>
                Explore Other{" "}
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Frame Options
                </span>
              </>
            ) : (
              <>
                Create Frames for Life&apos;s{" "}
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Special Moments
                </span>
              </>
            )}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {exclude 
              ? "Discover more ways to personalize your memories with our custom frame options"
              : "Birthday & Wedding Frames – Personalized, Elegant, Timeless"
            }
          </p>
        </div>

        {/* Promotional Cards */}
        <div className={`grid ${gridClass} gap-6 lg:gap-8 mb-8`}>
          {/* Custom Frames Card */}
          {showCustom && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link href="/custom-frame">
                <Card className="group relative overflow-hidden border-2 border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-primary transition-all duration-300 hover:shadow-2xl h-full bg-gradient-to-br from-white to-primary/5 dark:from-gray-900 dark:to-primary/10">
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                  </div>

                  <CardContent className="relative p-6 sm:p-8 h-full flex flex-col">
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-primary to-primary/90 text-white border-0 shadow-lg">
                        Flexible
                      </Badge>
                    </div>

                    <div className="mb-6">
                      <motion.div
                        className="inline-flex"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-primary/90 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow">
                          <Wand2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                      </motion.div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                        ✨ Custom Frames
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                        Create your own personalized frame for any occasion. Upload your photo, choose your style, and make it uniquely yours.
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                          🎨 Your Design
                        </span>
                        <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                          📸 Any Photo
                        </span>
                        <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                          🎯 Any Purpose
                        </span>
                      </div>
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl group-hover:scale-[1.02] transition-all"
                    >
                      <span className="font-semibold">Create Custom Frame</span>
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )}

          {/* Birthday Frames Card */}
          {showBirthday && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link href="/custom-frame/birthday">
              <Card className="group relative overflow-hidden border-2 border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-primary transition-all duration-300 hover:shadow-2xl h-full bg-gradient-to-br from-white to-primary/5 dark:from-gray-900 dark:to-primary/10">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                </div>

                <CardContent className="relative p-6 sm:p-8 h-full flex flex-col">
                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-primary to-primary/90 text-white border-0 shadow-lg">
                      Popular
                    </Badge>
                  </div>

                  {/* Icon */}
                  <div className="mb-6">
                    <motion.div
                      className="inline-flex"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-primary/90 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow">
                        <Cake className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                      🎂 Birthday Frames
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                      Celebrate birthdays with beautifully designed custom frames. Add photos, names, ages, and special messages to create the perfect birthday gift.
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                        ✨ Custom Design
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                        📸 Photo Upload
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                        💌 Personal Message
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl group-hover:scale-[1.02] transition-all"
                  >
                    <span className="font-semibold">Create Birthday Frame</span>
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
          )}

          {/* Wedding Frames Card */}
          {showWedding && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
            <Link href="/custom-frame/wedding">
              <Card className="group relative overflow-hidden border-2 border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-primary transition-all duration-300 hover:shadow-2xl h-full bg-gradient-to-br from-white to-primary/5 dark:from-gray-900 dark:to-primary/10">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                </div>

                <CardContent className="relative p-6 sm:p-8 h-full flex flex-col">
                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-primary to-primary/90 text-white border-0 shadow-lg">
                      Premium
                    </Badge>
                  </div>

                  {/* Icon */}
                  <div className="mb-6">
                    <motion.div
                      className="inline-flex"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-primary/90 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow">
                        <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                      💍 Wedding Frames
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                      Turn wedding moments into timeless wall art. Elegant designs featuring couple names, wedding dates, and romantic quotes to cherish forever.
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                        💕 Elegant Design
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                        📸 Couple Photo
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                        💌 Love Quote
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl group-hover:scale-[1.02] transition-all"
                  >
                    <span className="font-semibold">Create Wedding Frame</span>
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
          )}
        </div>

        {/* Trust Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 rounded-xl border border-primary/20 shadow-sm">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/90 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">
              All Birthday & Wedding Frames are <span className="text-primary font-bold">handcrafted by our design team</span> for the best finish.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
