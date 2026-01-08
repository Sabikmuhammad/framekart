// Category configurations with Cloudinary image paths
export const categories = [
  {
    name: "Custom Frames",
    href: "/custom-frame",
    image: "framekart/categories/custom-frames.jpg",
    gradient: "from-primary/20 via-primary/10 to-background",
    iconColor: "text-primary",
    bgColor: "from-primary/20 via-primary/10",
    isNew: true,
    subtitle: "Design Your Own",
  },
  {
    name: "Photo Frames",
    href: "/frames?category=Photo Frames",
    image: "framekart/categories/photo-frames.jpg",
    gradient: "from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
    bgColor: "from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900",
  },
  {
    name: "Wall Frames",
    href: "/frames?category=Wall Frames",
    image: "framekart/categories/wall-frames.jpg",
    gradient: "from-purple-100 to-purple-50 dark:from-purple-950 dark:to-purple-900",
    iconColor: "text-purple-600 dark:text-purple-400",
    bgColor: "from-purple-100 to-purple-50 dark:from-purple-950 dark:to-purple-900",
  },
  {
    name: "Birthday",
    fullName: "Birthday Frames",
    href: "/custom-frame/birthday",
    image: "framekart/categories/birthday-frames.jpg",
    gradient: "from-pink-100 to-pink-50 dark:from-pink-950 dark:to-pink-900",
    iconColor: "text-pink-600 dark:text-pink-400",
    bgColor: "from-pink-100 to-pink-50 dark:from-pink-950 dark:to-pink-900",
  },
  {
    name: "Wedding",
    fullName: "Wedding Frames",
    href: "/custom-frame/wedding",
    image: "framekart/categories/wedding-frames.jpg",
    gradient: "from-rose-100 to-rose-50 dark:from-rose-950 dark:to-rose-900",
    iconColor: "text-rose-600 dark:text-rose-400",
    bgColor: "from-rose-100 to-rose-50 dark:from-rose-950 dark:to-rose-900",
  },
  {
    name: "Calligraphy",
    fullName: "Calligraphy Frames",
    href: "/frames?category=Calligraphy Frames",
    image: "framekart/categories/calligraphy-frames.jpg",
    gradient: "from-amber-100 to-amber-50 dark:from-amber-950 dark:to-amber-900",
    iconColor: "text-amber-600 dark:text-amber-400",
    bgColor: "from-amber-100 to-amber-50 dark:from-amber-950 dark:to-amber-900",
  },
  {
    name: "Home Decor",
    href: "/frames",
    image: "framekart/categories/home-decor.jpg",
    gradient: "from-emerald-100 to-emerald-50 dark:from-emerald-950 dark:to-emerald-900",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    bgColor: "from-emerald-100 to-emerald-50 dark:from-emerald-950 dark:to-emerald-900",
  },
];

export const getCloudinaryUrl = (path: string) => {
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/${path}`;
};
