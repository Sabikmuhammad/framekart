"use client";

import { motion } from "framer-motion";
import { Cake, Heart, ArrowRight, Paintbrush, Gift } from "lucide-react";
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

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="py-12 sm:py-16 bg-muted/20 border-t border-border/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-xs font-semibold mb-4 tracking-wider uppercase"
          >
            {exclude ? "More Options" : "Special Occasions"}
          </motion.div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-3">
            {exclude ? "Explore Other Frame Options" : "Frames for Life's Special Moments"}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {exclude 
              ? "Discover more ways to personalize your memories with our handcrafted frames"
              : "Handcrafted Birthday & Wedding Frames – Personalized, Timeless, and Elegant"
            }
          </p>
        </div>

        {/* Promotional Cards */}
        <div className={`grid ${gridClass} gap-6 mb-8`}>
          {/* Custom Frames Card */}
          {showCustom && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/custom-frame" className="block h-full">
                <Card className="group relative overflow-hidden border border-border/80 bg-background/50 hover:bg-background/80 transition-all duration-300 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between h-full">
                  <CardContent className="relative p-6 sm:p-8 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 bg-primary/5 dark:bg-primary/10 rounded-xl flex items-center justify-center text-primary transition-transform group-hover:scale-105 duration-300">
                          <Paintbrush className="w-6 h-6" />
                        </div>
                        <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted font-medium rounded-full text-xs px-2.5 py-0.5 border-none">
                          
                        </Badge>
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        Custom Frames
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                        Create your own personalized frame for any occasion. Upload your photo, choose your style, and make it uniquely yours.
                      </p>
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full bg-primary hover:bg-primary/95 text-white font-semibold shadow-none rounded-xl transition-all duration-300 group-hover:scale-[1.01]"
                    >
                      <span>Create Custom Frame</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )}

          {/* Birthday Frames Card */}
          {showBirthday && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              <Link href="/custom-frame/birthday" className="block h-full">
                <Card className="group relative overflow-hidden border border-border/80 bg-background/50 hover:bg-background/80 transition-all duration-300 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between h-full">
                  <CardContent className="relative p-6 sm:p-8 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 bg-primary/5 dark:bg-primary/10 rounded-xl flex items-center justify-center text-primary transition-transform group-hover:scale-105 duration-300">
                          <Cake className="w-6 h-6" />
                        </div>
                        <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted font-medium rounded-full text-xs px-2.5 py-0.5 border-none">
                          
                        </Badge>
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        Birthday Frames
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                        Celebrate birthdays with beautifully designed custom frames. Add photos, names, ages, and special messages to create the perfect birthday gift.
                      </p>
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full bg-primary hover:bg-primary/95 text-white font-semibold shadow-none rounded-xl transition-all duration-300 group-hover:scale-[1.01]"
                    >
                      <span>Create Birthday Frame</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )}

          {/* Wedding Frames Card */}
          {showWedding && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link href="/custom-frame/wedding" className="block h-full">
                <Card className="group relative overflow-hidden border border-border/80 bg-background/50 hover:bg-background/80 transition-all duration-300 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between h-full">
                  <CardContent className="relative p-6 sm:p-8 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 bg-primary/5 dark:bg-primary/10 rounded-xl flex items-center justify-center text-primary transition-transform group-hover:scale-105 duration-300">
                          <Heart className="w-6 h-6" />
                        </div>
                        <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted font-medium rounded-full text-xs px-2.5 py-0.5 border-none">
                      
                      
                        </Badge>
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        Wedding Frames
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                        Turn wedding moments into timeless wall art. Elegant designs featuring couple names, wedding dates, and romantic quotes to cherish forever.
                      </p>
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full bg-primary hover:bg-primary/95 text-white font-semibold shadow-none rounded-xl transition-all duration-300 group-hover:scale-[1.01]"
                    >
                      <span>Create Wedding Frame</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Trust Message */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2.5 bg-background border border-border/80 px-5 py-3 rounded-full shadow-sm">
            <div className="flex-shrink-0">
              <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Gift className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              All Birthday & Wedding Frames are <span className="text-primary font-semibold">handcrafted by our design team</span> for the best finish.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
