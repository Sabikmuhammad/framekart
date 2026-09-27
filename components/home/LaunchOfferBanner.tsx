"use client";

import Link from "next/link";

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
      className="block w-full bg-[#3B82F6] text-white overflow-hidden relative cursor-pointer py-2.5 md:py-3 select-none"
      aria-label={`Shop ${eligibility.offerName}`}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes premium-marquee-offer {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-premium-marquee-offer {
          animation: premium-marquee-offer 28s linear infinite;
          width: max-content;
          will-change: transform;
        }
        .animate-premium-marquee-offer:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-premium-marquee-offer {
            animation: none !important;
            transform: translateX(0) !important;
          }
        }
      `}} />
      
      <div className="animate-premium-marquee-offer flex items-center whitespace-nowrap">
        {/* We duplicate the content to make the infinite loop seamless. */}
        {[0, 1].map((dupIdx) => (
          <div key={dupIdx} className="flex items-center min-w-max">
            {[
              `FLAT ${eligibility.discountValue}% OFF`,
              "✦",
              "AUTO APPLIED AT CHECKOUT",
              "✦",
              "PREMIUM FRAMES",
              "✦",
              "SHOP NOW",
              "✦"
            ].map((item, idx) => (
              <span 
                key={idx} 
                className={`mx-3 md:mx-6 flex-shrink-0 ${
                  item === "✦" 
                    ? "text-white/60 text-[8px] md:text-[9px]" 
                    : "text-[9px] md:text-[11px] font-bold tracking-[0.2em] text-white uppercase"
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </Link>
  );
}
