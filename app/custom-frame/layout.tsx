import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Frame Designer | FrameKart",
  description: "Create your perfect custom frame. Upload your image, choose size and style, and we'll craft a premium quality frame just for you. Fast delivery across India.",
  keywords: "custom frames, personalized frames, photo framing, custom picture frames",
  openGraph: {
    title: "Custom Frame Designer | FrameKart",
    description: "Design and order your custom frame online",
    url: "https://framekart.co.in/custom-frame",
  },
};

export default function CustomFrameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
