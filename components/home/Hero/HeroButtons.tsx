"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { HeroSlideButton } from "./heroData";

interface HeroButtonsProps {
  buttons: HeroSlideButton[];
}

export default function HeroButtons({ buttons }: HeroButtonsProps) {
  return (
    <div className="flex max-w-full flex-wrap gap-2 sm:gap-4 md:gap-4 md:flex-row">
      {buttons.map((button, index) => {
        const Icon = button.icon;
        const isOutline = button.variant === "outline";
        
        return (
          <Link 
            key={index} 
            href={button.href} 
            className={`outline-none inline-block ${isOutline ? "hidden md:inline-block" : ""}`}
          >
            <Button
              variant={button.variant}
              className={`
                h-[46px] md:h-12 lg:h-14 
                w-auto 
                rounded-[12px] md:rounded-xl 
                px-6 sm:px-7 lg:px-8 
                text-[14px] sm:text-[15px] lg:text-[16px] font-[600] 
                gap-1.5 md:gap-2.5 
                transition-all duration-200 active:scale-[0.97] group
                ${isOutline
                    ? "border border-[#3B82F6]/30 bg-white text-[#3B82F6] shadow-sm hover:bg-[#EFF6FF] hover:border-[#3B82F6]/50"
                    : "bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(59,130,246,0.25)] md:shadow-[0_8px_20px_-4px_rgba(59,130,246,0.3)] md:hover:shadow-[0_12px_24px_-4px_rgba(59,130,246,0.4)]"
                }
              `}
            >
              {button.label}
              <Icon className="h-[16px] w-[16px] md:h-[18px] md:w-[18px] transition-transform duration-200 ease-out group-active:translate-x-1 md:group-hover:translate-x-1" />
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
