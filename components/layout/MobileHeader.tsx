"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function MobileHeader() {
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

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur md:hidden">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="w-16">
            {/* User icon removed */}
          </div>
          <div className="text-center">
            <Link href="/">
              <h1 className="text-lg font-bold">FrameKart</h1>
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
