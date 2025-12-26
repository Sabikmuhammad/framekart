"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart, Star, Shield, Package, Truck, Award, Check, Eye, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

export default function FrameDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const [frame, setFrame] = useState<any>(null);
  const [similarFrames, setSimilarFrames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
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
            // Fetch similar frames based on category
            if (data.data.category) {
              fetch(`/api/frames?category=${data.data.category}&limit=4`)
                .then((res) => res.json())
                .then((similarData) => {
                  if (similarData.success) {
                    // Filter out current frame
                    const filtered = similarData.data.filter((f: any) => f._id !== data.data._id);
                    setSimilarFrames(filtered.slice(0, 4));
                  }
                })
                .catch(() => {});
            }
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="grid gap-4 sm:gap-6 lg:gap-8 md:grid-cols-2">
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
          <div className="mb-3 sm:mb-4">
            <h1 className="mb-2 text-2xl sm:text-3xl font-bold">{frame.title}</h1>
            <div className="mb-3 sm:mb-4 flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">(4.9/5)</span>
            </div>
            {eligibility.offerActive && eligibility.eligible && eligibility.discountValue > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <p className="text-xl sm:text-2xl font-bold text-muted-foreground line-through">
                    {formatPrice(frame.price)}
                  </p>
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full">
                    {eligibility.discountValue}% OFF
                  </span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-primary">
                  {formatPrice(frame.price - Math.round((frame.price * eligibility.discountValue) / 100))}
                </p>
                <p className="text-xs sm:text-sm text-green-600 font-medium">
                  You save {formatPrice(Math.round((frame.price * eligibility.discountValue) / 100))}! 🎉
                </p>
              </div>
            ) : (
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                {formatPrice(frame.price)}
              </p>
            )}
          </div>

          <Card className="mb-4 sm:mb-6">
            <CardContent className="pt-4 sm:pt-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
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

          <div className="mb-4 sm:mb-6">
            <h3 className="mb-2 font-semibold text-base sm:text-lg">Description</h3>
            <p className="text-sm sm:text-base text-muted-foreground">{frame.description}</p>
          </div>

          {frame.tags && frame.tags.length > 0 && (
            <div className="mb-4 sm:mb-6">
              <h3 className="mb-2 font-semibold text-base sm:text-lg">Tags</h3>
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

          <div className="mt-auto flex gap-3 sm:gap-4">
            <Button
              onClick={handleAddToCart}
              className="flex-1"
              size="lg"
              disabled={frame.stock === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">{frame.stock > 0 ? "Add to Cart" : "Out of Stock"}</span>
            </Button>
            <Button variant="outline" size="lg" className="px-3 sm:px-4">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quality Features Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 sm:mt-8 lg:mt-10 mb-6 sm:mb-8 lg:mb-10"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 px-4">Premium Quality Features</h2>
        
        <div className="grid gap-3 sm:gap-4 lg:gap-5 grid-cols-2 lg:grid-cols-4">
          {/* Quality Feature 1 */}
          <Card className="border hover:border-primary transition-all duration-300 hover:shadow-md">
            <CardContent className="pt-4 sm:pt-5 pb-4 px-3 sm:px-4 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-1.5">Premium Materials</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                High-quality {frame.frame_material.toLowerCase()} frame with glass protection
              </p>
            </CardContent>
          </Card>

          {/* Quality Feature 2 */}
          <Card className="border hover:border-primary transition-all duration-300 hover:shadow-md">
            <CardContent className="pt-4 sm:pt-5 pb-4 px-3 sm:px-4 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-1.5">HD Print Quality</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Professional printing with vibrant colors
              </p>
            </CardContent>
          </Card>

          {/* Quality Feature 3 */}
          <Card className="border hover:border-primary transition-all duration-300 hover:shadow-md">
            <CardContent className="pt-4 sm:pt-5 pb-4 px-3 sm:px-4 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-1.5">Secure Packaging</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Protected delivery every time
              </p>
            </CardContent>
          </Card>

          {/* Quality Feature 4 */}
          <Card className="border hover:border-primary transition-all duration-300 hover:shadow-md">
            <CardContent className="pt-4 sm:pt-5 pb-4 px-3 sm:px-4 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-1.5">7-Day Guarantee</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Easy returns with full refund
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Frame Quality Highlights */}
        <div className="mt-6 sm:mt-8 grid md:grid-cols-2 gap-4 sm:gap-6 items-center">
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={frame.imageUrl}
              alt="Frame quality showcase"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
              <p className="text-white font-bold text-base sm:text-lg mb-1">Museum-Grade Quality</p>
              <p className="text-white/90 text-xs sm:text-sm">Handcrafted with precision</p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex gap-2.5 sm:gap-3">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold mb-0.5 sm:mb-1 text-sm sm:text-base">UV Protected Glass</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Protects from fading over time
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 sm:gap-3">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold mb-0.5 sm:mb-1 text-sm sm:text-base">Moisture Resistant</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Prevents warping and ensures longevity
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 sm:gap-3">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold mb-0.5 sm:mb-1 text-sm sm:text-base">Easy Wall Mount</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Pre-installed hanging hardware included
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 sm:gap-3">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold mb-0.5 sm:mb-1 text-sm sm:text-base">Eco-Friendly Materials</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Sustainably sourced materials
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Similar Products Section */}
      {similarFrames.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 sm:mt-12 lg:mt-16 mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Similar Frames You'll Love</h2>
            <Button 
              variant="outline"
              size="sm"
              className="sm:size-default"
              onClick={() => router.push(`/frames?category=${frame.category}`)}
            >
              View All <Eye className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
            {similarFrames.map((similarFrame, index) => (
              <motion.div
                key={similarFrame._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card 
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-primary overflow-hidden"
                  onClick={() => router.push(`/frames/${similarFrame.slug}`)}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={similarFrame.imageUrl}
                      alt={similarFrame.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {eligibility.offerActive && eligibility.eligible && eligibility.discountValue > 0 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {eligibility.discountValue}% OFF
                      </div>
                    )}
                  </div>
                  <CardContent className="pt-3 sm:pt-4 px-3 sm:px-4">
                    <h3 className="font-semibold mb-1 sm:mb-2 line-clamp-2 group-hover:text-primary transition-colors text-sm sm:text-base">
                      {similarFrame.title}
                    </h3>
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">(4.9)</span>
                    </div>
                    {eligibility.offerActive && eligibility.eligible && eligibility.discountValue > 0 ? (
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <p className="text-base sm:text-lg font-bold text-primary">
                          {formatPrice(similarFrame.price - Math.round((similarFrame.price * eligibility.discountValue) / 100))}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground line-through">
                          {formatPrice(similarFrame.price)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-base sm:text-lg font-bold text-primary">
                        {formatPrice(similarFrame.price)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 sm:mt-12 lg:mt-16 mb-6 sm:mb-8"
      >
        <Card className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-primary/20">
          <CardContent className="py-6 sm:py-8">
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3 text-center">
              <div className="flex flex-col items-center">
                <Truck className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2 sm:mb-3" />
                <h4 className="font-bold mb-1 text-sm sm:text-base">Free Shipping</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">On all orders above ₹999</p>
              </div>
              <div className="flex flex-col items-center">
                <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2 sm:mb-3" />
                <h4 className="font-bold mb-1 text-sm sm:text-base">Secure Payments</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">100% payment protection</p>
              </div>
              <div className="flex flex-col items-center">
                <Award className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2 sm:mb-3" />
                <h4 className="font-bold mb-1 text-sm sm:text-base">Quality Assured</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">Handcrafted with care</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
