"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Eligibility {
  eligible: boolean;
  discountValue: number;
  offerActive: boolean;
  offerName: string;
}

interface LaunchOfferBannerProps {
  eligibility: Eligibility;
}

export default function LaunchOfferBanner({ eligibility }: LaunchOfferBannerProps) {
  if (!eligibility.offerActive || !eligibility.eligible) return null;

  return (
    <Link 
      href="/frames" 
      className="block w-full bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA] text-white overflow-hidden relative border-b border-white/10 group cursor-pointer h-[52px] sm:h-[60px]"
      aria-label={`Shop ${eligibility.offerName}`}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes premium-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-premium-marquee {
          animation: premium-marquee 22s linear infinite;
          width: max-content;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-premium-marquee {
            animation: none;
            transform: translateX(0);
          }
        }
      `}} />
      <div className="animate-premium-marquee flex items-center h-full whitespace-nowrap">
        {/* We duplicate the content to make the infinite loop seamless. 
            The content takes exactly 50% of the total max-content width,
            so translating to -50% loops perfectly. */}
        <div className="flex items-center">
          <span className="text-[14px] sm:text-[15px] font-[800] mx-4 sm:mx-6 tracking-wide">🎉 {eligibility.offerName.toUpperCase()}: FLAT {eligibility.discountValue}% OFF</span>
          <span className="text-[14px] sm:text-[15px] font-[500] opacity-90 mx-4 sm:mx-6 tracking-wide">AUTO APPLIED AT CHECKOUT</span>
          <span className="text-[14px] sm:text-[15px] font-[700] mx-4 sm:mx-6 flex items-center group-hover:underline">SHOP NOW <ArrowRight className="h-4 w-4 ml-1 inline" /></span>
        </div>
        <div className="flex items-center">
          <span className="text-[14px] sm:text-[15px] font-[800] mx-4 sm:mx-6 tracking-wide">🎉 {eligibility.offerName.toUpperCase()}: FLAT {eligibility.discountValue}% OFF</span>
          <span className="text-[14px] sm:text-[15px] font-[500] opacity-90 mx-4 sm:mx-6 tracking-wide">AUTO APPLIED AT CHECKOUT</span>
          <span className="text-[14px] sm:text-[15px] font-[700] mx-4 sm:mx-6 flex items-center group-hover:underline">SHOP NOW <ArrowRight className="h-4 w-4 ml-1 inline" /></span>
        </div>
      </div>
    </Link>
  );
}
