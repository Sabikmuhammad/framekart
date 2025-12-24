"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Loader2, ShoppingCart, Info, Cake, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

const BIRTHDAY_TEMPLATE = "/images/templates/birthday-template.jpg"; // Fixed template
const FIXED_PRICE = 999; // A4 size price

type FrameStyle = "Black" | "White" | "Wooden";

const FRAME_STYLES = [
  { value: "Black" as FrameStyle, label: "Black", color: "#000000", description: "Modern & Elegant" },
  { value: "White" as FrameStyle, label: "White", color: "#FFFFFF", description: "Clean & Minimal" },
  { value: "Wooden" as FrameStyle, label: "Wooden", color: "#8B4513", description: "Classic & Warm" },
];

export default function BirthdayFramePage() {
  const [uploadedPhoto, setUploadedPhoto] = useState<string>("");
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string>("");
  const [frameStyle, setFrameStyle] = useState<FrameStyle>("Black");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { addItem } = useCartStore();
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSignedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload your photo.",
      });
      router.push("/sign-in?redirect=/frames/birthday");
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
        setUploadedPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadedPhotoUrl(data.data.url);
        toast({
          title: "Photo uploaded successfully!",
          description: "Your photo has been saved.",
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

  const handleAddToCart = () => {
    // Validate required fields
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

    setIsAddingToCart(true);

    try {
      const templateItem = {
        _id: `template-birthday-${Date.now()}`,
        title: `Birthday Frame - A4 ${frameStyle}`,
        price: FIXED_PRICE,
        imageUrl: BIRTHDAY_TEMPLATE,
        frame_size: "A4",
        frame_material: frameStyle,
        isTemplate: true,
        templateFrame: {
          occasion: "birthday" as const,
          templateImage: BIRTHDAY_TEMPLATE,
          uploadedPhoto: uploadedPhotoUrl || undefined,
          frameSize: "A4" as const,
          frameStyle: frameStyle,
          metadata: {
            name: name.trim(),
            age: age.trim(),
            date: date.trim(),
            message: message.trim() || undefined,
          },
        },
      };

      addItem(templateItem);

      toast({
        title: "Added to cart!",
        description: "Your birthday frame has been added to the cart.",
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
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
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 border border-primary/20 shadow-sm"
          >
            <Cake className="h-4 w-4 text-primary animate-pulse" />
            Template-Based Design
          </motion.div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Birthday Frames
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-6">
            Celebrate special birthdays with a professionally designed frame. Our design team will create a beautiful personalized frame for you.
          </p>
          
          {/* Important Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto max-w-3xl"
          >
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700 dark:text-gray-300 text-left">
                  <p className="font-semibold mb-1">This is a sample template</p>
                  <p>Our design team will professionally prepare your frame after order placement, incorporating your details and photo beautifully.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left: Template Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800 sticky top-8">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                  <Cake className="h-6 w-6 text-primary" />
                  Template Preview
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sample design - Final design will be customized</p>
              </div>
              
              <div className="relative aspect-[210/297] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={BIRTHDAY_TEMPLATE}
                  alt="Birthday Frame Template"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Frame Size:</span> A4 (Fixed) • <span className="font-semibold">Price:</span> ₹{FIXED_PRICE}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Upload Photo (Optional) */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Upload Photo</h3>
                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-400">Optional</span>
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
                variant={uploadedPhoto ? "outline" : "default"}
              >
                {isUploading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Upload className="h-5 w-5 mr-2" />}
                {uploadedPhoto ? "Change Photo" : "Upload Photo"}
              </Button>
              {uploadedPhoto && (
                <div className="mt-3 relative aspect-video rounded-lg overflow-hidden">
                  <Image src={uploadedPhoto} alt="Uploaded" fill className="object-cover" />
                </div>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                Photo upload is optional. You can also share images later via WhatsApp or Email.
              </p>
            </div>

            {/* Frame Style */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Frame Style</h3>
              <div className="grid grid-cols-3 gap-3">
                {FRAME_STYLES.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setFrameStyle(style.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      frameStyle === style.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary/30"
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-2 border-2"
                      style={{ backgroundColor: style.color }}
                    />
                    <div className="text-sm font-semibold">{style.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Birthday Details */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Birthday Details</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Birthday person's name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">Birthday Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Special Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Add a special birthday message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
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
              Add to Cart - ₹{FIXED_PRICE}
            </Button>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Design will be handled by FrameKart&apos;s design team after order placement
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
