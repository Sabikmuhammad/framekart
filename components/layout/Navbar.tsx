"use client";

import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { ShoppingCart, Menu, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (user && process.env.NODE_ENV === 'development') {
      console.log("Navbar - User role:", user.publicMetadata?.role);
    }
  }, [user]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hidden md:block">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold">
          FrameKart
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/frames"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Frames
          </Link>
          <Link
            href="/custom-frame"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Custom Frame
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Contact
          </Link>
          {isSignedIn && user?.publicMetadata?.role === "admin" && (
            <Link
              href="/admin"
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {mounted && getTotalItems() > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                {getTotalItems()}
              </span>
            )}
          </Link>

          {isSignedIn ? (
            <>
              {user?.publicMetadata?.role === "admin" && (
                <Link href="/admin">
                  <Button variant="default" size="sm" className="gap-2">
                    <Shield className="h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  Profile
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/sign-in">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t bg-background p-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="/frames"
              className="text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Frames
            </Link>
            <Link
              href="/custom-frame"
              className="text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Custom Frame
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {isSignedIn && user?.publicMetadata?.role === "admin" && (
              <Link
                href="/admin"
                className="text-sm font-medium text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
