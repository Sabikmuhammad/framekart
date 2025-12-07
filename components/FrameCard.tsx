"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/components/ui/use-toast";

interface FrameCardProps {
  frame: {
    _id: string;
    title: string;
    slug: string;
    price: number;
    imageUrl: string;
    frame_size: string;
    frame_material: string;
    category: string;
  };
}

export default function FrameCard({ frame }: FrameCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      _id: frame._id,
      title: frame.title,
      price: frame.price,
      imageUrl: frame.imageUrl,
      frame_size: frame.frame_size,
      frame_material: frame.frame_material,
    });
    toast({
      title: "Added to cart",
      description: `${frame.title} has been added to your cart.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <Link href={`/frames/${frame.slug}`}>
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={frame.imageUrl}
              alt={frame.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </Link>
        <CardContent className="p-4">
          <Link href={`/frames/${frame.slug}`}>
            <h3 className="font-semibold line-clamp-1 hover:text-primary">
              {frame.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">
            {frame.frame_size} • {frame.frame_material}
          </p>
          <p className="mt-2 text-lg font-bold text-primary">
            {formatPrice(frame.price)}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            className="w-full"
            size="sm"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
