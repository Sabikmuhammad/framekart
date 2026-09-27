"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingCart, User, Palette } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileNav() {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up")) {
    return null;
  }

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/frames", label: "Frames", icon: Package },
    { href: "/custom-frame", label: "Custom", icon: Palette },
    { href: "/cart", label: "Cart", icon: ShoppingCart },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[9000] border-t bg-background md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around h-[62px]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isCart = item.href === "/cart";
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 relative ${
                isActive ? "text-primary" : "text-[#64748B]"
              }`}
            >
              <motion.div 
                className="relative"
                {...(isCart ? { "data-cart-target": "mobile" } : {})}
                key={isCart ? cartCount : 'icon'}
                animate={isCart && cartCount > 0 ? { scale: [1, 1.15, 0.96, 1] } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <item.icon className="h-[22px] w-[22px] stroke-[1.5]" />
                <AnimatePresence>
                  {isCart && cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: [1.15, 1], opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="absolute -right-2 -top-2 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold shadow-sm"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
