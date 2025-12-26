"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Award, Users, TrendingUp } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
  }),
};

function Stat({ icon: Icon, title, subtitle, idx = 0 }: any) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      custom={idx}
      className="rounded-2xl bg-white/60 backdrop-blur border p-6 text-center shadow-sm"
    >
      <div className="flex items-center justify-center mb-3">
        <Icon className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
    </motion.div>
  );
}

function TimelineItem({ title, date, description, idx }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.12 }}
      className="relative pl-6"
    >
      <div className="absolute left-0 top-1 h-3 w-3 rounded-full bg-primary" />
      <p className="text-sm font-medium">{title} <span className="text-xs text-muted-foreground">• {date}</span></p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <main className="container mx-auto px-6 py-16">
      {/* HERO */}
      <section className="grid gap-8 md:grid-cols-2 items-center mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">About FrameKart</p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">We frame memories with care — premium quality, crafted for life</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            FrameKart brings together craftsmanship and contemporary design to help you display what matters most. We create frames that elevate interiors and preserve memories for generations.
          </p>
          
          {/* <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Legal Business Name:</span> DASARABETTU ABDUL RAHIMAN
            </p>
          </div> */}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/frames" className="inline-flex items-center rounded-lg bg-primary px-5 py-3 text-white shadow hover:opacity-95 transition">
              Shop Frames
            </Link>
            <Link href="/contact" className="inline-flex items-center rounded-lg border px-5 py-3 text-sm">
              Contact Us
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="order-first md:order-last"
        >
          <div className="relative mx-auto w-full max-w-md rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/p4.jpeg"
              alt="Frame mockup"
              width={720}
              height={720}
              className="object-cover w-full h-[420px] md:h-[480px]"
            />
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="mb-12">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          <Stat icon={Heart} title="5000+" subtitle="Happy Customers" idx={0} />
          <Stat icon={Award} title="Premium" subtitle="Quality Guaranteed" idx={1} />
          <Stat icon={Users} title="Expert" subtitle="Craftsmen Team" idx={2} />
          <Stat icon={TrendingUp} title="Fast" subtitle="Growing Business" idx={3} />
        </div>
      </section>

      {/* VALUES + TIMELINE */}
      <section className="mb-12 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Our Values</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold">Quality First</h3>
                  <p className="text-sm text-muted-foreground">We never compromise on materials or craftsmanship. Each frame is inspected before shipping.</p>
                </div>

                <div>
                  <h3 className="font-semibold">Customer Satisfaction</h3>
                  <p className="text-sm text-muted-foreground">Your happiness is our success. We provide fast support and easy returns.</p>
                </div>

                <div>
                  <h3 className="font-semibold">Innovation</h3>
                  <p className="text-sm text-muted-foreground">We explore new designs and techniques to keep our collection fresh.</p>
                </div>

                <div>
                  <h3 className="font-semibold">Sustainability</h3>
                  <p className="text-sm text-muted-foreground">We prioritize eco-friendly materials and responsible sourcing.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Our Journey</h2>
              <div className="space-y-6">
                <TimelineItem idx={0} title="Founded" date="2020" description="Started with a small studio and a big dream to make premium frames accessible." />
                <TimelineItem idx={1} title="First 1000 Orders" date="2021" description="Received love from customers across the country—our first big milestone." />
                <TimelineItem idx={2} title="Expanded Catalogue" date="2023" description="Launched premium and custom collections with new frame materials and prints." />
                <TimelineItem idx={3} title="FrameKart Today" date="2025" description="A trusted name for curated wall art and frames with a growing community." />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SUSTAINABILITY / CTA */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Sustainable Practices</h3>
              <p className="text-sm text-muted-foreground mb-4">We use responsibly sourced wood, recyclable packaging, and low-VOC inks.</p>
              <div className="flex justify-center gap-3">
                <div className="rounded-lg bg-green-50 p-3">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>

                <div className="rounded-lg bg-yellow-50 p-3">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v6" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 14v8" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Learn more about our sourcing and materials on the Sustainability page.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Ready to refresh your walls?</h3>
              <p className="text-sm text-muted-foreground mb-4">Explore curated collections or create a custom frame for your favourite memories.</p>
              <Link href="/frames" className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-white">Shop the Collection</Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* TEAM */}
      {/* <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Meet the Team</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {[
            { name: "Muhammed Sabik", role: "Founder & CEO", img: "/p3.jpeg" },
            // { name: "Ravi Menon", role: "Head of Design", img: "/p4.jpeg" },
            // { name: "Neha Patel", role: "Operations Lead", img: "/p1_gzwl6t.png" },
            // { name: "Siddharth Rao", role: "Customer Experience", img: "/p2.png" },
          ].map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-lg bg-white shadow-sm overflow-hidden">
              <div className="relative h-44 w-full">
                <Image src={m.img} alt={m.name} fill className="object-cover" />
              </div>
              <div className="p-4 text-center">
                <p className="font-semibold">{m.name}</p>
                <p className="text-sm text-muted-foreground">{m.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section> */}

      {/* FAQ / Footer CTA */}
      <section className="mb-24 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <details className="rounded-lg border p-4">
              <summary className="font-medium">What is your return policy?</summary>
              <p className="mt-2 text-sm text-muted-foreground">We accept returns within 7 days for damaged or incorrect items. Personalized frames are non-returnable.</p>
            </details>
            <details className="rounded-lg border p-4">
              <summary className="font-medium">Do you ship internationally?</summary>
              <p className="mt-2 text-sm text-muted-foreground">Currently we ship within India. International shipping will be available soon.</p>
            </details>
            <details className="rounded-lg border p-4">
              <summary className="font-medium">Can I request custom sizes?</summary>
              <p className="mt-2 text-sm text-muted-foreground">Yes — visit our custom orders section to request bespoke sizes and finishes.</p>
            </details>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 text-center">
              <h4 className="font-semibold">Need help choosing?</h4>
              <p className="text-sm text-muted-foreground mb-3">Our design team can help you pick the perfect frame for your space.</p>
              <Link href="/contact" className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-white">Get Design Help</Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <h4 className="font-semibold">Newsletter</h4>
              <p className="text-sm text-muted-foreground mb-3">Subscribe for new arrivals and exclusive discounts.</p>
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                <input className="flex-1 rounded-lg border px-3 py-2" placeholder="Your email" />
                <button className="rounded-lg bg-black px-4 py-2 text-white">Subscribe</button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}