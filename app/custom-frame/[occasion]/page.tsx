"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Check, Loader2, ShoppingCart, Info, Sparkles, ArrowLeft, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { OccasionForm, OccasionMetadata, OccasionType } from "@/components/custom-frames/OccasionForm";
import { getOccasionConfig, validateOccasionMetadata } from "@/lib/occasions";

type FrameSize = "A4" | "12x18" | "18x24" | "24x36";
type FrameStyle = "Black" | "White" | "Wooden";

const FRAME_PRICES: Record<FrameSize, number> = {
  A4: 999,
  "12x18": 1499,
  "18x24": 1999,
  "24x36": 2999,
};

const FRAME_SIZES = [
  { value: "A4" as FrameSize, label: "A4 (8.3 × 11.7 inches)", price: 999 },
  { value: "12x18" as FrameSize, label: "12 × 18 inches", price: 1499 },
  { value: "18x24" as FrameSize, label: "18 × 24 inches", price: 1999 },
  { value: "24x36" as FrameSize, label: "24 × 36 inches", price: 2999 },
];

const FRAME_STYLES = [
  { value: "Black" as FrameStyle, label: "Black", color: "#000000", description: "Modern & Elegant" },
  { value: "White" as FrameStyle, label: "White", color: "#FFFFFF", description: "Clean & Minimal" },
  { value: "Wooden" as FrameStyle, label: "Wooden", color: "#8B4513", description: "Classic & Warm" },
];

interface PageProps {
  params: {
    occasion: string;
  };
}

