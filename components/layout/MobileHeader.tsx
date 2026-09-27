"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function MobileHeader() {
  const pathname = usePathname();
  const { isAuthenticated: isSignedIn, user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log("User data:", {
        id: user.id,
        role: user.role,
      });
    }
  }, [user]);

  if (pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-[rgba(255,255,255,0.88)] backdrop-blur-[18px] md:hidden transition-colors">
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div className="w-12">
            {/* Left space */}
          </div>
          <div className="text-center flex flex-col items-center">
            <Link href="/" className="inline-flex justify-center mb-0.5 outline-none">
              <Image
                src="/images/branding/Frame-2.png"
                alt="FrameKart"
                width={180}
                height={48}
                priority
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-[9px] font-[600] tracking-[0.1em] text-[#64748B] uppercase">What are you framing today?</p>
          </div>
          <div className="w-12 flex justify-end">
            {!isSignedIn && null}
          </div>
        </div>
        {isSignedIn && user?.role === "ADMIN" && (
          <div className="mt-2 flex justify-center">
            <Link href="/admin" className="w-full">
              <Button variant="default" size="sm" className="w-full gap-2">
                <Shield className="h-4 w-4" />
                Admin Dashboard
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
