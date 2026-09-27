"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { 
  ShoppingCart, Heart, Star, Shield, Package, Truck, 
  Award, Check, ChevronDown, ChevronUp, ImageIcon, ArrowRight
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useFlyCartStore } from "@/store/fly-cart";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function FrameDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  
  const [frame, setFrame] = useState<any>(null);
  const [similarFrames, setSimilarFrames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState({
    eligible: true,
    discountValue: 15,
    offerActive: true,
  });
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  const addFlyItem = useFlyCartStore((state) => state.addFlyItem);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetch(`/api/frames/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setFrame(data.data);
            if (data.data.category) {
              fetch(`/api/frames?category=${data.data.category}&limit=4`)
                .then((res) => res.json())
                .then((similarData) => {
                  if (similarData.success) {
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

    fetch("/api/offers/eligibility")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEligibility({
            eligible: data.eligible ?? true,
            discountValue: data.discountValue ?? 15,
            offerActive: data.offerActive ?? true,
          });
        }
      })
      .catch((error) => console.error("Error fetching eligibility:", error));
  }, [slug]);

  const hasDiscount = eligibility.offerActive && eligibility.eligible && eligibility.discountValue > 0;
  const discountedPrice = frame ? (hasDiscount ? frame.price - Math.round((frame.price * eligibility.discountValue) / 100) : frame.price) : 0;
  const savings = frame ? frame.price - discountedPrice : 0;

  const handleAddToCart = () => {
    if (frame && frame.stock > 0) {
      addItem({
        _id: frame._id,
        title: frame.title,
        price: discountedPrice,
        imageUrl: frame.imageUrl,
        frame_size: frame.frame_size,
        frame_material: frame.frame_material,
        isCustom: false
      });
      
      const imageEl = document.querySelector('[data-product-image="main"]') as HTMLElement;
      if (imageEl) {
        addFlyItem(frame.imageUrl, imageEl.getBoundingClientRect());
      }
      
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
      
      toast({
        title: "Added to cart",
        description: `${frame.title} has been added to your cart.`,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full aspect-[1/1] bg-[#F8FAFC] animate-pulse md:hidden rounded-b-[32px]" />
        <div className="max-w-[1280px] mx-auto px-4 py-8 grid md:grid-cols-2 gap-10">
          <div className="hidden md:block aspect-[1/1] bg-[#F8FAFC] animate-pulse rounded-[24px]" />
          <div className="space-y-6">
            <div className="h-10 bg-[#F1F5F9] rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-[#F1F5F9] rounded w-1/4 animate-pulse" />
            <div className="h-24 bg-[#F1F5F9] rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!frame) return <div className="min-h-screen flex items-center justify-center bg-white"><p className="text-[#64748B]">Frame not found</p></div>;

  return (
    <div 
      className="min-h-screen bg-[#FFFFFF] font-sans text-[#111827] md:pb-12"
      style={{ paddingBottom: 'calc(130px + env(safe-area-inset-bottom))' }}
    >
      
      {/* Mobile Sticky Purchase Bar (Sits exactly above the mobile bottom nav) */}
      <div 
        className="md:hidden fixed left-0 right-0 z-40 bg-[rgba(255,255,255,0.94)] backdrop-blur-[18px] border-t border-[#E5E7EB] shadow-[0_-8px_30px_rgba(15,23,42,0.06)] px-4 py-3 flex items-center justify-between"
        style={{ bottom: 'calc(62px + env(safe-area-inset-bottom))' }}
      >
        <div className="flex flex-col justify-center w-[40%]">
          <span className="text-[18px] font-[600] text-[#111827] leading-tight">
            {formatPrice(discountedPrice).replace(".00", "")}
          </span>
          {hasDiscount && <span className="text-[12px] text-[#16A34A] font-[500] leading-tight mt-0.5">Save {formatPrice(savings).replace(".00", "")}</span>}
        </div>
        <div className="w-[55%] flex justify-end">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            disabled={frame.stock === 0}
            className={`w-full max-w-[180px] h-[46px] rounded-[12px] font-[600] text-[14px] flex items-center justify-center gap-2 ${
              isAdded ? "bg-[#10B981] text-white" : 
              frame.stock === 0 ? "bg-[#E2E8F0] text-[#94A3B8]" : 
              "bg-[#3B82F6] text-white"
            }`}
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.div key="added" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4" /> Added
                </motion.div>
              ) : (
                <motion.div key="add" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-1.5">
                  {frame.stock > 0 ? (
                    <>Add to Cart <ArrowRight className="h-4 w-4" /></>
                  ) : "Out of Stock"}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto md:px-6 lg:px-8 md:py-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          
          {/* Left Column: Image Area */}
          <div className="w-full md:w-1/2 md:sticky md:top-[100px] self-start">
            <div className="relative w-full aspect-[1/1] md:aspect-[4/5] lg:aspect-[1/1] md:rounded-[24px] bg-[#F8FAFC] overflow-hidden md:shadow-[0_8px_30px_rgba(15,23,42,0.04)] rounded-b-[32px]">
              
              {/* Wishlist Button */}
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 z-10 w-[44px] h-[44px] bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center justify-center outline-none transition-transform active:scale-90"
              >
                <motion.div animate={isWishlisted ? { scale: [1, 1.2, 1] } : {}}>
                  <Heart className={`h-5 w-5 transition-colors duration-300 ${isWishlisted ? "fill-[#EF4444] text-[#EF4444]" : "text-[#111827]"}`} />
                </motion.div>
              </button>

              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.7 }}
                className="w-full h-full relative"
                data-product-image="main"
              >
                <Image
                  src={frame.imageUrl}
                  alt={frame.title}
                  fill
                  priority
                  className="object-contain transition-transform duration-[700ms] md:hover:scale-[1.03]"
                />
              </motion.div>
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="w-full md:w-1/2 px-4 md:px-0 flex flex-col pt-2 md:pt-0">
            
            {/* Title & Rating */}
            <div className="mb-6">
              <motion.h1 
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="text-[22px] md:text-[32px] lg:text-[36px] font-[600] tracking-[-0.025em] leading-[1.15] mb-3 text-[#111827]"
              >
                {frame.title}
              </motion.h1>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-[#111827] text-[#111827]" />)}
                </div>
                <span className="text-[13px] text-[#64748B] font-[500]">4.8 (124 reviews)</span>
              </div>
            </div>

            {/* Price Area */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8 border-b border-[#F1F5F9] pb-8">
              <div className="flex items-end gap-3 mb-1.5">
                <span className="text-[26px] md:text-[32px] font-[700] leading-none text-[#111827] tracking-tight">{formatPrice(discountedPrice)}</span>
                {hasDiscount && (
                  <>
                    <span className="text-[14px] md:text-[16px] text-[#94A3B8] font-[500] line-through mb-1">{formatPrice(frame.price)}</span>
                    <span className="bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-[10px] md:text-[11px] font-[700] tracking-wider px-2 py-0.5 rounded-full mb-1">
                      {eligibility.discountValue}% OFF
                    </span>
                  </>
                )}
              </div>
              {hasDiscount && (
                <p className="text-[13px] font-[600] text-[#10B981]">You save {formatPrice(savings)}</p>
              )}
            </motion.div>

            {/* Specifications Grid */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mb-8">
              <div className="grid grid-cols-2 rounded-[16px] border border-[#E2E8F0] overflow-hidden bg-white">
                <div className="p-4 border-r border-b border-[#E2E8F0]">
                  <span className="block text-[11px] text-[#64748B] font-[600] uppercase tracking-wider mb-1">Category</span>
                  <span className="block text-[14px] font-[500] text-[#111827]">{frame.category}</span>
                </div>
                <div className="p-4 border-b border-[#E2E8F0]">
                  <span className="block text-[11px] text-[#64748B] font-[600] uppercase tracking-wider mb-1">Size</span>
                  <span className="block text-[14px] font-[500] text-[#111827]">{frame.frame_size}</span>
                </div>
                <div className="p-4 border-r border-[#E2E8F0]">
                  <span className="block text-[11px] text-[#64748B] font-[600] uppercase tracking-wider mb-1">Material</span>
                  <span className="block text-[14px] font-[500] text-[#111827]">{frame.frame_material}</span>
                </div>
                <div className="p-4">
                  <span className="block text-[11px] text-[#64748B] font-[600] uppercase tracking-wider mb-1">Stock</span>
                  <span className="flex items-center gap-1.5 text-[14px] font-[500] text-[#111827]">
                    <span className={`w-2 h-2 rounded-full ${frame.stock > 0 ? "bg-[#10B981]" : "bg-[#EF4444]"}`} />
                    {frame.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mb-10">
              <h3 className="text-[13px] uppercase tracking-wider text-[#94A3B8] font-[600] mb-3">Description</h3>
              <div className={`relative overflow-hidden transition-all duration-300 ${descExpanded ? "max-h-[1000px]" : "max-h-[88px]"}`}>
                <p className="text-[14px] md:text-[15px] text-[#475569] leading-[1.6] whitespace-pre-line">
                  {frame.description}
                </p>
                {!descExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                )}
              </div>
              <button 
                onClick={() => setDescExpanded(!descExpanded)} 
                className="mt-2 text-[13px] font-[600] text-[#3B82F6] flex items-center gap-1 outline-none"
              >
                {descExpanded ? "Read less" : "Read more"} {descExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </motion.div>

            {/* Desktop Add to Cart */}
            <div className="hidden md:flex flex-col gap-3 mb-10 border-b border-[#F1F5F9] pb-10">
              <button
                onClick={handleAddToCart}
                disabled={frame.stock === 0}
                className={`w-full h-[52px] rounded-[14px] font-[600] text-[15px] transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] ${
                  isAdded ? "bg-[#10B981] text-white" : 
                  frame.stock === 0 ? "bg-[#E2E8F0] text-[#94A3B8]" : 
                  "bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-[0_4px_14px_rgba(59,130,246,0.3)]"
                }`}
              >
                <AnimatePresence mode="wait">
                  {isAdded ? (
                    <motion.div key="added" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                      <Check className="h-5 w-5" /> Added to Cart
                    </motion.div>
                  ) : (
                    <motion.div key="add" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                      {frame.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* Premium Quality Features Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors hover:border-[#CBD5E1]">
                  <Shield className="h-5 w-5 text-[#111827] mb-3 stroke-[1.5]" />
                  <h4 className="text-[13px] font-[600] text-[#111827] mb-1">Premium Materials</h4>
                  <p className="text-[12px] text-[#64748B] leading-[1.4]">High-quality materials with glass protection</p>
                </div>
                <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors hover:border-[#CBD5E1]">
                  <ImageIcon className="h-5 w-5 text-[#111827] mb-3 stroke-[1.5]" />
                  <h4 className="text-[13px] font-[600] text-[#111827] mb-1">HD Print Quality</h4>
                  <p className="text-[12px] text-[#64748B] leading-[1.4]">Professional printing with vibrant colors</p>
                </div>
                <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors hover:border-[#CBD5E1]">
                  <Package className="h-5 w-5 text-[#111827] mb-3 stroke-[1.5]" />
                  <h4 className="text-[13px] font-[600] text-[#111827] mb-1">Secure Packaging</h4>
                  <p className="text-[12px] text-[#64748B] leading-[1.4]">Protected delivery every single time</p>
                </div>
                <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors hover:border-[#CBD5E1]">
                  <Award className="h-5 w-5 text-[#111827] mb-3 stroke-[1.5]" />
                  <h4 className="text-[13px] font-[600] text-[#111827] mb-1">7-Day Guarantee</h4>
                  <p className="text-[12px] text-[#64748B] leading-[1.4]">Easy returns with full refund policy</p>
                </div>
              </div>
            </motion.div>

            {/* Museum-Grade Quality Section */}
            <div className="mb-12 border-t border-[#F1F5F9] pt-10 md:pt-16">
              <div className="max-w-[1100px] mx-auto">
                <div className="flex flex-col md:flex-row gap-6 md:gap-12 lg:gap-16 items-start">
                  
                  {/* Left: Image with Overlaid Text */}
                  <div className="w-full md:w-1/2">
                    <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#64748B] mb-3 md:mb-4 font-[600]">
                      Crafted for lasting memories
                    </p>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.65, ease: "easeOut" }}
                      whileHover={{ scale: 1.025 }}
                      className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[340px] rounded-[20px] md:rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] cursor-default"
                    >
                      <Image
                        src={frame.imageUrl}
                        alt="Museum-Grade Quality"
                        fill
                        className="object-cover transition-transform duration-[700ms]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.55)] via-transparent to-transparent opacity-90" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                        <h3 className="text-[20px] md:text-[24px] font-[600] text-white mb-1 tracking-tight">Museum-Grade Quality</h3>
                        <p className="text-[12px] md:text-[14px] text-[rgba(255,255,255,0.85)]">Handcrafted with precision</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right: Quality List */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center pt-2 md:pt-10">
                    <h4 className="hidden md:block text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#64748B] mb-6 font-[600]">
                      Quality Specifications
                    </h4>
                    <div className="flex flex-col gap-[16px]">
                      {[
                        { title: "UV Protected Glass", desc: "Protects from fading over time" },
                        { title: "Moisture Resistant", desc: "Prevents warping and ensures longevity" },
                        { title: "Easy Wall Mount", desc: "Pre-installed hanging hardware" },
                        { title: "Eco-Friendly Materials", desc: "Carefully selected materials" }
                      ].map((item, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 8 }} 
                          whileInView={{ opacity: 1, y: 0 }} 
                          viewport={{ once: true }} 
                          transition={{ delay: 0.06 * idx, duration: 0.4 }}
                          className="flex items-start gap-4"
                        >
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                            className="w-[34px] h-[34px] md:w-[38px] md:h-[38px] rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0 mt-0.5 shadow-sm"
                          >
                            <Check className="h-4 w-4 md:h-5 md:w-5 text-[#16A34A] stroke-[2.5]" />
                          </motion.div>
                          <div>
                            <h4 className="text-[16px] font-[600] mb-0.5 text-[#111827]">{item.title}</h4>
                            <p className="text-[12px] md:text-[13px] text-[#64748B] leading-[1.4] max-w-[280px]">{item.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Similar Frames */}
        {similarFrames.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }}
            className="mt-4 md:mt-12 mb-8 px-4 md:px-0"
          >
            <h2 className="text-[18px] md:text-[22px] font-[600] mb-5 text-[#111827]">Similar Frames You'll Love</h2>
            
            <div className="flex md:grid md:grid-cols-4 gap-[12px] md:gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 snap-x">
              {similarFrames.map((similarFrame, idx) => {
                const similarDiscountPrice = eligibility.offerActive && eligibility.eligible && eligibility.discountValue > 0 
                  ? similarFrame.price - Math.round((similarFrame.price * eligibility.discountValue) / 100)
                  : similarFrame.price;
                
                return (
                  <motion.div
                    key={similarFrame._id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="snap-start flex-shrink-0 w-[165px] md:w-auto"
                  >
                    <Link 
                      href={`/frames/${similarFrame.slug}`}
                      className="bg-white border border-[#E5E7EB] rounded-[14px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all active:scale-[0.98] md:hover:-translate-y-1 block group h-full"
                    >
                      <div className="relative aspect-[1/1] bg-[#F8FAFC]">
                        {eligibility.offerActive && eligibility.eligible && eligibility.discountValue > 0 && (
                          <div className="absolute top-2 left-2 z-10 bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] text-[9px] font-[700] tracking-wider px-1.5 py-0.5 rounded-full">
                            {eligibility.discountValue}% OFF
                          </div>
                        )}
                        <Image
                          src={similarFrame.imageUrl}
                          alt={similarFrame.title}
                          fill
                          className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="p-3 bg-white">
                        <h3 className="font-[500] text-[12px] md:text-[13px] text-[#111827] line-clamp-1 mb-1 transition-colors group-hover:text-[#3B82F6]">{similarFrame.title}</h3>
                        <div className="flex items-center gap-1.5">
                          <span className="font-[600] text-[13px] md:text-[14px] text-[#111827]">{formatPrice(similarDiscountPrice).replace(".00", "")}</span>
                          {similarDiscountPrice < similarFrame.price && (
                            <span className="text-[10px] md:text-[11px] text-[#94A3B8] line-through">{formatPrice(similarFrame.price).replace(".00", "")}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Trust (3-col) */}
        <div className="mb-6 border-t border-b border-[#F1F5F9] py-4 px-2 md:px-0 bg-white">
          <div className="max-w-[1100px] mx-auto">
            <div className="grid grid-cols-3 divide-x divide-[#F1F5F9]">
              {[
                { icon: Truck, title: "Free Shipping", desc: "Above ₹999" },
                { icon: Shield, title: "Secure Payments", desc: "100% Secure" },
                { icon: Award, title: "Quality Assured", desc: "Premium Craftsmanship" }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 8 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  className="flex flex-col items-center text-center px-1 md:px-4"
                >
                  <item.icon className="h-[28px] w-[28px] text-[#64748B] mb-2 stroke-[1.2]" />
                  <h4 className="text-[10px] md:text-[12px] font-[600] text-[#111827] mb-0.5 tracking-[0.08em] uppercase leading-tight">{item.title}</h4>
                  <p className="text-[10px] md:text-[12px] text-[#64748B] leading-[1.3]">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
