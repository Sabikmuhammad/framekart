import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileHeader from "@/components/layout/MobileHeader";
import MobileNav from "@/components/layout/MobileNav";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://framekart.co.in'),
  title: "FrameKart - Modern Online Frame Store",
  description: "Your destination for premium wall frames. Transform your space with our curated collection.",
  openGraph: {
    title: "FrameKart - Modern Online Frame Store",
    description: "Your destination for premium wall frames. Transform your space with our curated collection.",
    url: "https://framekart.co.in",
    siteName: "FrameKart",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FrameKart - Modern Online Frame Store",
    description: "Your destination for premium wall frames",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <MobileHeader />
          <Navbar />
          <main className="min-h-screen pb-16 md:pb-0">{children}</main>
          <div className="hidden md:block">
            <Footer />
          </div>
          <MobileNav />
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
