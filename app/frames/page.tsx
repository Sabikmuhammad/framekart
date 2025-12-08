"use client";

import { useState, useEffect } from "react";
import FrameCard from "@/components/FrameCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function FramesPage() {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchFrames();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

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

  const filteredFrames = frames.filter((frame: any) =>
    frame.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    frame.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ["All", "Modern", "Classic", "Vintage", "Minimalist"];

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="mb-3 sm:mb-4 text-3xl sm:text-4xl font-bold">Our Frames Collection</h1>
        <p className="text-muted-foreground">
          Browse our extensive collection of premium wall frames
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search frames..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((category) => (
            <Button
              key={category}
              variant={
                (category === "All" && !selectedCategory) ||
                selectedCategory === category
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() =>
                setSelectedCategory(category === "All" ? "" : category)
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Frames Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="h-64 sm:h-80 animate-pulse bg-muted" />
          ))}
        </div>
      ) : filteredFrames.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredFrames.map((frame: any) => (
            <FrameCard key={frame._id} frame={frame} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No frames found</p>
        </div>
      )}
    </div>
  );
}
