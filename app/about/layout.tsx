import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Premium Frame Store | FrameKart",
  description: "Learn about FrameKart's mission to provide premium quality frames with care. We create frames that elevate interiors and preserve memories for generations.",
  openGraph: {
    title: "About FrameKart - Premium Frame Store",
    description: "Discover our story and commitment to quality craftsmanship",
    url: "https://framekart.co.in/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
