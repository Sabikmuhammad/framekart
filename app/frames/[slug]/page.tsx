"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/components/ui/use-toast";

export default function FrameDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [frame, setFrame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState({
    eligible: true,
    discountValue: 15,
    offerActive: true,
  });
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetch(`/api/frames/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setFrame(data.data);
          }
        })
        .finally(() => setLoading(false));
    }

    // Fetch eligibility
    fetch("/api/offers/eligibility")
      .then((res) => res.json())
      .then((data) => {
        console.log("Frame detail eligibility data:", data);
        if (data.success) {
          setEligibility({
            eligible: data.eligible ?? true,
            discountValue: data.discountValue ?? 15,
            offerActive: data.offerActive ?? true,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching eligibility:", error);
        // Keep default values (show offer)
      });
  }, [slug]);

  const handleAddToCart = () => {
    if (frame) {
      addItem({
        _id: frame._id,
        title: frame.title,
        price: frame.price,
        imageUrl: frame.imageUrl,
        frame_size: frame.frame_size,
        frame_material: frame.frame_material,
      });
      toast({
        title: "Added to cart",
        description: `${frame.title} has been added to your cart.`,
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="aspect-square bg-muted rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-1/4" />
              <div className="h-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!frame) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Frame not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={frame.imageUrl}
            alt={frame.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="mb-4">
            <h1 className="mb-2 text-3xl font-bold">{frame.title}</h1>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(4.9/5)</span>
            </div>
            {eligibility.offerActive && eligibility.eligible && eligibility.discountValue > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-bold text-muted-foreground line-through">
                    {formatPrice(frame.price)}
                  </p>
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {eligibility.discountValue}% OFF
                  </span>
                </div>
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(frame.price - Math.round((frame.price * eligibility.discountValue) / 100))}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  You save {formatPrice(Math.round((frame.price * eligibility.discountValue) / 100))}! 🎉
                </p>
              </div>
            ) : (
              <p className="text-3xl font-bold text-primary">
                {formatPrice(frame.price)}
              </p>
            )}
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-semibold">{frame.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="font-semibold">{frame.frame_size}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Material</p>
                  <p className="font-semibold">{frame.frame_material}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stock</p>
                  <p className="font-semibold">
                    {frame.stock > 0 ? "In Stock" : "Out of Stock"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-6">
            <h3 className="mb-2 font-semibold">Description</h3>
            <p className="text-muted-foreground">{frame.description}</p>
          </div>

          {frame.tags && frame.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-2 font-semibold">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {frame.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="rounded-full bg-secondary px-3 py-1 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto flex gap-4">
            <Button
              onClick={handleAddToCart}
              className="flex-1"
              size="lg"
              disabled={frame.stock === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {frame.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </Button>
            <Button variant="outline" size="lg">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
