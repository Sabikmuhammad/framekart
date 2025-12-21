"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Check, Loader2, ShoppingCart, Info, Sparkles, Package, Truck, Shield, X, ZoomIn, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";

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
  { 
    value: "Black" as FrameStyle, 
    label: "Black", 
    color: "#000000",
    description: "Modern & Elegant"
  },
  { 
    value: "White" as FrameStyle, 
    label: "White", 
    color: "#FFFFFF",
    description: "Clean & Minimal"
  },
  { 
    value: "Wooden" as FrameStyle, 
    label: "Wooden", 
    color: "#8B4513",
    description: "Classic & Warm"
  },
];

export default function CustomFramePage() {
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [frameSize, setFrameSize] = useState<FrameSize>("A4");
  const [frameStyle, setFrameStyle] = useState<FrameStyle>("Black");
  const [customerNotes, setCustomerNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { addItem } = useCartStore();
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const currentPrice = FRAME_PRICES[frameSize];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check authentication before upload
    if (!isSignedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload your image.",
      });
      router.push("/sign-in?redirect=/custom-frame");
      return;
    }

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PNG, JPG, or WebP images only.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB max)
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
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
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
      if (process.env.NODE_ENV === 'development') {
        console.error("Upload error:", error);
      }
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
    if (!uploadedImageUrl) {
      toast({
        title: "No image uploaded",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToCart(true);

    try {
      const customFrameItem = {
        _id: `custom-${Date.now()}`,
        title: `Custom Frame - ${frameSize} ${frameStyle}`,
        price: currentPrice,
        imageUrl: uploadedImageUrl,
        frame_size: frameSize,
        frame_material: frameStyle,
        isCustom: true,
        customFrame: {
          uploadedImageUrl,
          frameStyle,
          frameSize,
          customerNotes,
        },
      };

      addItem(customFrameItem);

      toast({
        title: "Added to cart!",
        description: "Your custom frame has been added to the cart.",
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
      "A4": { width: 210, height: 297 }, // A4 in mm
      "12x18": { width: 12, height: 18 },
      "18x24": { width: 18, height: 24 },
      "24x36": { width: 24, height: 36 },
    };
    return ratios[size];
  };

  const frameRatio = getFrameDimensions(frameSize);
  const aspectRatio = frameRatio.height / frameRatio.width;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        {/* Subtle Background Pattern */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(0_0_0/0.05)_1px,transparent_0)] [background-size:40px_40px] dark:bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.05)_1px,transparent_0)] pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 text-primary px-5 py-2.5 rounded-full text-sm font-semibold mb-6 border border-primary/20 shadow-sm"
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              AI-Powered Frame Designer
            </motion.div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-6 leading-tight">
              Design Your Perfect Frame
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Upload your image, customize your frame with real-time preview, and we&apos;ll bring it to life with premium quality printing.
            </p>
            
            {/* Guest User Notice */}
            {!isSignedIn && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 mx-auto max-w-lg"
              >
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800 dark:text-blue-300 text-left">
                      <p className="font-semibold mb-1">Browse freely!</p>
                      <p>You can explore all options. Sign in required only when you&apos;re ready to upload your image.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left: Preview Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Live Preview */}
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                        <Sparkles className="relative h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      Live Preview
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Real-time {frameSize} frame visualization
                    </p>
                  </div>
                  {uploadedImage && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFullPreview(true)}
                      className="gap-1.5"
                    >
                      <ZoomIn className="h-4 w-4" />
                      <span className="hidden sm:inline">Fullscreen</span>
                    </Button>
                  )}
                </div>
                
                {/* A4 Proportional Container */}
                <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 sm:p-6 lg:p-8">
                  <motion.div
                    key={frameSize}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative w-full max-w-md"
                    style={{ aspectRatio: `${frameRatio.width} / ${frameRatio.height}` }}
                  >
                    {/* Frame Border with 3D Effect */}
                    <motion.div 
                      className="absolute inset-0 rounded-sm transition-all duration-500"
                      style={{
                        padding: frameSize === "A4" ? "20px" : 
                                frameSize === "12x18" ? "24px" :
                                frameSize === "18x24" ? "28px" : "32px",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.1) inset",
                      }}
                      animate={{
                        backgroundColor: frameStyle === "Black" ? "#1a1a1a" : 
                                       frameStyle === "White" ? "#f8f8f8" : 
                                       "#8B4513",
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Inner Shadow for Depth */}
                      <div className="absolute inset-0 rounded-sm pointer-events-none" 
                        style={{
                          boxShadow: frameStyle === "Black" 
                            ? "inset 0 2px 8px rgba(255,255,255,0.1)" 
                            : "inset 0 2px 8px rgba(0,0,0,0.15)"
                        }} 
                      />
                      
                      {/* Mat Board */}
                      <div className="relative w-full h-full bg-white dark:bg-gray-100 rounded-sm shadow-2xl overflow-hidden">
                        {/* Glass Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/5 pointer-events-none z-10" />
                        
                        <AnimatePresence mode="wait">
                          {uploadedImage ? (
                            <motion.div
                              key={uploadedImage}
                              initial={{ opacity: 0, scale: 1.05 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.4 }}
                              className="relative w-full h-full"
                            >
                              <img
                                src={uploadedImage}
                                alt="Your uploaded image"
                                className="w-full h-full object-cover"
                              />
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
                            >
                              <div className="text-center text-gray-400 dark:text-gray-600 p-6">
                                <motion.div
                                  animate={{ y: [0, -10, 0] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <Upload className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-30" />
                                </motion.div>
                                <p className="text-xs sm:text-sm font-medium">Upload an image to preview</p>
                                <p className="text-[10px] sm:text-xs mt-1 opacity-70">Your {frameSize} frame will appear here</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>

                    {/* Upload Overlay */}
                    <AnimatePresence>
                      {isUploading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-sm z-20"
                        >
                          <div className="text-center">
                            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-spin mx-auto mb-3" />
                            <p className="text-white font-medium text-sm sm:text-base">Uploading your image...</p>
                            <div className="mt-2 h-1 w-32 bg-white/20 rounded-full overflow-hidden mx-auto">
                              <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2 }}
                                className="h-full bg-white rounded-full"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
                
                {/* Info Bar */}
                {uploadedImage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3"
                  >
                    <span className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      {frameSize} • {frameStyle} Frame
                    </span>
                    <span className="text-gray-500 dark:text-gray-500">
                      {frameRatio.width} × {frameRatio.height} {frameSize === "A4" ? "mm" : "inches"}
                    </span>
                  </motion.div>
                )}

                {/* Upload Button */}
                <div className="mt-4 sm:mt-6">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      size="lg"
                      className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                          Uploading...
                        </>
                      ) : uploadedImage ? (
                        <>
                          <Check className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                          Change Image
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                          Upload Your Image
                        </>
                      )}
                    </Button>
                  </motion.div>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    PNG, JPG, WebP • Max 10MB • Recommended: 4000×4000px
                  </p>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { icon: Package, title: "Premium Quality", desc: "Museum-grade printing", gradient: "from-blue-500/10 to-blue-600/10", iconColor: "text-blue-600 dark:text-blue-400" },
                  { icon: Truck, title: "Fast Delivery", desc: "Ships in 3-5 days", gradient: "from-green-500/10 to-green-600/10", iconColor: "text-green-600 dark:text-green-400" },
                  { icon: Shield, title: "Secure Packaging", desc: "Protected delivery", gradient: "from-purple-500/10 to-purple-600/10", iconColor: "text-purple-600 dark:text-purple-400" },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className={`bg-gradient-to-br ${feature.gradient} backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow`}
                  >
                    <div className="relative">
                      <div className={`absolute inset-0 ${feature.iconColor} opacity-20 blur-xl`} />
                      <feature.icon className={`relative h-8 w-8 ${feature.iconColor} mb-2`} />
                    </div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{feature.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Customization Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Frame Size */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Select Size
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {FRAME_SIZES.map((size, index) => (
                    <motion.button
                      key={size.value}
                      onClick={() => setFrameSize(size.value)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 text-left overflow-hidden group ${
                        frameSize === size.value
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      {frameSize === size.value && (
                        <motion.div
                          layoutId="size-indicator"
                          className="absolute inset-0 bg-primary/5 dark:bg-primary/10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <div className="relative flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">{size.label}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                            Perfect for {size.value === "A4" ? "desks" : size.value === "12x18" ? "rooms" : size.value === "18x24" ? "walls" : "large walls"}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">₹{size.price}</p>
                          {frameSize === size.value && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 200 }}
                              className="mt-1"
                            >
                              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Frame Style */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Select Style
                </h3>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {FRAME_STYLES.map((style, index) => (
                    <motion.button
                      key={style.value}
                      onClick={() => setFrameStyle(style.value)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 overflow-hidden group ${
                        frameStyle === style.value
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      {frameStyle === style.value && (
                        <motion.div
                          layoutId="style-indicator"
                          className="absolute inset-0 bg-primary/5 dark:bg-primary/10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <div className="relative">
                        <div
                          className="w-full h-12 sm:h-16 rounded-lg mb-2 sm:mb-3 shadow-md border-4 transition-transform group-hover:scale-105"
                          style={{
                            backgroundColor: style.color,
                            borderColor: style.color === "#FFFFFF" ? "#e5e5e5" : style.color,
                          }}
                        />
                        <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white">{style.label}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{style.description}</p>
                        {frameStyle === style.value && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="mt-1 sm:mt-2"
                          >
                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Customer Notes */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Special Instructions <span className="text-sm text-gray-600 dark:text-gray-400 font-normal">(Optional)</span>
                </h3>
                <textarea
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Add any special requests or instructions for your frame..."
                  className="w-full h-20 sm:h-24 p-3 sm:p-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-2">{customerNotes.length}/500 characters</p>
              </div>

              {/* Price Summary & Add to Cart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 rounded-2xl shadow-2xl p-4 sm:p-6 text-white border border-gray-800 relative overflow-hidden"
              >
                {/* Animated Background Gradient */}
                <motion.div
                  animate={{
                    background: [
                      "radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                      "radial-gradient(circle at 100% 100%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
                      "radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                    ],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 opacity-50"
                />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-gray-400 text-xs sm:text-sm mb-1 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 rounded-full bg-gray-400" />
                        Total Price
                      </p>
                      <motion.div
                        key={currentPrice}
                        initial={{ scale: 1.2, y: -10 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="relative"
                      >
                        <motion.div
                          initial={{ opacity: 1, scale: 1.5 }}
                          animate={{ opacity: 0, scale: 2 }}
                          transition={{ duration: 0.6 }}
                          className="absolute inset-0 bg-blue-500/30 blur-2xl"
                        />
                        <p className="text-3xl sm:text-4xl font-bold relative z-10 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text">
                          ₹{currentPrice}
                        </p>
                      </motion.div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-300 text-xs sm:text-sm font-medium">{frameSize} • {frameStyle}</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={!uploadedImageUrl || isAddingToCart}
                    className="w-full h-10 sm:h-11 text-sm sm:text-base font-semibold bg-white text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    {isAddingToCart ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding to Cart...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  
                  {!uploadedImageUrl && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1"
                    >
                      <Upload className="h-3 w-3" />
                      Upload an image to continue
                    </motion.p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      <AnimatePresence>
        {showFullPreview && uploadedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFullPreview(false)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <Button
              onClick={() => setShowFullPreview(false)}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/10 rounded-full"
            >
              <X className="h-6 w-6" />
            </Button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-4xl w-full aspect-square"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className="absolute inset-0 p-16 transition-all duration-500"
                style={{
                  backgroundColor: frameStyle === "Black" ? "#1a1a1a" : 
                                 frameStyle === "White" ? "#f5f5f5" : 
                                 "#8B4513",
                }}
              >
                <div className="relative w-full h-full bg-white rounded-lg shadow-2xl overflow-hidden">
                  <img
                    src={uploadedImage}
                    alt="Full preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
