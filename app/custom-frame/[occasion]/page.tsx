"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Loader2, ShoppingCart, Info, Cake, Heart, ArrowLeft, AlertCircle, Crop, Check, Image as ImageIcon2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useCartStore } from "@/store/cart";
import { useFlyCartStore } from "@/store/fly-cart";
import { useRouter } from "next/navigation";
import { useAuth as useCustomAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { OccasionPromo } from "@/components/custom-frames/OccasionPromo";
import { CustomMarquee } from "@/components/custom-frames/CustomMarquee";
import { ImageCropModal } from "@/components/custom-frames/ImageCropModal";
import { detectImageOrientation, loadImage, blobToDataURL } from "@/lib/utils/image-utils";
import type { UploadedImage, CropData } from "@/lib/types/custom-frame";

const BIRTHDAY_TEMPLATE = "/images/templates/birthday-template.jpg";
const WEDDING_TEMPLATE = "/images/templates/wedding-template.jpeg";
const FIXED_PRICE = 999; // A4 size price

type FrameStyle = "Black" | "White" | "Wooden"| "Golden";
type OccasionType = "birthday" | "wedding";

const FRAME_STYLES = [
  { value: "Black" as FrameStyle, label: "Black", color: "#000000", description: "Modern & Elegant" },
  { value: "White" as FrameStyle, label: "White", color: "#FFFFFF", description: "Clean & Minimal" },
  { value: "Wooden" as FrameStyle, label: "Wooden", color: "#8B4513", description: "Classic & Warm" },
  { value: "Golden" as FrameStyle, label: "Golden", color: "#D4AF37", description: "Luxury & Bold" },
];

interface PageProps {
  params: {
    occasion: string;
  };
}

export default function OccasionFramePage({ params }: PageProps) {
  const occasion = params.occasion as OccasionType;
  const router = useRouter();
  
  // Validate occasion type
  useEffect(() => {
    if (!["birthday", "wedding", "NikahCertificate"].includes(occasion)) {
      router.push("/custom-frame");
    }
  }, [occasion, router]);

  const isBirthday = occasion === "birthday";
  const templateImage = isBirthday ? BIRTHDAY_TEMPLATE : WEDDING_TEMPLATE;
  const Icon = isBirthday ? Cake : Heart;
  const title = isBirthday ? "Birthday Frames" : "Wedding Frames";
  const description = isBirthday 
    ? "Celebrate special birthdays with a professionally designed frame. Our design team will create a beautiful personalized frame for you."
    : "Celebrate your special day with a beautifully designed wedding frame. Our design team will create a romantic personalized frame for you.";

  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string>("");
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string>("");
  const [frameStyle, setFrameStyle] = useState<FrameStyle>(isBirthday ? "Black" : "White");
  const [showCropModal, setShowCropModal] = useState(false);
  
  // Birthday fields
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  
  // Wedding fields
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [quote, setQuote] = useState("");
  
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { addItem } = useCartStore();
  const addFlyItem = useFlyCartStore((state) => state.addFlyItem);
  const { isAuthenticated: isSignedIn } = useCustomAuth();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSignedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload your photo.",
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

      const response = await fetch("/api/upload", {
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
        setUploadedPhoto(previewDataUrl);
        setUploadedPhotoUrl(data.data.url);
        
        toast({
          title: "Photo uploaded successfully!",
          description: "Your full image will be used. You can optionally crop it.",
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
      setUploadedPhoto("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCropImage = () => {
    if (!uploadedImage) return;
    console.log('Opening crop modal with image data:', {
      width: uploadedImage.width,
      height: uploadedImage.height,
      aspectRatio: uploadedImage.width / uploadedImage.height,
      orientation: uploadedImage.orientation
    });
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

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Update image data with cropped version
        setUploadedImage({
          ...uploadedImage,
          croppedUrl: data.data.url,
          isCropped: true,
          cropData,
        });
        setUploadedPhoto(croppedDataUrl);
        setUploadedPhotoUrl(data.data.url);
        setShowCropModal(false);

        toast({
          title: "Image cropped successfully!",
          description: "Your cropped image has been saved.",
        });
      } else {
        throw new Error(data.error || "Failed to upload cropped image");
      }
    } catch (error: any) {
      toast({
        title: "Crop failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = () => {
    // Validate required fields based on occasion
    if (isBirthday) {
      if (!name.trim()) {
        toast({
          title: "Name required",
          description: "Please enter the birthday person's name.",
          variant: "destructive",
        });
        return;
      }
      if (!age.trim()) {
        toast({
          title: "Age required",
          description: "Please enter the age.",
          variant: "destructive",
        });
        return;
      }
      if (!date.trim()) {
        toast({
          title: "Date required",
          description: "Please enter the birthday date.",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!brideName.trim()) {
        toast({
          title: "Bride name required",
          description: "Please enter the bride's name.",
          variant: "destructive",
        });
        return;
      }
      if (!groomName.trim()) {
        toast({
          title: "Groom name required",
          description: "Please enter the groom's name.",
          variant: "destructive",
        });
        return;
      }
      if (!weddingDate.trim()) {
        toast({
          title: "Wedding date required",
          description: "Please enter the wedding date.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsAddingToCart(true);

    try {
      const templateItem = {
        _id: `template-${occasion}-${Date.now()}`,
        title: `${isBirthday ? 'Birthday' : 'Wedding'} Frame - A4 ${frameStyle}`,
        price: FIXED_PRICE,
        imageUrl: templateImage,
        frame_size: "A4",
        frame_material: frameStyle,
        isTemplate: true,
        templateFrame: {
          occasion: occasion,
          templateImage: templateImage,
          uploadedPhoto: uploadedPhotoUrl || undefined,
          frameSize: "A4" as const,
          frameStyle: frameStyle,
          metadata: isBirthday ? {
            name: name.trim(),
            age: age.trim(),
            date: date.trim(),
            message: message.trim() || undefined,
          } : {
            brideName: brideName.trim(),
            groomName: groomName.trim(),
            weddingDate: weddingDate.trim(),
            quote: quote.trim() || undefined,
          },
        },
      };

      addItem(templateItem);

      const imageEl = document.querySelector('[data-product-image="occasion"]') as HTMLElement;
      if (imageEl && templateImage) {
        addFlyItem(templateImage, imageEl.getBoundingClientRect());
      }

      toast({
        title: "Added to cart!",
        description: `Your ${occasion} frame has been added to the cart.`,
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

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] pb-[170px] lg:pb-10 font-sans relative">
      <CustomMarquee className="border-t-0" />
      
      {/* HERO SECTION */}
      <motion.section 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
        className="pt-8 pb-6 px-4 max-w-7xl mx-auto flex flex-col items-center text-center lg:pt-16 lg:pb-12"
      >
        <motion.h1 
          initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, type: "spring" }}
          className="text-[28px] sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#111827] max-w-2xl mb-2"
        >
          {title}
        </motion.h1>
        <motion.p 
          initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, type: "spring" }}
          className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto"
        >
          {description}
        </motion.p>
      </motion.section>

      {/* FRAME STUDIO */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mb-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          
          {/* LEFT: LIVE PREVIEW & UPLOAD (Sticky on Desktop) */}
          <div className="w-full lg:w-[55%] lg:sticky lg:top-24 flex flex-col gap-4">
            
            {/* Live Preview */}
            <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-white rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center p-6 sm:p-16 shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_0%,rgba(240,240,240,1)_100%)] pointer-events-none" />
              
              <div className="relative aspect-[210/297] w-full max-w-xs shadow-2xl overflow-hidden rounded-md" data-product-image="occasion">
                <Image
                  src={templateImage}
                  alt={`${title} Template`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* UPLOAD CONTROLS */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900 tracking-wide mb-1">UPLOAD PHOTO (OPTIONAL)</span>
                <span className="text-[11px] text-gray-500">{uploadedPhoto ? "Photo uploaded" : "Choose a photo for your frame"}</span>
              </div>
              <div className="flex items-center gap-2">
                {uploadedPhoto && (
                  <Button variant="outline" size="sm" onClick={handleCropImage} className="h-9 rounded-lg text-xs font-medium text-[#3B82F6] border-[#3B82F6]/30 hover:bg-blue-50">
                    Edit Photo
                  </Button>
                )}
                <Button 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={isUploading}
                  className={`h-9 rounded-lg text-xs font-medium ${uploadedPhoto ? 'bg-blue-50 text-[#3B82F6] hover:bg-blue-100' : 'bg-[#3B82F6] text-white hover:bg-[#2563EB]'}`}
                >
                  {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
                  {uploadedPhoto ? "Change" : "Upload Photo"}
                </Button>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleFileSelect} className="hidden" />
          </div>

          {/* RIGHT: CONFIGURATION */}
          <div className="w-full lg:w-[45%] flex flex-col gap-10">
            
            {/* 01. SIZE */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 tracking-widest">01</span>
                <h3 className="text-base font-semibold text-[#111827]">CHOOSE YOUR SIZE</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                 <button
                    className="flex flex-col items-start p-3 rounded-xl border border-blue-500 bg-[#F8FBFF] shadow-[0_0_0_1px_rgba(59,130,246,1)] h-[78px] justify-center text-left"
                  >
                    <div className="flex w-full justify-between items-start">
                      <span className="font-semibold text-[13px] text-[#111827]">A4</span>
                      <Check className="w-4 h-4 text-blue-500 absolute top-2 right-2" />
                    </div>
                    <span className="text-[10px] text-[#64748B]">21 × 29.7 cm</span>
                    <span className="font-semibold text-[13px] text-[#111827] mt-0.5">₹999</span>
                  </button>
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
                    className={`p-3 rounded-xl border text-left flex flex-col h-[100px] transition-all duration-300 ${
                      frameStyle === style.value 
                      ? "border-blue-500 bg-blue-50/50 shadow-[0_0_0_1px_rgba(59,130,246,1)]" 
                      : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="w-full h-8 rounded shadow-inner border border-black/10 mb-auto" style={{ backgroundColor: style.color }} />
                    <div className="flex items-center justify-between w-full mt-2">
                      <span className="font-semibold text-xs tracking-wide text-[#111827]">{style.label}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${frameStyle === style.value ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                         {frameStyle === style.value && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 03. OCCASION DETAILS */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 tracking-widest">03</span>
                <h3 className="text-base font-semibold text-[#111827] uppercase">
                  {isBirthday ? "BIRTHDAY DETAILS" : "WEDDING DETAILS"}
                </h3>
              </div>
              
              <div className="space-y-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                {isBirthday ? (
                  <>
                    <div>
                      <Label htmlFor="name" className="text-xs font-semibold text-gray-700">Name *</Label>
                      <Input
                        id="name"
                        placeholder="Birthday person's name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1.5 h-10 bg-gray-50/50"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="age" className="text-xs font-semibold text-gray-700">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="mt-1.5 h-10 bg-gray-50/50"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="date" className="text-xs font-semibold text-gray-700">Birthday Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-1.5 h-10 bg-gray-50/50"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-xs font-semibold text-gray-700">Special Message (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Add a special birthday message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="mt-1.5 resize-none bg-gray-50/50"
                        rows={3}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="brideName" className="text-xs font-semibold text-gray-700">Bride&apos;s Name *</Label>
                      <Input
                        id="brideName"
                        placeholder="Bride's name"
                        value={brideName}
                        onChange={(e) => setBrideName(e.target.value)}
                        className="mt-1.5 h-10 bg-gray-50/50"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="groomName" className="text-xs font-semibold text-gray-700">Groom&apos;s Name *</Label>
                      <Input
                        id="groomName"
                        placeholder="Groom's name"
                        value={groomName}
                        onChange={(e) => setGroomName(e.target.value)}
                        className="mt-1.5 h-10 bg-gray-50/50"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="weddingDate" className="text-xs font-semibold text-gray-700">Wedding Date *</Label>
                      <Input
                        id="weddingDate"
                        type="date"
                        value={weddingDate}
                        onChange={(e) => setWeddingDate(e.target.value)}
                        className="mt-1.5 h-10 bg-gray-50/50"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="quote" className="text-xs font-semibold text-gray-700">Special Quote (Optional)</Label>
                      <Textarea
                        id="quote"
                        placeholder="Add a romantic quote or message..."
                        value={quote}
                        onChange={(e) => setQuote(e.target.value)}
                        className="mt-1.5 resize-none bg-gray-50/50"
                        rows={3}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ORDER SUMMARY (Desktop specific) */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-4">
              <h4 className="text-xs font-bold text-gray-900 tracking-wider mb-4 border-b border-gray-100 pb-3">YOUR CUSTOM FRAME</h4>
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between items-center"><span className="text-xs">Photo</span> <span className="font-medium text-gray-900 flex items-center gap-1">{uploadedPhoto ? <><Check className="w-3 h-3 text-green-500" /> Uploaded</> : "Not uploaded"}</span></div>
                <div className="flex justify-between items-center"><span className="text-xs">Size</span> <span className="font-medium text-gray-900">A4</span></div>
                <div className="flex justify-between items-center"><span className="text-xs">Frame</span> <span className="font-medium text-gray-900">{frameStyle}</span></div>
              </div>
              <div className="h-px w-full bg-gray-100 mb-4" />
              <div className="flex justify-between items-end mb-6">
                <span className="text-xs font-bold text-gray-900 tracking-widest">TOTAL</span>
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-bold text-gray-900 leading-none">₹{FIXED_PRICE}</span>
                </div>
              </div>

              {/* Desktop CTA */}
              <div className="hidden lg:flex gap-3">
                <Button 
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="w-full h-12 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium text-sm shadow-md"
                >
                  {isAddingToCart ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Add to Cart"}
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
          <OccasionPromo exclude={occasion} />
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
            <span className="text-lg font-bold text-gray-900 leading-none">₹{FIXED_PRICE}</span>
          </div>
          
          <div className="flex gap-2 flex-1 ml-2">
            <Button 
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full h-[44px] min-h-[44px] rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium text-[13px] shadow-[0_4px_14px_rgba(59,130,246,0.25)] transition-transform active:scale-95"
            >
              {isAddingToCart ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>

      {/* Crop Modal */}
      {uploadedImage && uploadedImage.width && uploadedImage.height && (
        <ImageCropModal
          isOpen={showCropModal}
          onClose={() => setShowCropModal(false)}
          imageSrc={uploadedImage.originalUrl}
          aspectRatio={210 / 297}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