export default function OccasionFramePage({ params }: PageProps) {
  const occasion = params.occasion as OccasionType;
  const occasionConfig = getOccasionConfig(occasion);
  const Icon = occasionConfig.icon;

  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [frameSize, setFrameSize] = useState<FrameSize>("A4");
  const [frameStyle, setFrameStyle] = useState<FrameStyle>("Black");
  const [customerNotes, setCustomerNotes] = useState("");
  const [occasionMetadata, setOccasionMetadata] = useState<OccasionMetadata>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { addItem } = useCartStore();
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const currentPrice = FRAME_PRICES[frameSize];

  // Validate occasion type
  useEffect(() => {
    if (!["custom", "birthday", "wedding"].includes(occasion)) {
      router.push("/custom-frame");
    }
  }, [occasion, router]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSignedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload your image.",
      });
      router.push(`/sign-in?redirect=/custom-frame/${occasion}`);
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PNG, JPG, or WebP images only.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/custom", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadedImageUrl(data.data.url);
        toast({
          title: "Image uploaded successfully!",
          description: "Your image is ready to be framed.",
        });
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
      setUploadedImage("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddToCart = () => {
    // Validate occasion-specific metadata (image is now optional)
    const validation = validateOccasionMetadata(occasion, occasionMetadata);
    if (!validation.valid) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${validation.missing.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    setIsAddingToCart(true);

    try {
      const customFrameItem = {
        _id: `custom-${occasion}-${Date.now()}`,
        title: `${occasionConfig.title} - ${frameSize} ${frameStyle}`,
        price: currentPrice,
        imageUrl: uploadedImageUrl || "/placeholder-frame.jpg", // Placeholder if no image
        frame_size: frameSize,
        frame_material: frameStyle,
        isCustom: true,
        customFrame: {
          uploadedImageUrl: uploadedImageUrl || "", // Empty string if no image
          frameStyle,
          frameSize,
          customerNotes,
          occasion,
          occasionMetadata,
        },
      };

      addItem(customFrameItem);

      toast({
        title: "Added to cart!",
        description: `Your ${occasionConfig.title.toLowerCase()} has been added to the cart.`,
      });

      setTimeout(() => {
        router.push("/cart");
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const getFrameDimensions = (size: FrameSize) => {
    const ratios = {
      "A4": { width: 210, height: 297 },
      "12x18": { width: 12, height: 18 },
      "18x24": { width: 18, height: 24 },
      "24x36": { width: 24, height: 36 },
    };
    return ratios[size];
  };

  const frameRatio = getFrameDimensions(frameSize);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(0_0_0/0.05)_1px,transparent_0)] [background-size:40px_40px] dark:bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.05)_1px,transparent_0)] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`inline-flex items-center gap-2 bg-gradient-to-r ${occasionConfig.bgGradient} px-5 py-2.5 rounded-full text-sm font-semibold mb-6 border ${occasionConfig.borderColor} shadow-sm`}
          >
            <Icon className="h-4 w-4 animate-pulse" />
            {occasionConfig.subtitle}
          </motion.div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-6 leading-tight">
            {occasionConfig.heroTitle}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {occasionConfig.heroDescription}
          </p>
          
          {/* Design Team Info Banner */}
          {occasion !== "custom" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 mx-auto max-w-2xl"
            >
              <div className={`${occasionConfig.bgGradient} border ${occasionConfig.borderColor} rounded-lg p-4`}>
                <div className="flex items-start gap-3">
                  <Info className={`h-5 w-5 ${occasionConfig.accentColor} mt-0.5 flex-shrink-0`} />
                  <div className="text-sm text-gray-700 dark:text-gray-300 text-left">
                    <p className="font-semibold mb-1">Design Assistance Available</p>
                    <p>Our design team will contact you soon after placing the order to finalize the design and ensure it&apos;s perfect for your special occasion.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left: Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Live Preview
                </h2>
              </div>
              
              <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8">
                <motion.div
                  key={frameSize}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative w-full max-w-md"
                  style={{ aspectRatio: `${frameRatio.width} / ${frameRatio.height}` }}
                >
                  <motion.div 
                    className="absolute inset-0 rounded-sm"
                    style={{
                      padding: frameSize === "A4" ? "20px" : frameSize === "12x18" ? "24px" : frameSize === "18x24" ? "28px" : "32px",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                    }}
                    animate={{
                      backgroundColor: frameStyle === "Black" ? "#1a1a1a" : frameStyle === "White" ? "#f8f8f8" : "#8B4513",
                    }}
                  >
                    <div className="relative w-full h-full bg-white dark:bg-gray-100 rounded-sm shadow-2xl overflow-hidden">
                      <AnimatePresence mode="wait">
                        {uploadedImage ? (
                          <motion.img
                            key={uploadedImage}
                            src={uploadedImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          />
                        ) : (
                          <motion.div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                            <div className="text-center text-gray-400 p-6">
                              <Upload className="w-16 h-16 mx-auto mb-4 opacity-30" />
                              <p className="text-sm font-medium">Upload an image to preview</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-sm z-20">
                      <Loader2 className="w-12 h-12 text-white animate-spin" />
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right: Configuration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Upload Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Upload Image</h3>
                <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Optional</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full mb-3"
                size="lg"
                variant={uploadedImage ? "outline" : "default"}
              >
                {isUploading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Upload className="h-5 w-5 mr-2" />}
                {uploadedImage ? "Change Image" : "Upload Image"}
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                You can skip this step – our team will help you select the perfect image later
              </p>
            </div>

            {/* Occasion-Specific Form */}
            <OccasionForm
              occasion={occasion}
              metadata={occasionMetadata}
              onMetadataChange={setOccasionMetadata}
            />

            {/* Frame Size */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Frame Size</h3>
              <div className="grid grid-cols-2 gap-3">
                {FRAME_SIZES.map((size) => (
                  <motion.button
                    key={size.value}
                    onClick={() => setFrameSize(size.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      frameSize === size.value
                        ? `border-primary bg-primary/5`
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-sm font-semibold">{size.label}</div>
                    <div className="text-lg font-bold text-primary mt-1">₹{size.price}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Frame Style */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Frame Style</h3>
              <div className="grid grid-cols-3 gap-3">
                {FRAME_STYLES.map((style) => (
                  <motion.button
                    key={style.value}
                    onClick={() => setFrameStyle(style.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      frameStyle === style.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-2 border-2"
                      style={{ backgroundColor: style.color }}
                    />
                    <div className="text-sm font-semibold">{style.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any special instructions or preferences..."
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full"
              size="lg"
            >
              {isAddingToCart ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <ShoppingCart className="h-5 w-5 mr-2" />
              )}
              Add to Cart - ₹{currentPrice}
            </Button>
            {!uploadedImage && occasion !== "custom" && (
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                No image yet? No problem! Our design team will assist you after checkout.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
