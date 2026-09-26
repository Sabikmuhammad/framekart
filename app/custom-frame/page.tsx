"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from "framer-motion";
import { Upload, Check, Loader2, ShoppingCart, Info, Package, Truck, Shield, X, ZoomIn, Download, Crop, ImageIcon, ArrowRight, Camera, Sparkles, AlertCircle, Image as ImageIcon2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import { useAuth as useCustomAuth } from "@/context/AuthContext";
import Image from "next/image";
import { ImageCropModal } from "@/components/custom-frames/ImageCropModal";
import { OccasionPromo } from "@/components/custom-frames/OccasionPromo";
import { CustomMarquee } from "@/components/custom-frames/CustomMarquee";
import PremiumVisitorPopup from "@/components/visitor/PremiumVisitorPopup";
import { detectImageOrientation, loadImage, getFrameDimensions, calculateAspectRatio, blobToDataURL } from "@/lib/utils/image-utils";
import { UploadedImage, CropData, type FrameSize, type FrameStyle } from "@/lib/types/custom-frame";

const FRAME_PRICES: Record<FrameSize, number> = {
  A4: 999,
  "12x18": 1499,
  "18x24": 1999,
  "24x36": 2999,
};

const FRAME_SIZES = [
  { value: "A4" as FrameSize, label: "A4", dims: "21 × 29.7 cm", price: 999 },
  { value: "12x18" as FrameSize, label: "A3", dims: "29.7 × 42 cm", price: 1499 },
  { value: "18x24" as FrameSize, label: "A2", dims: "42 × 59.4 cm", price: 1999 },
  { value: "24x36" as FrameSize, label: "A1", dims: "59.4 × 84.1 cm", price: 2999 },
];

const FRAME_STYLES = [
  { value: "Black" as FrameStyle, label: "BLACK", color: "#18181b", texture: "radial-gradient(circle, #27272a 0%, #18181b 100%)" },
  { value: "White" as FrameStyle, label: "WHITE", color: "#fafafa", texture: "radial-gradient(circle, #ffffff 0%, #f4f4f5 100%)" },
  { value: "Wooden" as FrameStyle, label: "WOODEN", color: "#78350f", texture: "linear-gradient(90deg, #78350f 0%, #92400e 50%, #78350f 100%)" },
  { value: "Golden" as FrameStyle, label: "GOLD", color: "#d97706", texture: "linear-gradient(135deg, #fcd34d 0%, #d97706 50%, #f59e0b 100%)" },
];

const FRAME_FINISHES = [
  { value: "Matte", label: "MATTE", desc: "Low reflection" },
  { value: "Satin", label: "SATIN", desc: "Medium reflection" },
  { value: "Gloss", label: "GLOSS", desc: "High reflection" },
];

const FRAME_PROFILES = [
  { value: "Slim", label: "SLIM", thickness: "12px" },
  { value: "Classic", label: "CLASSIC", thickness: "20px" },
  { value: "Deep", label: "DEEP", thickness: "32px" },
];

type FrameFinish = "Matte" | "Satin" | "Gloss";
type FrameProfile = "Slim" | "Classic" | "Deep";

export default function CustomFramePage() {
  // Image upload state
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string>("");
  
  // Frame configuration
  const [frameSize, setFrameSize] = useState<FrameSize>("A4");
  const [frameStyle, setFrameStyle] = useState<FrameStyle>("Black");
  const [frameFinish, setFrameFinish] = useState<FrameFinish>("Matte");
  const [frameProfile, setFrameProfile] = useState<FrameProfile>("Classic");
  const [customerNotes, setCustomerNotes] = useState("");
  
  // UI states
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [showVisitorPopup, setShowVisitorPopup] = useState(false);
  const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cartAnimation, setCartAnimation] = useState(false);
  const [showCompactPreview, setShowCompactPreview] = useState(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const studioRef = useRef<HTMLDivElement>(null);
  
  // 3D Interaction values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-3, 3]);
  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 20 });
  const shadowX = useTransform(mouseX, [-0.5, 0.5], [15, -15]);
  const shadowY = useTransform(mouseY, [-0.5, 0.5], [15, -15]);

  // Hooks
  const { toast } = useToast();
  const { addItem } = useCartStore();
  const router = useRouter();
  const { isAuthenticated: isSignedIn } = useCustomAuth();

  const currentPrice = FRAME_PRICES[frameSize];

  // Derived values
  const getFrameRatio = () => {
    const dimensions = getFrameDimensions(frameSize);
    if (uploadedImage) {
      if (uploadedImage.orientation === "portrait" && dimensions.width > dimensions.height) {
        return { width: dimensions.height, height: dimensions.width };
      } else if (uploadedImage.orientation === "landscape" && dimensions.height > dimensions.width) {
        return { width: dimensions.height, height: dimensions.width };
      }
    }
    return dimensions;
  };

  const frameRatio = getFrameRatio();
  const aspectRatio = calculateAspectRatio(frameRatio);
  const displayImage = uploadedImagePreview || (uploadedImage?.isCropped && uploadedImage.croppedUrl) || uploadedImageUrl;

  const currentStyleConfig = FRAME_STYLES.find(s => s.value === frameStyle) || FRAME_STYLES[0];
  const currentProfileConfig = FRAME_PROFILES.find(p => p.value === frameProfile) || FRAME_PROFILES[1];

  // Scroll listener for compact preview
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 1024) {
        setShowCompactPreview(false);
        return;
      }
      if (window.scrollY > 500) {
        setShowCompactPreview(true);
      } else {
        setShowCompactPreview(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handlers
  const handleVisitorPopupClose = () => {
    setShowVisitorPopup(false);
    setPendingUploadFile(null);
  };

  const executeUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const reader = new FileReader();
      const previewDataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const dimensions = await loadImage(previewDataUrl);
      const orientation = detectImageOrientation(dimensions.width, dimensions.height);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/custom", { method: "POST", body: formData });
      const data = await response.json();

      if (data.success) {
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
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') console.error("Upload error:", error);
      toast({ title: "Upload failed", description: error.message || "Please try again.", variant: "destructive" });
    } finally {
      setIsUploading(false);
      setPendingUploadFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/heic"];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      toast({ title: "Invalid file type", description: "Please upload JPG, PNG, or HEIC images.", variant: "destructive" });
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please upload an image smaller than 15MB.", variant: "destructive" });
      return;
    }

    const isCaptured = localStorage.getItem("fk_visitor_captured") === "true";
    if (!isCaptured && !isSignedIn) {
      setPendingUploadFile(file);
      setShowVisitorPopup(true);
      return;
    }

    executeUpload(file);
  };

  const handleCropComplete = async (croppedBlob: Blob, cropData: CropData) => {
    if (!uploadedImage) return;
    try {
      const croppedDataUrl = await blobToDataURL(croppedBlob);
      const formData = new FormData();
      formData.append("file", croppedBlob, "cropped-image.jpg");

      const response = await fetch("/api/upload/custom", { method: "POST", body: formData });
      const data = await response.json();

      if (data.success) {
        const updatedImage: UploadedImage = {
          ...uploadedImage,
          croppedUrl: data.data.url,
          isCropped: true,
          cropData,
        };
        setUploadedImage(updatedImage);
        setUploadedImagePreview(croppedDataUrl);
        setShowCropModal(false);
      } else {
        throw new Error(data.error || "Crop upload failed");
      }
    } catch (error: any) {
      if (error.message === "Visitor lead capture required" || error.message?.includes("VISITOR_LEAD")) {
        localStorage.removeItem("fk_visitor_captured");
        setShowVisitorPopup(true);
      } else {
        toast({ title: "Crop failed", description: error.message || "Please try again.", variant: "destructive" });
      }
    }
  };

  const createCartItem = () => ({
    _id: `custom-${Date.now()}`,
    title: `Custom Frame - ${frameSize} ${frameStyle}`,
    price: currentPrice,
    imageUrl: uploadedImage?.isCropped && uploadedImage.croppedUrl ? uploadedImage.croppedUrl : uploadedImageUrl,
    frame_size: frameSize,
    frame_material: frameStyle,
    isCustom: true,
    customFrame: {
      uploadedImageUrl,
      uploadedImage: uploadedImage || undefined,
      frameStyle,
      frameSize,
      frameFinish,
      frameProfile,
      customerNotes,
    },
  });

  const handleAddToCart = () => {
    if (!uploadedImageUrl || !uploadedImage) {
      toast({ title: "No image uploaded", description: "Please upload an image first.", variant: "destructive" });
      return;
    }

    setIsAddingToCart(true);
    try {
      addItem(createCartItem());
      setCartAnimation(true);
      setShowSuccess(true);
      toast({ title: "Custom frame added to cart." });
      
      setTimeout(() => setCartAnimation(false), 1000);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      toast({ title: "Error", description: "Failed to add to cart. Please try again.", variant: "destructive" });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!uploadedImageUrl || !uploadedImage) {
      toast({ title: "No image uploaded", description: "Please upload an image first.", variant: "destructive" });
      return;
    }
    try {
      addItem(createCartItem());
      router.push("/checkout");
    } catch (error) {
      toast({ title: "Error", description: "Failed to process order. Please try again.", variant: "destructive" });
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!studioRef.current) return;
    const rect = studioRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] pb-[170px] lg:pb-10 font-sans relative">
      <CustomMarquee className="border-t-0" />
      
      {/* MOBILE COMPACT STICKY PREVIEW */}
      <AnimatePresence>
        {showCompactPreview && displayImage && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-[60px] md:top-[72px] left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm p-3 flex items-center gap-4 lg:hidden"
          >
            <div 
              className="w-12 h-12 rounded bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shadow-inner shrink-0 transition-all duration-300" 
              style={{ padding: currentProfileConfig.thickness === '32px' ? '4px' : '2px', background: currentStyleConfig.texture }}
            >
               <div className="w-full h-full bg-white flex items-center justify-center overflow-hidden relative">
                 <img src={displayImage} className="w-full h-full object-cover" alt="Thumb" />
                 <div className="absolute inset-0 pointer-events-none mix-blend-screen" style={{ background: `linear-gradient(105deg, transparent 20%, rgba(255,255,255,${frameFinish === 'Gloss' ? '0.4' : '0.05'}) 45%, transparent 60%)` }} />
               </div>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
               <span className="text-[10px] font-bold text-gray-400 tracking-wider mb-0.5">LIVE PREVIEW</span>
               <div className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
                  <AnimatePresence mode="popLayout">
                    <motion.span key={frameSize} initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xs font-semibold text-gray-900">{frameSize}</motion.span>
                    <span className="text-gray-300">•</span>
                    <motion.span key={frameStyle} initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xs font-semibold text-gray-900">{frameStyle}</motion.span>
                    <span className="text-gray-300">•</span>
                    <motion.span key={frameFinish} initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xs font-semibold text-gray-900">{frameFinish}</motion.span>
                  </AnimatePresence>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLYING CART ANIMATION */}
      <AnimatePresence>
        {cartAnimation && (
          <motion.div
            initial={{ opacity: 1, scale: 1, x: "-50%", y: "-50%", top: "50%", left: "50%" }}
            animate={{ opacity: 0, scale: 0.2, top: "20px", left: "90%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed z-50 pointer-events-none w-16 h-16 rounded-md shadow-2xl border-4"
            style={{ background: currentStyleConfig.texture, padding: '2px' }}
          >
            <div className="w-full h-full bg-white overflow-hidden">
               <img src={displayImage} className="w-full h-full object-cover" alt="Flying thumb" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <motion.section 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
        className="pt-8 pb-6 px-4 max-w-7xl mx-auto flex flex-col items-center text-center lg:pt-16 lg:pb-12"
      >
        <motion.h1 
          initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, type: "spring" }}
          className="text-[28px] sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#111827] max-w-2xl mb-2"
        >
          Turn Your Memories Into Beautiful Wall Art.
        </motion.h1>
        <motion.p 
          initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, type: "spring" }}
          className="text-sm sm:text-base text-[#64748B]"
        >
          Create a frame made uniquely for you.
        </motion.p>
      </motion.section>

      {/* FRAME STUDIO */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mb-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          
          {/* LEFT: LIVE PREVIEW & UPLOAD (Sticky on Desktop) */}
          <div className="w-full lg:w-[55%] lg:sticky lg:top-24 flex flex-col gap-4">
            
            {/* Live 3D Preview */}
            <div 
              ref={studioRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-white rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center p-6 sm:p-16 shadow-sm group"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_0%,rgba(240,240,240,1)_100%)] pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {displayImage ? (
                  <motion.div
                    key="frame-preview"
                    style={{ rotateX: springRotateX, rotateY: springRotateY, aspectRatio: `${frameRatio.width} / ${frameRatio.height}` }}
                    className="relative w-full max-h-full max-w-[85%] perspective-[1200px]"
                    initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  >
                    <motion.div 
                      className="absolute -inset-4 bg-black/10 blur-xl rounded-sm -z-10"
                      style={{ x: shadowX, y: shadowY }}
                    />
                    
                    <motion.div 
                      className="absolute inset-0 rounded-[2px] transition-all duration-500 ease-out"
                      style={{
                        padding: currentProfileConfig.thickness,
                        background: currentStyleConfig.texture,
                        boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 15px rgba(0,0,0,0.5), 0 10px 30px -10px rgba(0,0,0,0.3)`
                      }}
                    >
                      <div className="absolute inset-0 rounded-[2px] pointer-events-none shadow-[inset_0_0_4px_rgba(0,0,0,0.8)]" />
                      
                      <div className="relative w-full h-full bg-[#fdfdfd] shadow-[inset_0_2px_15px_rgba(0,0,0,0.15)] overflow-hidden rounded-sm flex items-center justify-center">
                        <div className="relative w-[85%] h-[85%] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] overflow-hidden">
                          <img src={displayImage} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <div 
                          className="absolute inset-0 pointer-events-none mix-blend-screen transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(105deg, transparent 20%, rgba(255,255,255,${frameFinish === 'Gloss' ? '0.4' : frameFinish === 'Satin' ? '0.15' : '0.03'}) 45%, transparent 60%)`,
                          }}
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty-state"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center z-10 w-full h-full"
                  >
                    <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center text-center cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
                      <ImageIcon2 className="w-16 h-16 text-gray-400 mb-4 stroke-1" />
                      <p className="text-sm font-medium text-gray-500">Preview will appear here</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/heic" onChange={handleFileSelect} className="hidden" />
            </div>

            {/* UPLOAD CONTROLS */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900 tracking-wide mb-1">UPLOAD YOUR PHOTO</span>
                <span className="text-[11px] text-gray-500">{uploadedImage ? "Photo uploaded" : "Choose a photo from your device"}</span>
              </div>
              <div className="flex items-center gap-2">
                {uploadedImage && (
                  <Button variant="outline" size="sm" onClick={() => setShowCropModal(true)} className="h-9 rounded-lg text-xs font-medium text-blue-600 border-blue-200 hover:bg-blue-50">
                    Edit Photo
                  </Button>
                )}
                <Button 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={isUploading}
                  className={`h-9 rounded-lg text-xs font-medium ${uploadedImage ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
                  {uploadedImage ? "Change" : "Upload Photo"}
                </Button>
              </div>
            </div>

          </div>

          {/* RIGHT: CUSTOMIZATION PANEL (45%) */}
          <div className="w-full lg:w-[45%] flex flex-col gap-10">
            
            {/* 01. SIZE */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 tracking-widest">01</span>
                <h3 className="text-base font-semibold text-[#111827]">CHOOSE YOUR SIZE</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {FRAME_SIZES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setFrameSize(s.value)}
                    className={`flex flex-col items-start p-3 rounded-xl border transition-all duration-300 relative h-[78px] justify-center ${
                      frameSize === s.value 
                      ? "border-blue-500 bg-[#F8FBFF] shadow-[0_0_0_1px_rgba(59,130,246,1)]" 
                      : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex w-full justify-between items-start">
                      <span className="font-semibold text-[13px] text-[#111827]">{s.label}</span>
                      {frameSize === s.value && <Check className="w-4 h-4 text-blue-500 absolute top-2 right-2" />}
                    </div>
                    <span className="text-[10px] text-[#64748B]">{s.dims}</span>
                    <span className="font-semibold text-[13px] text-[#111827] mt-0.5">₹{s.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 02. FRAME */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 tracking-widest">02</span>
                <h3 className="text-base font-semibold text-[#111827]">CHOOSE YOUR FRAME</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {FRAME_STYLES.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setFrameStyle(style.value)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between h-[110px] transition-all duration-300 ${
                      frameStyle === style.value 
                      ? "border-blue-500 bg-blue-50/50 shadow-[0_0_0_1px_rgba(59,130,246,1)]" 
                      : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="w-full h-8 rounded shadow-inner border border-black/10" style={{ background: style.texture }} />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs tracking-wide text-[#111827]">{style.label}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${frameStyle === style.value ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                         {frameStyle === style.value && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 03. FINISH */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 tracking-widest">03</span>
                <h3 className="text-base font-semibold text-[#111827]">CHOOSE FINISH</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {FRAME_FINISHES.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFrameFinish(f.value as FrameFinish)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center h-[70px] transition-all ${
                      frameFinish === f.value 
                      ? "border-blue-500 bg-blue-50/50 text-blue-700" 
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span className="font-semibold text-xs tracking-wide">{f.label}</span>
                    <span className="text-[9px] text-gray-500 mt-0.5 whitespace-nowrap">{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 04. PROFILE */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 tracking-widest">04</span>
                <h3 className="text-base font-semibold text-[#111827]">CHOOSE PROFILE</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {FRAME_PROFILES.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setFrameProfile(p.value as FrameProfile)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center h-[70px] transition-all ${
                      frameProfile === p.value 
                      ? "border-blue-500 bg-blue-50/50 text-blue-700" 
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span className="font-semibold text-xs tracking-wide">{p.label}</span>
                    <div className="w-full flex items-center justify-center mt-1.5 h-1.5 opacity-60">
                       <div className="bg-current rounded-full" style={{ width: p.thickness, height: '100%' }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* SPECIAL INSTRUCTIONS */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#111827] uppercase tracking-wide">SPECIAL INSTRUCTIONS</h3>
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Any special requests for your frame? (Optional)"
                className="w-full h-24 p-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-all resize-none shadow-sm"
                maxLength={200}
              />
            </div>

            {/* ORDER SUMMARY (Desktop specific, mobile relies on sticky bar) */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-4">
              <h4 className="text-xs font-bold text-gray-900 tracking-wider mb-4 border-b border-gray-100 pb-3">YOUR CUSTOM FRAME</h4>
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between items-center"><span className="text-xs">Photo</span> <span className="font-medium text-gray-900 flex items-center gap-1">{uploadedImage ? <><Check className="w-3 h-3 text-green-500" /> Uploaded</> : "Not uploaded"}</span></div>
                <div className="flex justify-between items-center"><span className="text-xs">Size</span> <span className="font-medium text-gray-900">{frameSize}</span></div>
                <div className="flex justify-between items-center"><span className="text-xs">Frame</span> <span className="font-medium text-gray-900">{frameStyle}</span></div>
                <div className="flex justify-between items-center"><span className="text-xs">Finish</span> <span className="font-medium text-gray-900">{frameFinish}</span></div>
                <div className="flex justify-between items-center"><span className="text-xs">Profile</span> <span className="font-medium text-gray-900">{frameProfile}</span></div>
              </div>
              <div className="h-px w-full bg-gray-100 mb-4" />
              <div className="flex justify-between items-end mb-6">
                <span className="text-xs font-bold text-gray-900 tracking-widest">TOTAL</span>
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-bold text-gray-900 leading-none">₹{currentPrice}</span>
                </div>
              </div>

              {/* Desktop CTA */}
              <div className="hidden lg:flex gap-3">
                <Button 
                  onClick={handleAddToCart}
                  disabled={!uploadedImage || isAddingToCart || showSuccess}
                  variant="outline"
                  className={`flex-1 h-12 rounded-xl font-medium text-sm transition-all ${showSuccess ? 'text-green-600 border-green-200 bg-green-50' : 'text-blue-600 border-blue-200 hover:bg-blue-50'}`}
                >
                  {showSuccess ? <Check className="w-4 h-4 mr-2" /> : "Add to Cart"}
                </Button>
                <Button 
                  onClick={handleBuyNow}
                  disabled={!uploadedImage || isAddingToCart || showSuccess}
                  className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-md"
                >
                  Buy Now
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SPECIAL OCCASIONS */}
      <section className="pb-16 bg-[#FAFAFA] pt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Frames For Life&apos;s Special Moments</h2>
            <p className="text-sm text-gray-500">Preserve the memories that deserve a place on your wall.</p>
          </div>
          <OccasionPromo />
        </div>
      </section>

      {/* MOBILE STICKY PURCHASE BAR */}
      <div 
        className="lg:hidden fixed left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-gray-200 px-4 pt-3 pb-3 z-[10000] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]" 
        style={{ bottom: 'calc(64px + env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="flex flex-col shrink-0">
            <span className="text-[10px] text-gray-500 font-bold tracking-widest mb-0.5">TOTAL</span>
            <span className="text-lg font-bold text-gray-900 leading-none">₹{currentPrice}</span>
          </div>
          
          <div className="flex gap-2 flex-1 ml-2">
            {!uploadedImage ? (
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-[44px] min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-[13px] shadow-[0_4px_14px_rgba(59,130,246,0.25)] transition-transform active:scale-95"
              >
                Upload Photo
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || showSuccess}
                  className="flex-1 h-[44px] min-h-[44px] rounded-xl text-blue-600 border-blue-200 hover:bg-blue-50 font-medium text-[13px] px-1 transition-colors bg-white shadow-sm"
                >
                  {showSuccess ? <Check className="w-4 h-4 mx-auto text-green-500" /> : "Add to Cart"}
                </Button>
                <Button 
                  onClick={handleBuyNow}
                  disabled={isAddingToCart || showSuccess}
                  className="flex-1 h-[44px] min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-[13px] px-1 shadow-[0_4px_14px_rgba(59,130,246,0.25)] transition-transform active:scale-95"
                >
                  Buy Now
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {showFullPreview && uploadedImage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-lg"
          >
            <button onClick={() => setShowFullPreview(false)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="relative w-full max-w-5xl h-[85vh] flex items-center justify-center"
            >
              <img src={displayImage} alt="Full Preview" className="max-w-full max-h-full object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {uploadedImage && (
        <ImageCropModal
          isOpen={showCropModal}
          onClose={() => setShowCropModal(false)}
          imageSrc={uploadedImage.originalUrl}
          aspectRatio={aspectRatio}
          onCropComplete={handleCropComplete}
        />
      )}

      <PremiumVisitorPopup
        isOpen={showVisitorPopup}
        onClose={handleVisitorPopupClose}
        onSuccess={() => {
          setShowVisitorPopup(false);
          localStorage.setItem("fk_visitor_captured", "true");
          if (pendingUploadFile) executeUpload(pendingUploadFile);
        }}
        title="Save Your Custom Frame"
        subtitle="Enter your details so we can save your design."
        eyebrow=""
        sourceOverride="custom_frame"
        triggerOverride="photo_upload"
      />
    </div>
  );
}
