"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { HeroSlideButton } from "./heroData";

interface HeroButtonsProps {
  buttons: HeroSlideButton[];
  mobile?: boolean;
}

export default function HeroButtons({ buttons, mobile = false }: HeroButtonsProps) {
  const visibleButtons = mobile ? buttons.filter((button) => button.variant === "default") : buttons;

  return (
    <div className={mobile ? "flex max-w-full flex-wrap gap-2" : "flex flex-row flex-wrap gap-3 sm:gap-4 md:gap-4"}>
      {visibleButtons.map((button, index) => {
        const Icon = button.icon;
        return (
          <Link key={index} href={button.href} className="outline-none inline-block">
            <Button
              variant={button.variant}
              className={
                mobile
                  ? `h-[46px] w-auto rounded-[12px] px-6 text-[14px] font-[600] gap-1.5 transition-all duration-200 active:scale-[0.97] group ${
                      button.variant === "outline"
                        ? "border border-[#3B82F6]/30 bg-white text-[#3B82F6] shadow-sm hover:bg-[#EFF6FF] hover:border-[#3B82F6]/50"
                        : "bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(59,130,246,0.25)]"
                    }`
                  : `h-12 px-6 text-[14px] gap-2.5 sm:h-12 sm:px-7 sm:text-[15px] lg:h-14 lg:px-8 lg:text-[16px] rounded-xl font-[600] transition-all duration-200 active:scale-[0.97] group ${
                      button.variant === "outline"
                        ? "border border-[#3B82F6]/30 bg-white text-[#3B82F6] shadow-sm hover:bg-[#EFF6FF] hover:border-[#3B82F6]/50"
                        : "bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-[0_8px_20px_-4px_rgba(59,130,246,0.3)] hover:shadow-[0_12px_24px_-4px_rgba(59,130,246,0.4)]"
                    }`
              }
            >
              {button.label}
              <Icon className={mobile ? "h-[16px] w-[16px] transition-transform duration-200 ease-out group-active:translate-x-1" : "h-[18px] w-[18px] transition-transform duration-250 ease-out group-hover:translate-x-1"} />
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
