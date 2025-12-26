"use client";

import { useState, useEffect } from "react";
import FrameCard from "@/components/FrameCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Grid3x3, LayoutGrid, TrendingUp, Star, DollarSign, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export default function FramesPage() {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "large">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [eligibility, setEligibility] = useState({
    eligible: true,
    discountValue: 15,
    offerActive: true,
  });

  useEffect(() => {
    fetchFrames();
    fetchEligibility();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const fetchEligibility = async () => {
    try {
      const response = await fetch("/api/offers/eligibility");
      const data = await response.json();
      console.log("Frames page eligibility data:", data);
      if (data.success) {
        setEligibility({
          eligible: data.eligible ?? true,
          discountValue: data.discountValue ?? 15,
          offerActive: data.offerActive ?? true,
        });
      }
    } catch (error) {
      console.error("Error fetching eligibility:", error);
      // Keep default values (show offer)
    }
  };

  const fetchFrames = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.append("category", selectedCategory);
    
    const res = await fetch(`/api/frames?${params}`);
    const data = await res.json();
    
    if (data.success) {
      setFrames(data.data);
    }
    setLoading(false);
  };

  const filteredFrames = frames
    .filter((frame: any) =>
      frame.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      frame.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.title.localeCompare(b.title);
        case "newest":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });

  const categories = [
    { name: "All", icon: Sparkles },
    { name: "Wall Frames", icon: LayoutGrid },
    { name: "Calligraphy Frames", icon: Star },
    { name: "Birthday Frames", icon: TrendingUp },
    { name: "Photo Frames", icon: Grid3x3 },
    { name: "Custom Frames", icon: Star }
  ];

  const sortOptions = [
    { value: "featured", label: "Featured", icon: Star },
    { value: "newest", label: "Newest First", icon: Sparkles },
    { value: "price-low", label: "Price: Low to High", icon: DollarSign },
    { value: "price-high", label: "Price: High to Low", icon: DollarSign },
    { value: "name", label: "Name: A to Z", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8 lg:mb-12 text-center"
        >
          <h1 className="mb-2 sm:mb-3 lg:mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent px-2">
            Our Premium Collection
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
            Discover 100+ handcrafted frames to transform your space
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 sm:mb-6"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search frames..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 sm:pl-12 pr-3 sm:pr-4 h-11 sm:h-12 lg:h-14 text-sm sm:text-base shadow-lg border-2"
            />
          </div>
        </motion.div>

        {/* Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4 sm:mb-6 lg:mb-8"
        >
          <div className="flex flex-row gap-2 sm:gap-4 items-center justify-between mb-3 sm:mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-1.5 sm:gap-2 text-xs sm:text-sm"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Filters & Sort</span>
              <span className="xs:hidden">Filters</span>
            </Button>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">View:</span>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 sm:h-9 sm:w-9 p-0"
              >
                <Grid3x3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant={viewMode === "large" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("large")}
                className="h-8 w-8 sm:h-9 sm:w-9 p-0"
              >
                <LayoutGrid className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <Card className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-2">
                      <LayoutGrid className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {categories.map((category) => {
                        const Icon = category.icon;
                        const isActive = 
                          (category.name === "All" && !selectedCategory) ||
                          selectedCategory === category.name;
                        
                        return (
                          <Button
                            key={category.name}
                            variant={isActive ? "default" : "outline"}
                            size="sm"
                            onClick={() =>
                              setSelectedCategory(category.name === "All" ? "" : category.name)
                            }
                            className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9"
                          >
                            <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            {category.name}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Sort By
                    </h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {sortOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <Button
                            key={option.value}
                            variant={sortBy === option.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSortBy(option.value)}
                            className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9"
                          >
                            <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            {option.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Count */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-3 sm:mb-4 flex items-center justify-between"
        >
          <p className="text-xs sm:text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredFrames.length}</span> {filteredFrames.length === 1 ? 'frame' : 'frames'}
          </p>
        </motion.div>

        {/* Frames Grid */}
        {loading ? (
          <div className={`grid gap-3 sm:gap-4 lg:gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}>
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="h-64 sm:h-72 lg:h-96 animate-pulse bg-muted" />
            ))}
          </div>
        ) : filteredFrames.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`grid gap-3 sm:gap-4 lg:gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {filteredFrames.map((frame: any, index: number) => (
              <motion.div
                key={frame._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <FrameCard 
                  frame={frame} 
                  showDiscountBadge={eligibility.eligible && eligibility.offerActive}
                  discountValue={eligibility.discountValue}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="py-12 sm:py-16 lg:py-24 text-center px-4"
          >
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2">No frames found</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                Try adjusting your search or filters to find what you&apos;re looking for
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                  setSortBy("featured");
                }}
                variant="outline"
                size="sm"
                className="sm:size-default"
              >
                Clear All Filters
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
