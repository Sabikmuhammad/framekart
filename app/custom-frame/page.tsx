"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Check, Loader2, ShoppingCart, Info, Package, Truck, Shield, X, ZoomIn, Download, Crop, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { ImageCropModal } from "@/components/custom-frames/ImageCropModal";
import { OccasionPromo } from "@/components/custom-frames/OccasionPromo";
import { detectImageOrientation, loadImage, getFrameDimensions, calculateAspectRatio, blobToDataURL } from "@/lib/utils/image-utils";
import { UploadedImage, CropData, type FrameSize, type FrameStyle } from "@/lib/types/custom-frame";

const FRAME_PRICES: Record<FrameSize, number> = {
  A4: 1,
  "12x18": 1499,
  "18x24": 1999,
  "24x36": 2999,
};

const FRAME_SIZES = [
  { value: "A4" as FrameSize, label: "A4 (8.3 × 11.7 inches)", price: 1 },
  // { value: "12x18" as FrameSize, label: "12 × 18 inches", price: 1499 },
  // { value: "18x24" as FrameSize, label: "18 × 24 inches", price: 1999 },
  // { value: "24x36" as FrameSize, label: "24 × 36 inches", price: 2999 },
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
  { value: "Golden" as FrameStyle, label: "Golden", color: "#D4AF37", description: "Luxury & Bold" },
];

const FEATURE_ITEMS = [
  { icon: Package, title: "Premium Quality", desc: "Museum-grade printing", gradient: "from-blue-500/10 to-blue-600/10", iconColor: "text-blue-600 dark:text-blue-400" },
  { icon: Truck, title: "Fast Delivery", desc: "Ships in 3-5 days", gradient: "from-green-500/10 to-green-600/10", iconColor: "text-green-600 dark:text-green-400" },
  { icon: Shield, title: "Secure Packaging", desc: "Protected delivery", gradient: "from-purple-500/10 to-purple-600/10", iconColor: "text-purple-600 dark:text-purple-400" },
] as const;

