"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import FrameCard from "@/components/FrameCard";
import { Search, SlidersHorizontal, ArrowUpDown, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  "All",
  "Wall Frames",
  "Calligraphy Frames",
  "Birthday Frames",
  "Photo Frames",
  "Custom Frames"
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

function FramesList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const selectedCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort") || "featured";

  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState({
    eligible: true,
    discountValue: 15,
    offerActive: true,
  });

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);
  const [showDesktopSort, setShowDesktopSort] = useState(false);

  useEffect(() => {
    setSearchInput(initialSearch);
  }, [initialSearch]);

  const updateQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== initialSearch) {
        updateQueryParam("search", searchInput);
      }
    }, 400);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  useEffect(() => {
    fetchFrames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, initialSearch]);

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
    if (selectedCategory && selectedCategory !== "All") params.append("category", selectedCategory);
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

  const processedFrames = [...frames].sort((a: any, b: any) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      default:
        return 0;
    }
  });

  const clearAllFilters = () => {
    setSearchInput("");
    router.push(pathname, { scroll: false });
    setShowMobileFilters(false);
  };

  const activeFiltersCount = (selectedCategory && selectedCategory !== "All" ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111827] font-sans pb-24">
      {/* Hero Section */}
      <div className="pt-10 pb-8 md:pt-16 md:pb-12 px-4 text-center bg-[#F8FAFC]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-1 md:mb-2"
        >
          <span className="text-[10px] md:text-[11px] font-[700] tracking-[0.15em] text-[#64748B] uppercase">
            FrameKart Collection
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="text-[28px] sm:text-[34px] md:text-[48px] lg:text-[56px] font-[600] tracking-[-0.04em] leading-[1.1] mb-2 md:mb-4 text-[#111827]"
        >
          Our Premium<br className="md:hidden" /> Collection
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="text-[13px] sm:text-[15px] md:text-[17px] text-[#64748B] max-w-[420px] mx-auto font-medium"
        >
          Premium frames designed for meaningful spaces.
        </motion.p>
      </div>

      {/* Promotional Marquee */}
      <div className="w-full bg-[#FFFFFF] py-3 md:py-3.5 overflow-hidden border-b border-[#E5E7EB]">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes premium-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-premium-marquee {
            animation: premium-marquee 35s linear infinite;
            width: max-content;
            will-change: transform;
          }
          .animate-premium-marquee:hover {
            animation-play-state: paused;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-premium-marquee {
              animation: none !important;
              transform: translateX(0) !important;
            }
          }
        `}} />
        <div className="animate-premium-marquee flex items-center whitespace-nowrap">
          {[0, 1].map((dupIdx) => (
            <div key={dupIdx} className="flex items-center min-w-max">
              {[
                "PREMIUM FRAMES", "✦",
                "15% OFF", "✦",
                "SECURE PACKAGING", "✦",
                "FAST DELIVERY", "✦",
                "CRAFTED FOR YOUR SPACE", "✦"
              ].map((item, idx) => (
                <span 
                  key={idx} 
                  className={`mx-3 md:mx-6 flex-shrink-0 ${
                    item === "✦" 
                      ? "text-[#CBD5E1] text-[8px] md:text-[9px]" 
                      : "text-[10px] md:text-[11px] font-[600] tracking-[0.2em] text-[#475569] uppercase"
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-5 lg:px-6 pt-6 md:pt-10">
        
        {/* Controls: Search, Desktop Tabs, Desktop Sort */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 mb-6">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-[280px] shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
            <input 
              type="text"
              placeholder="Search frames..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full h-[44px] md:h-[48px] pl-10 pr-4 bg-white border border-[#E2E8F0] rounded-[12px] md:rounded-[14px] text-[13px] md:text-[14px] text-[#111827] outline-none transition-all duration-300 focus:border-[#3B82F6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] placeholder:text-[#94A3B8] font-medium"
            />
          </div>

          {/* Desktop Categories (Pills) */}
          <div className="hidden md:flex flex-1 items-center gap-6 overflow-x-auto hide-scrollbar">
            {categories.map((cat) => {
              const isActive = (!selectedCategory && cat === "All") || selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => updateQueryParam("category", cat)}
                  className={`relative whitespace-nowrap text-[13px] lg:text-[14px] font-[500] py-2 transition-colors duration-200 outline-none ${
                    isActive ? "text-[#3B82F6]" : "text-[#64748B] hover:text-[#111827]"
                  }`}
                >
                  {cat}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3B82F6] rounded-t-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Desktop Sort */}
          <div className="hidden md:block relative shrink-0">
            <button 
              onClick={() => setShowDesktopSort(!showDesktopSort)}
              className="flex items-center gap-2 h-[44px] md:h-[48px] px-4 border border-[#E2E8F0] rounded-[12px] md:rounded-[14px] text-[13px] md:text-[14px] font-[500] text-[#111827] bg-white hover:bg-[#F8FAFC] transition-colors"
            >
              Sort: {sortOptions.find(o => o.value === sortBy)?.label || "Featured"}
              <ArrowUpDown className="h-3.5 w-3.5 text-[#64748B]" />
            </button>
            <AnimatePresence>
              {showDesktopSort && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-[200px] bg-white border border-[#E2E8F0] rounded-[14px] shadow-[0_12px_40px_rgba(15,23,42,0.08)] py-2 z-50 overflow-hidden"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        updateQueryParam("sort", opt.value);
                        setShowDesktopSort(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[13px] font-[500] transition-colors flex items-center justify-between ${
                        sortBy === opt.value ? "text-[#3B82F6] bg-[#EFF6FF]/50" : "text-[#475569] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      {opt.label}
                      {sortBy === opt.value && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Control Row (Filters & Sort) */}
        <div className="flex md:hidden items-center gap-3 mb-6">
          <button 
            onClick={() => setShowMobileFilters(true)} 
            className="flex-1 h-[44px] border border-[#E2E8F0] bg-white rounded-[12px] flex items-center justify-center gap-2 text-[13px] font-[500] text-[#111827] active:scale-[0.98] transition-transform shadow-[0_2px_10px_rgba(15,23,42,0.02)]"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#64748B]" /> 
            Filters {activeFiltersCount > 0 && <span className="text-[#3B82F6]">• {activeFiltersCount}</span>}
          </button>
          <button 
            onClick={() => setShowMobileSort(true)} 
            className="flex-1 h-[44px] border border-[#E2E8F0] bg-white rounded-[12px] flex items-center justify-center gap-2 text-[13px] font-[500] text-[#111827] active:scale-[0.98] transition-transform shadow-[0_2px_10px_rgba(15,23,42,0.02)]"
          >
            Sort <ArrowUpDown className="h-4 w-4 text-[#64748B]" />
          </button>
        </div>

        {/* Product Count */}
        <div className="mb-4 flex items-center">
          <span className="text-[11px] md:text-[12px] text-[#94A3B8] font-medium">
            {processedFrames.length} {processedFrames.length === 1 ? 'frame' : 'frames'}
          </span>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-[#F1F5F9] rounded-[14px] lg:rounded-[18px] animate-pulse overflow-hidden flex flex-col">
                <div className="flex-1" />
                <div className="p-3 bg-white h-[90px] border-t border-[#E5E7EB]">
                   <div className="h-3 w-2/3 bg-[#E2E8F0] rounded mb-2" />
                   <div className="h-3 w-1/3 bg-[#E2E8F0] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : processedFrames.length > 0 ? (
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.05 } }
            }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5"
          >
            {processedFrames.map((frame: any) => (
              <motion.div
                key={frame._id}
                variants={{
                  hidden: { opacity: 0, y: 15, scale: 0.99 },
                  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
                }}
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
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-16 md:py-24 text-center px-4"
          >
            <div className="max-w-md mx-auto flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-5">
                <Search className="h-6 w-6 md:h-8 md:w-8 text-[#94A3B8]" />
              </div>
              <h3 className="text-[17px] md:text-[20px] font-[600] text-[#111827] mb-2">No frames found</h3>
              <p className="text-[13px] md:text-[14px] text-[#64748B] mb-6">
                Try adjusting your search or category filters to find what you're looking for.
              </p>
              <button 
                onClick={clearAllFilters}
                className="h-[40px] md:h-[44px] px-6 rounded-full bg-[#111827] text-white text-[13px] font-[500] hover:bg-[#1E293B] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Mobile Filter Bottom Sheet */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-[#0F172A]/25 backdrop-blur-[2px] z-[100] md:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] z-[101] md:hidden flex flex-col max-h-[85vh] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
                <h3 className="text-[15px] font-[600] text-[#111827]">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-1.5 -mr-1.5 bg-[#F8FAFC] rounded-full text-[#64748B]">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-5 overflow-y-auto">
                <h4 className="text-[12px] font-[600] text-[#94A3B8] uppercase tracking-wider mb-4">Category</h4>
                <div className="flex flex-col gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        updateQueryParam("category", cat);
                        setShowMobileFilters(false);
                      }}
                      className={`flex items-center justify-between py-3 px-3 rounded-[10px] text-[14px] font-[500] transition-colors ${
                        ((!selectedCategory && cat === "All") || selectedCategory === cat)
                          ? "bg-[#EFF6FF] text-[#3B82F6]" 
                          : "text-[#475569] active:bg-[#F8FAFC]"
                      }`}
                    >
                      {cat}
                      {((!selectedCategory && cat === "All") || selectedCategory === cat) && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Sort Bottom Sheet */}
      <AnimatePresence>
        {showMobileSort && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSort(false)}
              className="fixed inset-0 bg-[#0F172A]/25 backdrop-blur-[2px] z-[100] md:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] z-[101] md:hidden flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
                <h3 className="text-[15px] font-[600] text-[#111827]">Sort by</h3>
                <button onClick={() => setShowMobileSort(false)} className="p-1.5 -mr-1.5 bg-[#F8FAFC] rounded-full text-[#64748B]">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-3 pb-8">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      updateQueryParam("sort", opt.value);
                      setShowMobileSort(false);
                    }}
                    className={`flex items-center justify-between w-full p-4 rounded-[12px] text-[14px] font-[500] transition-colors ${
                      sortBy === opt.value ? "text-[#3B82F6] bg-[#EFF6FF]" : "text-[#475569] active:bg-[#F8FAFC]"
                    }`}
                  >
                    {opt.label}
                    {sortBy === opt.value && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function FramesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#3B82F6]" />
        </div>
      </div>
    }>
      <FramesList />
    </Suspense>
  );
}
