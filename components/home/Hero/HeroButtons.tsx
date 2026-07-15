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
    <div className={mobile ? "flex max-w-full flex-wrap gap-2" : "flex flex-row flex-wrap gap-2.5 sm:gap-3 md:gap-4"}>
      {visibleButtons.map((button, index) => {
        const Icon = button.icon;
        return (
          <Link key={index} href={button.href}>
            <Button
              variant={button.variant}
              className={
                mobile
                  ? `h-10 max-w-full rounded-xl px-5 text-sm gap-1.5 ${
                      button.variant === "outline"
                        ? "border border-black/20 bg-white/80 text-black hover:bg-black hover:text-white"
                        : "shadow-sm"
                    }`
                  : `h-11 px-5 text-xs gap-2 sm:h-12 sm:px-6 sm:text-sm md:h-12 md:px-7 md:text-sm lg:h-14 lg:px-8 lg:text-base ${
                      button.variant === "outline"
                        ? "border-2 border-black text-black hover:bg-black hover:text-white"
                        : ""
                    }`
              }
            >
              {button.variant === "default" && <Icon className="h-4 w-4" />}
              {button.label}
              {button.variant === "outline" && <Icon className="h-4 w-4" />}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
