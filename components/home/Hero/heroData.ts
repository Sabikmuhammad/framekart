import { ArrowRight, Palette, Heart, Cake } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface HeroSlideButton {
  label: string;
  href: string;
  variant: "default" | "outline" | "link" | "destructive" | "secondary" | "ghost";
  icon: LucideIcon;
}

export interface HeroSlide {
  title: string;
  highlight: string;
  description: string;
  buttons: HeroSlideButton[];
  gradient: string;
  image: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    title: "Frame Your Memories,",
    highlight: "Beautifully",
    description: "Discover our curated collection of premium wall frames. Perfect for every space, every style.",
    buttons: [
      { label: "Shop Now", href: "/frames", variant: "default", icon: ArrowRight },
      { label: "Create Custom Frame", href: "/custom-frame", variant: "outline", icon: Palette },
    ],
    gradient: "from-primary/10 via-background to-secondary/10",
    image: "/images/banners/H1.png",
  },
  {
    title: "Create",
    highlight: "Custom Frame",
    description: "Design a personalized frame with your choice of size, style, and uploaded image. Bring your vision to life.",
    buttons: [
      { label: "Start Creating", href: "/custom-frame", variant: "default", icon: Palette },
      { label: "View Gallery", href: "/frames", variant: "outline", icon: ArrowRight },
    ],
    gradient: "from-purple-50 via-background to-blue-50 dark:from-purple-950/20 dark:via-background dark:to-blue-950/20",
    image: "/images/banners/H2.png",
  },
  {
    title: "Celebrate Forever,",
    highlight: "Wedding Frames",
    description: "Preserve your special day with our beautiful wedding frame templates. Our design team will create a romantic masterpiece.",
    buttons: [
      { label: "Explore Wedding Frames", href: "/custom-frame/wedding", variant: "default", icon: Heart },
      { label: "Shop All Frames", href: "/frames", variant: "outline", icon: ArrowRight },
    ],
    gradient: "from-rose-50 via-background to-amber-50 dark:from-rose-950/20 dark:via-background dark:to-amber-950/20",
    image: "/images/banners/H3.png",
  },
  {
    title: "Make It Special,",
    highlight: "Birthday Frames",
    description: "Create unforgettable birthday memories with personalized frame designs. Perfect for celebrating every milestone.",
    buttons: [
      { label: "Explore Birthday Frames", href: "/custom-frame/birthday", variant: "default", icon: Cake },
      { label: "Shop All Frames", href: "/frames", variant: "outline", icon: ArrowRight },
    ],
    gradient: "from-pink-50 via-background to-purple-50 dark:from-pink-950/20 dark:via-background dark:to-purple-950/20",
    image: "/images/banners/H4.png",
  },
];