export default function CustomFramePage() {
  // Image upload state with crop support
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string>("");
  
  // Frame configuration
  const [frameSize, setFrameSize] = useState<FrameSize>("A4");
  const [frameStyle, setFrameStyle] = useState<FrameStyle>("Black");
  const [customerNotes, setCustomerNotes] = useState("");
  
  // UI states
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hooks
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
      const previewDataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Load image dimensions and detect orientation
      const dimensions = await loadImage(previewDataUrl);
      const orientation = detectImageOrientation(dimensions.width, dimensions.height);

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/custom", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Store full image data
        const imageData: UploadedImage = {
          originalUrl: data.data.url,
          width: dimensions.width,
          height: dimensions.height,
          orientation,
          isCropped: false,
        };

        setUploadedImage(imageData);
        setUploadedImageUrl(data.data.url);
        setUploadedImagePreview(previewDataUrl);

        toast({
          title: "Image uploaded successfully!",
          description: "Your full image will be framed without cropping. You can optionally crop it.",
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
      setUploadedImage(null);
      setUploadedImagePreview("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCropImage = () => {
    if (!uploadedImage) return;
    setShowCropModal(true);
  };

  const handleCropComplete = async (croppedBlob: Blob, cropData: CropData) => {
    if (!uploadedImage) return;

    try {
      // Convert blob to data URL for preview
      const croppedDataUrl = await blobToDataURL(croppedBlob);

      // Upload cropped image to Cloudinary
      const formData = new FormData();
      formData.append("file", croppedBlob, "cropped-image.jpg");

      const response = await fetch("/api/upload/custom", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Update image data with crop information
        const updatedImage: UploadedImage = {
          ...uploadedImage,
          croppedUrl: data.data.url,
          isCropped: true,
          cropData,
        };

        setUploadedImage(updatedImage);
        setUploadedImagePreview(croppedDataUrl);
        setShowCropModal(false);

        toast({
          title: "Image cropped successfully!",
          description: "Your cropped image will be used for the frame.",
        });
      } else {
        throw new Error(data.error || "Crop upload failed");
      }
    } catch (error: any) {
      console.error("Crop error:", error);
      toast({
        title: "Crop failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveCrop = () => {
    if (!uploadedImage) return;

    // Revert to original image
    const updatedImage: UploadedImage = {
      ...uploadedImage,
      croppedUrl: undefined,
      isCropped: false,
      cropData: undefined,
    };

    setUploadedImage(updatedImage);
    setUploadedImagePreview(""); // Will use original URL

    toast({
      title: "Crop removed",
      description: "Your full original image will be used.",
    });
  };

  const handleAddToCart = () => {
    if (!uploadedImageUrl || !uploadedImage) {
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
        title: `Custom Frame - ${frameSize} ${frameStyle}${uploadedImage.isCropped ? ' (Cropped)' : ''}`,
        price: currentPrice,
        imageUrl: uploadedImage.isCropped && uploadedImage.croppedUrl ? uploadedImage.croppedUrl : uploadedImageUrl,
        frame_size: frameSize,
        frame_material: frameStyle,
        isCustom: true,
        customFrame: {
          uploadedImageUrl,
          uploadedImage,
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

  const getFrameRatio = () => {
    const dimensions = getFrameDimensions(frameSize);
    
    // Auto-rotate frame based on image orientation
    if (uploadedImage) {
      if (uploadedImage.orientation === "portrait" && dimensions.width > dimensions.height) {
        // Swap dimensions for portrait images
        return { width: dimensions.height, height: dimensions.width };
      } else if (uploadedImage.orientation === "landscape" && dimensions.height > dimensions.width) {
        // Swap dimensions for landscape images
        return { width: dimensions.height, height: dimensions.width };
      }
    }
    
    return dimensions;
  };

  const frameRatio = getFrameRatio();
  const aspectRatio = calculateAspectRatio(frameRatio);
  const displayImage = uploadedImagePreview || (uploadedImage?.isCropped && uploadedImage.croppedUrl) || uploadedImageUrl;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(0_0_0/0.05)_1px,transparent_0)] [background-size:40px_40px] dark:bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.05)_1px,transparent_0)] pointer-events-none" />
        
        {/* Floating background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] bg-primary/10 dark:bg-primary/20 rounded-full blur-[80px]"
            animate={{
              x: [0, 40, -20, 0],
              y: [0, -40, 20, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-[5%] right-[-10%] w-[300px] h-[300px] bg-secondary/15 dark:bg-secondary/25 rounded-full blur-[70px]"
            animate={{
              x: [0, -30, 40, 0],
              y: [0, 30, -30, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="mb-8 text-center sm:mb-12"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -10 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 px-4 py-2 text-xs font-semibold text-primary shadow-sm sm:mb-6 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                
                
              </motion.div>
            </motion.div>

            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 80,
                    damping: 15
                  }
                }
              }}
              className="mb-3 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-3xl font-bold leading-[1.1] text-transparent dark:from-white dark:via-gray-100 dark:to-gray-300 sm:mb-4 sm:text-5xl lg:mb-6 lg:text-7xl"
            >
              Turn Your Memories Into Beautiful Wall Art
            </motion.h1>

            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
              className="mx-auto max-w-2xl text-sm leading-6 text-gray-600 line-clamp-2 dark:text-gray-400 sm:text-base sm:leading-7 lg:text-lg"
            >
              Upload your image, customize your frame with real-time preview, and we&apos;ll bring it to life with premium quality printing.
            </motion.p>
            
            {/* Guest User Notice */}
            {!isSignedIn && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                }}
                className="mx-auto mt-4 max-w-lg sm:mt-6"
              >
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30 sm:p-4">
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

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Left: Preview Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Live Preview */}
              <div className="relative rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900 sm:p-6 lg:p-8">
                <div className="mb-4 flex items-start justify-between gap-3 sm:mb-6">
                  <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white sm:text-2xl">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                        
                      </div>
                      Live Preview
                    </h2>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                      Real-time {frameSize} frame visualization
                    </p>
                  </div>
                  {uploadedImage && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFullPreview(true)}
                      className="h-11 w-11 gap-1.5 rounded-xl px-0 sm:h-9 sm:w-auto sm:px-3"
                    >
                      <ZoomIn className="h-4 w-4" />
                      <span className="hidden sm:inline">Fullscreen</span>
                    </Button>
                  )}
                </div>
                
                {/* A4 Proportional Container */}
                <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-3 dark:from-gray-800 dark:to-gray-900 sm:p-6 lg:p-8">
                  <motion.div
                    key={frameSize}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative w-full max-w-[280px] sm:max-w-sm lg:max-w-md"
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
                          {displayImage ? (
                            <motion.div
                              key={displayImage}
                              initial={{ opacity: 0, scale: 1.05 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.4 }}
                              className="relative w-full h-full"
                            >
                              <img
                                src={displayImage}
                                alt="Your uploaded image"
                                className="w-full h-full object-contain"
                                style={{ objectFit: 'contain' }}
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
                    className="mt-4 space-y-2"
                  >
                    <div className="rounded-lg bg-gray-50 px-3 py-3 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400 sm:flex sm:items-center sm:justify-between sm:px-4 sm:text-sm">
                      <span className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        {frameSize} • {frameStyle} Frame
                      </span>
                      <span className="mt-2 block text-gray-500 dark:text-gray-500 sm:mt-0">
                        {frameRatio.width} × {frameRatio.height} {frameSize === "A4" ? "mm" : "inches"}
                      </span>
                    </div>

                    {/* Image Info & Crop Status */}
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30">
                      <div className="flex items-start gap-3">
                        <ImageIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 text-sm text-blue-800 dark:text-blue-300">
                          <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <p className="font-semibold">
                              {uploadedImage.isCropped ? 'Cropped Image' : 'Full Image'} • {uploadedImage.orientation}
                            </p>
                            {uploadedImage.isCropped && (
                              <span className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded-full">
                                User Cropped
                              </span>
                            )}
                          </div>
                          <p className="text-xs">
                            {uploadedImage.isCropped 
                              ? "Your cropped image will be fitted perfectly to the frame."
                              : "Your full image will be framed without cropping. Our design team will add mat/padding as needed."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Upload & Crop Buttons */}
                <div className="mt-4 sm:mt-6 space-y-3">
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
                      className="group relative h-12 w-full overflow-hidden rounded-xl text-sm font-medium sm:h-11"
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

                  {/* Crop Button - Optional */}
                  {uploadedImage && (
                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
                      {!uploadedImage.isCropped ? (
                        <Button
                          onClick={handleCropImage}
                          variant="outline"
                          className="h-12 flex-1 rounded-xl font-medium sm:h-10"
                        >
                          <Crop className="mr-2 h-4 w-4" />
                          Crop Image (Optional)
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={handleCropImage}
                            variant="outline"
                            className="h-12 flex-1 rounded-xl font-medium sm:h-10"
                          >
                            <Crop className="mr-2 h-4 w-4" />
                            Re-crop
                          </Button>
                          <Button
                            onClick={handleRemoveCrop}
                            variant="ghost"
                            className="h-12 rounded-xl font-medium sm:h-10"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Remove Crop
                          </Button>
                        </>
                      )}
                    </div>
                  )}

                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 text-center">
                    PNG, JPG, WebP • Max 10MB • {uploadedImage && !uploadedImage.isCropped && "Full image preserved - cropping optional"}
                  </p>
                </div>
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
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6 lg:p-8">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
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
                      whileHover={{ scale: 1.01, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group relative min-h-14 overflow-hidden rounded-xl border-2 p-3 text-left transition-all duration-200 sm:p-4 ${
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
                      <div className="relative flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-sm leading-snug text-gray-900 dark:text-white sm:text-base">{size.label}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                            Perfect for {size.value === "A4" ? "desks/walls" : size.value === "12x18" ? "rooms" : size.value === "18x24" ? "walls" : "large walls"}
                          </p>
                        </div>
                        <div className="ml-2 text-right">
                          <p className="text-lg font-bold text-gray-900 dark:text-white sm:text-2xl">₹{size.price}</p>
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
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6 lg:p-8">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
                  Select Style
                </h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {FRAME_STYLES.map((style, index) => (
                    <motion.button
                      key={style.value}
                      onClick={() => setFrameStyle(style.value)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`group relative overflow-hidden rounded-xl border-2 p-3 transition-all duration-200 sm:p-4 ${
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
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6 lg:p-8">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
                  Special Instructions <span className="text-sm text-gray-600 dark:text-gray-400 font-normal">(Optional)</span>
                </h3>
                <textarea
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Add any special requests or instructions for your frame..."
                  className="h-24 w-full resize-none rounded-xl border-2 border-gray-200 bg-white p-3 text-sm text-gray-900 transition-all placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 sm:h-24 sm:p-4 sm:text-base"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-2">{customerNotes.length}/500 characters</p>
              </div>

              {/* Price Summary & Add to Cart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:text-white sm:p-6"
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
                  className="absolute inset-0 opacity-30 dark:opacity-50"
                />

                <div className="relative z-10">
                  <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50/90 p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="mb-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                          <span className="inline-block h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400" />
                          Price Summary
                        </p>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                          Custom Frame
                        </h3>
                      </div>
                      <div className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-medium text-green-700 dark:bg-green-500/15 dark:text-green-300 sm:text-xs">
                        {uploadedImage ? "Ready to Add" : "Upload an Image"}
                      </div>
                    </div>

                    <div className="mb-4 grid gap-2 text-sm sm:grid-cols-2">
                      <div className="rounded-lg bg-white px-3 py-2 shadow-sm dark:bg-white/5 dark:shadow-none">
                        <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Size</p>
                        <p className="mt-1 font-medium text-gray-900 dark:text-white">{frameSize}</p>
                      </div>
                      <div className="rounded-lg bg-white px-3 py-2 shadow-sm dark:bg-white/5 dark:shadow-none">
                        <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Style</p>
                        <p className="mt-1 font-medium text-gray-900 dark:text-white">{frameStyle}</p>
                      </div>
                    </div>

                    <div className="flex items-end justify-between gap-3 border-t border-gray-200 pt-3 dark:border-white/10">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Total Price</p>
                        <motion.div
                          key={currentPrice}
                          initial={{ scale: 1.08, y: -6 }}
                          animate={{ scale: 1, y: 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                          className="relative"
                        >
                          <motion.div
                            initial={{ opacity: 1, scale: 1.3 }}
                            animate={{ opacity: 0, scale: 1.8 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 bg-blue-500/30 blur-2xl"
                          />
                          <p className="relative z-10 bg-gradient-to-r from-gray-900 via-primary to-blue-600 bg-clip-text text-3xl font-bold text-transparent dark:from-white dark:via-blue-100 dark:to-white sm:text-4xl">
                            ₹{currentPrice}
                          </p>
                        </motion.div>
                      </div>
                      <p className="max-w-[9rem] text-right text-[11px] leading-5 text-gray-500 dark:text-gray-300 sm:max-w-none sm:text-sm">
                        Premium print, frame, and finishing included
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="relative h-[52px] w-full overflow-hidden rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:h-12 sm:text-base"
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
                      className="mt-3 flex items-center justify-center gap-1 text-center text-xs text-gray-500 dark:text-gray-400"
                    >
                      <Upload className="h-3 w-3" />
                      Upload an image to continue
                    </motion.p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
            {FEATURE_ITEMS.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2, scale: 1.01 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`rounded-xl border border-gray-200 bg-gradient-to-br ${feature.gradient} p-4 transition-shadow hover:shadow-md dark:border-gray-700`}
              >
                <div className="relative">
                  <div className={`absolute inset-0 ${feature.iconColor} opacity-20 blur-xl`} />
                  <feature.icon className={`relative mb-2 h-8 w-8 ${feature.iconColor}`} />
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{feature.title}</p>
                <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 backdrop-blur-sm sm:p-4"
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
              className="relative aspect-square w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className="absolute inset-0 p-6 transition-all duration-500 sm:p-10 lg:p-16"
                style={{
                  backgroundColor: frameStyle === "Black" ? "#1a1a1a" : 
                                 frameStyle === "White" ? "#f5f5f5" : 
                                 "#8B4513",
                }}
              >
                <div className="relative w-full h-full bg-white rounded-lg shadow-2xl overflow-hidden">
                  <img
                    src={displayImage}
                    alt="Full preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Occasion Frames Promotion */}
      <OccasionPromo />

      {/* Crop Modal */}
      {uploadedImage && (
        <ImageCropModal
          isOpen={showCropModal}
          onClose={() => setShowCropModal(false)}
          imageSrc={uploadedImage.originalUrl}
          aspectRatio={aspectRatio}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
}
