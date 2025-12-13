import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch | FrameKart",
  description: "Have questions? Contact FrameKart for inquiries about our premium frames, custom orders, or customer support. We're here to help!",
  openGraph: {
    title: "Contact FrameKart",
    description: "Get in touch with us for any questions or support",
    url: "https://framekart.co.in/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
