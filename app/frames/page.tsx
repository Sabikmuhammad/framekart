"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import FrameCard from "@/components/FrameCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Grid3x3, LayoutGrid, TrendingUp, Star, DollarSign, Layers, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { name: "All", icon: Layers },
  { name: "Wall Frames", icon: LayoutGrid },
  { name: "Calligraphy Frames", icon: Star },
  { name: "Birthday Frames", icon: TrendingUp },
  { name: "Photo Frames", icon: Grid3x3 },
  { name: "Custom Frames", icon: Star }
];

const sortOptions = [
  { value: "featured", label: "Featured", icon: Star },
  { value: "newest", label: "Newest First", icon: Clock },
  { value: "price-low", label: "Price: Low to High", icon: DollarSign },
  { value: "price-high", label: "Price: High to Low", icon: DollarSign },
  { value: "name", label: "Name: A to Z", icon: TrendingUp }
];

function FramesList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Get active values from URL
  const selectedCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort") || "featured";

  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "large">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [eligibility, setEligibility] = useState({
    eligible: true,
    discountValue: 15,
    offerActive: true,
  });

  // Local state for immediate typing input, which will update search param with debounce
  const [searchInput, setSearchInput] = useState(initialSearch);

  // Sync search input if URL search changes externally
  useEffect(() => {
    setSearchInput(initialSearch);
  }, [initialSearch]);

  // Update URL helper
  const updateQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Debounce search input update to URL
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== initialSearch) {
        updateQueryParam("search", searchInput);
      }
    }, 400);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Fetch frames whenever category or search param changes
  useEffect(() => {
    fetchFrames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, initialSearch]);

  // Fetch eligibility once on mount
  useEffect(() => {
    fetchEligibility();
  }, []);

  const fetchEligibility = async () => {
    try {
      const response = await fetch("/api/offers/eligibility");
      const data = await response.json();
      if (data.success) {
        setEligibility({
          eligible: data.eligible ?? true,
          discountValue: data.discountValue ?? 15,
          offerActive: data.offerActive ?? true,
        });
      }
    } catch (error) {
      console.error("Error fetching eligibility:", error);
    }
  };

  const fetchFrames = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.append("category", selectedCategory);
    if (initialSearch) params.append("search", initialSearch);
    
    try {
      const res = await fetch(`/api/frames?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setFrames(data.data);
      }
    } catch (err) {
      console.error("Error fetching frames:", err);
    } finally {
      setLoading(false);
    }
  };

  // Client-side sorting on fetched frames
  const processedFrames = [...frames].sort((a: any, b: any) => {
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
        return 0; // "featured" or default
    }
  });

  const clearAllFilters = () => {
    setSearchInput("");
    router.push(pathname, { scroll: false });
  };

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
          <div className="relative max-w-2xl mx-auto group">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/80 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search frames..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-12 pr-4 h-12 lg:h-14 text-sm sm:text-base shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-border/60 hover:border-border/90 focus-visible:ring-primary/20 focus-visible:ring-4 rounded-full transition-all duration-300 bg-background/80 backdrop-blur-sm"
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
              className={`gap-1.5 sm:gap-2 text-xs sm:text-sm rounded-full px-4 h-10 border-border/60 bg-background/80 backdrop-blur-sm shadow-sm transition-all duration-300 active:scale-[0.98] ${
                showFilters ? "border-primary text-primary bg-primary/5" : "hover:border-primary/50"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden xs:inline">Filters & Sort</span>
              <span className="xs:hidden">Filters</span>
            </Button>

            <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-full border border-border/40 backdrop-blur-sm">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 px-3 rounded-full text-xs gap-1.5 transition-all duration-200 active:scale-95"
              >
                <Grid3x3 className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Grid View</span>
              </Button>
              <Button
                variant={viewMode === "large" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("large")}
                className="h-8 px-3 rounded-full text-xs gap-1.5 transition-all duration-200 active:scale-95"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Large View</span>
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
                <Card className="p-4 sm:p-6 space-y-6 bg-background/60 backdrop-blur-md border border-border/60 shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-3xl">
                  {/* Categories */}
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base mb-3 flex items-center gap-2 text-foreground/90">
                      <LayoutGrid className="h-4 w-4 text-primary" />
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
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
                              updateQueryParam("category", category.name === "All" ? "" : category.name)
                            }
                            className={`gap-1.5 sm:gap-2 text-xs sm:text-sm h-9 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                              isActive 
                                ? "bg-gradient-to-r from-primary to-purple-600 border-none shadow-md shadow-primary/20" 
                                : "hover:border-primary/50 bg-background/80"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {category.name}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base mb-3 flex items-center gap-2 text-foreground/90">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Sort By
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {sortOptions.map((option) => {
                        const Icon = option.icon;
                        const isActive = sortBy === option.value;
                        return (
                          <Button
                            key={option.value}
                            variant={isActive ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateQueryParam("sort", option.value)}
                            className={`gap-1.5 sm:gap-2 text-xs sm:text-sm h-9 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                              isActive 
                                ? "bg-gradient-to-r from-primary to-purple-600 border-none shadow-md shadow-primary/20" 
                                : "hover:border-primary/50 bg-background/80"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
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
          className="mb-4 flex items-center justify-between px-1"
        >
          <p className="text-xs sm:text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{processedFrames.length}</span> {processedFrames.length === 1 ? 'frame' : 'frames'}
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
              <Card key={i} className="h-64 sm:h-72 lg:h-96 animate-pulse bg-muted rounded-3xl" />
            ))}
          </div>
        ) : processedFrames.length > 0 ? (
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
            {processedFrames.map((frame: any, index: number) => (
              <motion.div
                key={frame._id}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
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
            initial={{ opacity: 0, scale: 0.95 }}
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
                onClick={clearAllFilters}
                variant="outline"
                size="sm"
                className="sm:size-default rounded-full px-5 hover:border-primary/50"
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

export default function FramesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading collection...</p>
        </div>
      </div>
    }>
      <FramesList />
    </Suspense>
  );
}
