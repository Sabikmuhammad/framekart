"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ShieldCheck, Users, TrendingUp, Leaf, Package, Droplets } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white selection:bg-[#3B82F6]/10 selection:text-[#3B82F6]">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="container mx-auto px-6 max-w-[1280px]">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 mb-6 border-b border-[#3B82F6]/30 pb-1">
                <span className="text-[11px] font-[700] tracking-[0.15em] uppercase text-[#334155]">
                  WE FRAME MEMORIES
                </span>
              </div>
              <h1 className="text-[34px] sm:text-[42px] lg:text-[56px] font-[800] leading-[1.1] tracking-tight text-[#0F172A] mb-6">
                We frame memories with care — premium quality, crafted for life.
              </h1>
              <p className="text-[16px] sm:text-[18px] text-[#64748B] leading-[1.6] mb-8 max-w-xl">
                FrameKart brings together craftsmanship and contemporary design to help you display what matters most. We create frames that elevate interiors and preserve memories for generations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/frames" className="w-full sm:w-auto">
                  <Button className="w-full h-12 sm:h-14 px-8 rounded-[12px] bg-[#0F172A] hover:bg-[#1E293B] text-white font-[500] text-[15px] shadow-[0_8px_20px_-4px_rgba(15,23,42,0.2)] transition-all duration-300">
                    Shop Frames
                  </Button>
                </Link>
                <Link href="/custom" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full h-12 sm:h-14 px-8 rounded-[12px] border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] font-[500] text-[15px] transition-all duration-300">
                    Create a Custom Frame
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]"
            >
              <Image
                src="/images/custom-banner/p9.png"
                alt="Premium framed photograph leaning against a wall"
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-1000 ease-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[24px] lg:rounded-[32px] pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. TRUST / STATS STRIP */}
      <section className="py-12 border-y border-[#F1F5F9] bg-[#F8FAFC]">
        <div className="container mx-auto px-6 max-w-[1280px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-[#E2E8F0]">
            {[
              { value: "5,000+", label: "Happy Customers", icon: Users },
              { value: "Premium", label: "Quality Guaranteed", icon: ShieldCheck },
              { value: "Expert", label: "Craftsmen Team", icon: Star },
              { value: "Fast", label: "Growing Business", icon: TrendingUp },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="flex flex-col items-center md:items-start text-center md:text-left px-4"
              >
                <div className="text-[28px] md:text-[32px] font-[800] text-[#0F172A] tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-[14px] text-[#64748B] font-[500] uppercase tracking-wider flex items-center justify-center md:justify-start gap-2">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BRAND STORY */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[12px] font-[700] tracking-[0.2em] text-[#3B82F6] uppercase mb-4">
              About FrameKart
            </h2>
            <h3 className="text-[32px] md:text-[48px] font-[800] text-[#0F172A] leading-[1.1] tracking-tight mb-8">
              Made for the moments <br className="hidden sm:block" /> worth keeping.
            </h3>
            
            <div className="text-[16px] md:text-[18px] text-[#475569] leading-[1.7] space-y-6">
              <p>
                We believe that every great photograph, every cherished memory, and every beautiful piece of art deserves an equally beautiful frame. FrameKart was born from a simple idea: making premium framing accessible without compromising on quality or design.
              </p>
              <p>
                What started as a small studio has grown into a trusted destination for curation and craftsmanship. Our team of expert framers treats every order with the same care they would give their own memories. From hand-selecting materials to precision cutting and assembly, our process is designed to deliver perfection.
              </p>
              <p>
                Whether you&apos;re framing a single wedding photo or curating a gallery wall for your office, we are here to ensure your moments look their absolute best.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. OUR VALUES */}
      <section className="py-20 md:py-32 bg-[#F8FAFC] border-y border-[#F1F5F9]">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="mb-16 md:mb-20">
            <h2 className="text-[12px] font-[700] tracking-[0.2em] text-[#3B82F6] uppercase mb-3">Our Core</h2>
            <h3 className="text-[32px] md:text-[40px] font-[800] text-[#0F172A] tracking-tight">Our Values</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {[
              {
                title: "Quality First",
                desc: "We never compromise on materials or craftsmanship. Each frame is meticulously inspected before shipping to ensure it meets our exacting standards.",
              },
              {
                title: "Customer Satisfaction",
                desc: "Your happiness is our success. We provide fast support, easy returns, and a dedication to making your framing experience seamless and enjoyable.",
              },
              {
                title: "Innovation",
                desc: "We continuously explore new designs, contemporary finishes, and modern techniques to keep our collection fresh and relevant to your space.",
              },
              {
                title: "Sustainability",
                desc: "We prioritize eco-friendly materials and responsible sourcing, ensuring that preserving your memories doesn't come at the cost of the environment.",
              }
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="flex gap-5"
              >
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-white shadow-sm border border-[#E2E8F0] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                </div>
                <div>
                  <h4 className="text-[20px] font-[700] text-[#0F172A] mb-2">{value.title}</h4>
                  <p className="text-[15px] leading-[1.6] text-[#64748B]">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OUR JOURNEY (TIMELINE) */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 max-w-[800px]">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-[12px] font-[700] tracking-[0.2em] text-[#3B82F6] uppercase mb-3">Timeline</h2>
            <h3 className="text-[32px] md:text-[40px] font-[800] text-[#0F172A] tracking-tight">Our Journey</h3>
          </div>

          <div className="relative pl-6 md:pl-0">
            {/* Vertical Line */}
            <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-[1px] bg-[#E2E8F0] md:-translate-x-1/2" />
            
            <div className="space-y-16">
              {[
                { year: "2020", title: "Founded", desc: "Started with a small studio and a big dream to make premium frames accessible." },
                { year: "2021", title: "First 1000 Orders", desc: "Received love from customers across the country—our first big milestone." },
                { year: "2023", title: "Expanded Catalogue", desc: "Launched premium and custom collections with new frame materials and prints." },
                { year: "2025", title: "FrameKart Today", desc: "A trusted name for curated wall art and frames with a growing, vibrant community." },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`relative flex flex-col md:flex-row md:items-center justify-between group ${
                    idx % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Marker */}
                  <div className="absolute left-[-5px] md:left-1/2 top-1 md:top-1/2 w-3 h-3 rounded-full bg-white border-[3px] border-[#3B82F6] md:-translate-x-1/2 md:-translate-y-1/2 z-10 shadow-[0_0_0_4px_rgba(255,255,255,1)] transition-transform duration-300 group-hover:scale-125" />
                  
                  {/* Empty space for alternating layout on desktop */}
                  <div className="hidden md:block w-[45%]" />
                  
                  {/* Content */}
                  <div className="w-full md:w-[45%] pl-6 md:pl-0 pb-2">
                    <div className="text-[28px] md:text-[36px] font-[800] text-[#E2E8F0] mb-1 leading-none transition-colors duration-500 group-hover:text-[#3B82F6]/20">
                      {item.year}
                    </div>
                    <h4 className="text-[18px] font-[700] text-[#0F172A] mb-2">{item.title}</h4>
                    <p className="text-[15px] text-[#64748B] leading-[1.6]">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. SUSTAINABILITY */}
      <section className="py-20 md:py-32 bg-[#FAF9F6] border-y border-[#F1F5F9]">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 md:order-1"
            >
              <h2 className="text-[12px] font-[700] tracking-[0.2em] text-[#10B981] uppercase mb-4">
                Sustainability
              </h2>
              <h3 className="text-[32px] md:text-[44px] font-[800] text-[#0F172A] leading-[1.1] tracking-tight mb-6">
                Thoughtful materials.<br />A lighter footprint.
              </h3>
              <p className="text-[16px] md:text-[18px] text-[#475569] leading-[1.6] mb-8">
                We believe in creating beautiful spaces without compromising the earth. That’s why we actively choose eco-conscious materials for our frames and packaging.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-[15px] font-[500] text-[#334155]">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#10B981]">
                    <Leaf className="w-5 h-5" />
                  </div>
                  Responsibly Sourced Wood
                </li>
                <li className="flex items-center gap-4 text-[15px] font-[500] text-[#334155]">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#3B82F6]">
                    <Package className="w-5 h-5" />
                  </div>
                  100% Recyclable Packaging
                </li>
                <li className="flex items-center gap-4 text-[15px] font-[500] text-[#334155]">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#8B5CF6]">
                    <Droplets className="w-5 h-5" />
                  </div>
                  Low-VOC Inks & Finishes
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 md:order-2 relative aspect-square md:aspect-[4/5] rounded-[24px] overflow-hidden shadow-lg"
            >
              <Image
                src="/images/templates/wedding-template.jpeg"
                alt="Beautiful frame highlighting sustainable materials"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[24px]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-20 md:py-24 container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h3 className="text-[28px] font-[800] text-[#0F172A] tracking-tight">Frequently Asked Questions</h3>
        </div>
        <div className="space-y-4">
          <details className="group rounded-[16px] border border-[#E2E8F0] bg-white p-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-[16px] font-[600] text-[#0F172A]">
              What is your return policy?
              <span className="shrink-0 rounded-full bg-gray-50 p-1.5 text-gray-900 group-open:-rotate-180 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </span>
            </summary>
            <p className="mt-4 leading-relaxed text-[#64748B] text-[15px]">
              We accept returns within 7 days for damaged or incorrect items. Personalized and custom frames are carefully made to order and are non-returnable.
            </p>
          </details>
          
          <details className="group rounded-[16px] border border-[#E2E8F0] bg-white p-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-[16px] font-[600] text-[#0F172A]">
              Do you ship internationally?
              <span className="shrink-0 rounded-full bg-gray-50 p-1.5 text-gray-900 group-open:-rotate-180 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </span>
            </summary>
            <p className="mt-4 leading-relaxed text-[#64748B] text-[15px]">
              Currently, we ship within India. International shipping options will be available soon as we expand our operations.
            </p>
          </details>
          
          <details className="group rounded-[16px] border border-[#E2E8F0] bg-white p-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-[16px] font-[600] text-[#0F172A]">
              Can I request custom sizes?
              <span className="shrink-0 rounded-full bg-gray-50 p-1.5 text-gray-900 group-open:-rotate-180 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </span>
            </summary>
            <p className="mt-4 leading-relaxed text-[#64748B] text-[15px]">
              Yes — you can visit our custom orders section to request bespoke sizes and finishes for any artwork or photograph.
            </p>
          </details>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-24 md:py-32 bg-white text-center border-t border-[#F1F5F9]">
        <div className="container mx-auto px-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[32px] md:text-[44px] font-[800] text-[#0F172A] leading-[1.1] tracking-tight mb-4">
              Your memories deserve a beautiful frame.
            </h2>
            <p className="text-[16px] md:text-[18px] text-[#64748B] mb-10">
              Explore our collection or create something uniquely yours.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/frames" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-12 sm:h-14 px-8 rounded-[12px] bg-[#3B82F6] hover:bg-[#2563EB] text-white font-[500] text-[15px] shadow-[0_4px_14px_rgba(59,130,246,0.3)] transition-all duration-300">
                  Explore Frames
                </Button>
              </Link>
              <Link href="/custom" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-12 sm:h-14 px-8 rounded-[12px] border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] font-[500] text-[15px] transition-all duration-300">
                  Create a Custom Frame
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}