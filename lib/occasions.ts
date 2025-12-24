import { Cake, Heart, Sparkles } from "lucide-react";

export type OccasionType = "custom" | "birthday" | "wedding";

export interface OccasionConfig {
  type: OccasionType;
  title: string;
  subtitle: string;
  heroTitle: string;
  heroDescription: string;
  icon: any;
  gradient: string;
  borderColor: string;
  accentColor: string;
  bgGradient: string;
  metadata: {
    required: string[];
    optional: string[];
  };
}

export const OCCASION_CONFIGS: Record<OccasionType, OccasionConfig> = {
  custom: {
    type: "custom",
    title: "Custom Frame",
    subtitle: "Upload any image and create your perfect frame",
    heroTitle: "Create Your Custom Frame",
    heroDescription: "Transform your favorite moments into beautiful framed art. Upload your photo, choose your style, and we'll bring it to life.",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500",
    borderColor: "border-purple-200 dark:border-purple-800",
    accentColor: "text-purple-600 dark:text-purple-400",
    bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
    metadata: {
      required: [],
      optional: ["customerNotes"],
    },
  },
  birthday: {
    type: "birthday",
    title: "Birthday Frame",
    subtitle: "Celebrate birthdays with personalized frames",
    heroTitle: "Create a Birthday Frame",
    heroDescription: "Make birthdays extra special with a personalized photo frame. Add their photo, name, age, and a heartfelt message.",
    icon: Cake,
    gradient: "from-pink-500 to-purple-500",
    borderColor: "border-pink-200 dark:border-pink-800",
    accentColor: "text-pink-600 dark:text-pink-400",
    bgGradient: "from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20",
    metadata: {
      required: ["name", "age", "date"],
      optional: ["message"],
    },
  },
  wedding: {
    type: "wedding",
    title: "Wedding Frame",
    subtitle: "Preserve wedding memories forever",
    heroTitle: "Create a Wedding Frame",
    heroDescription: "Celebrate love with a beautiful wedding frame. Perfect for the couple's photo with their names, date, and a special quote.",
    icon: Heart,
    gradient: "from-rose-500 to-amber-500",
    borderColor: "border-rose-200 dark:border-rose-800",
    accentColor: "text-rose-600 dark:text-rose-400",
    bgGradient: "from-rose-50 to-amber-50 dark:from-rose-950/20 dark:to-amber-950/20",
    metadata: {
      required: ["brideName", "groomName", "weddingDate"],
      optional: ["quote"],
    },
  },
};

export function getOccasionConfig(occasion: OccasionType): OccasionConfig {
  return OCCASION_CONFIGS[occasion] || OCCASION_CONFIGS.custom;
}

export function validateOccasionMetadata(
  occasion: OccasionType,
  metadata: Record<string, any>
): { valid: boolean; missing: string[] } {
  const config = getOccasionConfig(occasion);
  const missing: string[] = [];

  for (const field of config.metadata.required) {
    if (!metadata[field] || metadata[field].trim() === "") {
      missing.push(field);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

export function getOccasionDisplayName(occasion: OccasionType): string {
  const config = getOccasionConfig(occasion);
  return config.title;
}

export function getOccasionBadgeColor(occasion: OccasionType): string {
  const colors: Record<OccasionType, string> = {
    custom: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    birthday: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    wedding: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  };
  return colors[occasion] || colors.custom;
}
