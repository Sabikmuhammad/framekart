import { AuthProvider } from "@/context/AuthContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileHeader from "@/components/layout/MobileHeader";
import MobileNav from "@/components/layout/MobileNav";
import { Toaster } from "@/components/ui/toaster";
import LogoIntro from "@/components/LogoIntro";
import VisitorTracker from "@/components/visitor/VisitorTracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://framekart.co.in'),
  title: "FrameKart - Modern Online Frame Store",
  description: "Your destination for premium wall frames. Transform your space with our curated collection.",
  verification: {
    other: {
      'facebook-domain-verification': 'xlmvd20edmx635vxijoxln2sntiqdi',
    },
  },
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
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LogoIntro />
          <MobileHeader />
          <Navbar />
          <main className="min-h-screen pb-16 md:pb-0">{children}</main>
          <div className="hidden md:block">
            <Footer />
          </div>
          <MobileNav />
          <Toaster />
          <VisitorTracker />
        </AuthProvider>
      </body>
    </html>
  );
}
