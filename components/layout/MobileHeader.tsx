"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function MobileHeader() {
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (user) {
      console.log("User data:", {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        role: user.publicMetadata?.role,
        fullMetadata: user.publicMetadata
      });
    }
  }, [user]);

  if (pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur md:hidden">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="w-16">
            {/* User icon removed */}
          </div>
          <div className="text-center">
            <Link href="/" className="inline-flex justify-center">
              <Image
                src="/images/branding/Frame-2.png"
                alt="FrameKart"
                width={250}
                height={66}
                priority
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-xs text-muted-foreground">What are you framing today?</p>
          </div>
          <div className="w-16 flex justify-end">
            {!isSignedIn && (
              <Link href="/sign-in" className="text-xs text-primary font-medium">
                Sign In
              </Link>
            )}
          </div>
        </div>
        {isSignedIn && user?.publicMetadata?.role === "admin" && (
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
