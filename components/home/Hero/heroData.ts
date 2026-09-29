import { ArrowRight, Palette, Heart, Cake } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface HeroSlideButton {
  label: string;
  href: string;
  variant: "default" | "outline" | "link" | "destructive" | "secondary" | "ghost";
  icon: LucideIcon;
}

export interface HeroSlide {
  eyebrow?: string;
  title: string;
  highlight: string;
  description: string;
  benefit?: string;
  buttons: HeroSlideButton[];
  gradient: string;
  image: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    eyebrow: "PREMIUM COLLECTION",
    title: "Frame Your Memories,",
    highlight: "Beautifully.",
    description: "Turn your favourite moments into timeless wall art.",
    benefit: "",
    buttons: [
      { label: "Shop Now", href: "/frames", variant: "default", icon: ArrowRight },
    ],
    gradient: "from-primary/10 via-background to-secondary/10",
    image: "/images/banners/H1.webp",
  },
  {
    eyebrow: "MAKE IT PERSONAL",
    title: "Create Your",
    highlight: "Custom Frame.",
    description: "Upload your photo and create a frame made just for you.",
    benefit: "",
    buttons: [
      { label: "Start Creating", href: "/custom-frame", variant: "default", icon: ArrowRight },
    ],
    gradient: "from-purple-50 via-background to-blue-50 dark:from-purple-950/20 dark:via-background dark:to-blue-950/20",
    image: "/images/banners/H2.webp",
  },
  {
    eyebrow: "FOR YOUR SPECIAL DAY",
    title: "Celebrate Forever,",
    highlight: "Wedding Frames.",
    description: "Preserve the moments you'll want to remember forever.",
    benefit: "",
    buttons: [
      { label: "Explore Wedding Frames", href: "/custom-frame/wedding", variant: "default", icon: ArrowRight },
    ],
    gradient: "from-rose-50 via-background to-amber-50 dark:from-rose-950/20 dark:via-background dark:to-amber-950/20",
    image: "/images/banners/H3.webp",
  },
  {
    eyebrow: "MAKE IT SPECIAL",
    title: "Birthday Frames",
    highlight: "Made to Remember.",
    description: "Turn their special day into a memory worth displaying.",
    benefit: "",
    buttons: [
      { label: "Explore Birthday Frames", href: "/custom-frame/birthday", variant: "default", icon: ArrowRight },
    ],
    gradient: "from-pink-50 via-background to-purple-50 dark:from-pink-950/20 dark:via-background dark:to-purple-950/20",
    image: "/images/banners/H4.webp",
  },
];
