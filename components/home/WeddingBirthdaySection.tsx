"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Heart,
  Cake,
  Users,
  Package,
  MessageCircle,
  Gift,
  ImageIcon,
  Palette,
} from "lucide-react";

const CARDS = [
  {
    href: "/custom-frame/wedding",
    image: "/images/templates/wedding-template.jpeg",
    alt: "Wedding Frame Template",
    eyebrow: "For Couples",
    title: "Wedding Frames",
    description:
      "Preserve your most cherished moments in a frame crafted with care. Our design team transforms your photo into a timeless keepsake.",
    icon: Heart,
    tags: [
      { icon: Palette, label: "Custom Design" },
      { icon: Users, label: "Expert Team" },
      { icon: Package, label: "A4 Size" },
    ],
    cta: "Create Wedding Frame",
    accent: "from-blue-600 to-blue-500",
  },
  {
    href: "/custom-frame/birthday",
    image: "/images/templates/birthday-template.jpg",
    alt: "Birthday Frame Template",
    eyebrow: "For Celebrations",
    title: "Birthday Frames",
    description:
      "Turn a birthday into a memory that lasts forever. Upload a photo, add a message, and we'll handle the rest.",
    icon: Cake,
    tags: [
      { icon: ImageIcon, label: "Your Photo" },
      { icon: MessageCircle, label: "Custom Message" },
      { icon: Gift, label: "A4 Size" },
    ],
    cta: "Create Birthday Frame",
    accent: "from-blue-500 to-blue-400",
  },
];

const PROCESS = [
  { icon: ImageIcon, step: "01", title: "Upload Photo", description: "Share your favourite image with us" },
  { icon: Palette, step: "02", title: "Choose Style", description: "Pick from curated frame designs" },
  { icon: Users, step: "03", title: "We Design", description: "Our team crafts your frame" },
  { icon: Package, step: "04", title: "Delivered", description: "Premium print at your door" },
];

export default function WeddingBirthdaySection() {
  return (
    <section
      className="relative py-24 sm:py-32 lg:py-40 overflow-hidden bg-white dark:bg-gray-950"
      aria-labelledby="occasions-heading"
    >
      {/* Background ambience */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 dark:via-blue-700/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 dark:via-blue-700/40 to-transparent" />
        <div className="absolute -top-60 -right-60 w-[700px] h-[700px] rounded-full bg-blue-100/50 dark:bg-blue-950/25 blur-[120px]" />
        <div className="absolute -bottom-60 -left-60 w-[600px] h-[600px] rounded-full bg-blue-50/60 dark:bg-blue-950/15 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="max-w-3xl mb-20 sm:mb-24 lg:mb-28"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-6"
          >
            
          </motion.div>

          <h2
            id="occasions-heading"
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.03em] text-gray-950 dark:text-white leading-[1.05] mb-6"
          >
            Frames made for{" "}
            <span className="text-blue-600 dark:text-blue-400">
              your moments
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl font-light">
            Upload your photo, add a personal message, and our design team will
            create a stunning custom frame delivered to your door.
          </p>
        </motion.div>

        {/* ── Cards ── */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={card.href} aria-label={card.cta}>
                  <div className="overflow-hidden rounded-[28px] bg-white ring-1 ring-gray-200/80 group-hover:ring-blue-400/50 transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-blue-100/60">

                    {/* Image */}
                    <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
                      <Image
                        src={card.image}
                        alt={card.alt}
                        fill
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      {/* Eyebrow + badge over image */}
                      <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                        <span className="text-white/80 text-[11px] font-semibold tracking-[0.18em] uppercase drop-shadow">
                          {card.eyebrow}
                        </span>
                        <span className="bg-blue-600 text-white text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1 rounded-full">
                          New
                        </span>
                      </div>
                    </div>

                    {/* Content panel */}
                    <div className="p-5 sm:p-6">
                      {/* Icon + Title */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.accent} flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20`}>
                          <Icon className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                          {card.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-gray-500 text-sm leading-relaxed mb-4 max-w-sm">
                        {card.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {card.tags.map((tag) => {
                          const TagIcon = tag.icon;
                          return (
                            <span
                              key={tag.label}
                              className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-[11px] font-medium px-2.5 py-1 rounded-full border border-blue-100"
                            >
                              <TagIcon className="h-2.5 w-2.5" aria-hidden="true" />
                              {tag.label}
                            </span>
                          );
                        })}
                      </div>

                      {/* CTA row */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group/cta">
                          <span>{card.cta}</span>
                          <ArrowRight
                            className="h-3.5 w-3.5 group-hover/cta:translate-x-1.5 transition-transform duration-200"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-600 transition-all duration-300">
                          <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ── Process strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="mt-20 sm:mt-24 lg:mt-28"
        >
          {/* Divider */}
          <div className="flex items-center gap-5 mb-14 sm:mb-16">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200 dark:to-gray-800" />
            <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-gray-400 dark:text-gray-500 whitespace-nowrap">
              How it works
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200 dark:to-gray-800" />
          </div>

          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {/* Connector line — desktop only */}
            <div
              className="hidden lg:block absolute top-5 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-200/60 via-blue-300/40 to-blue-200/60 dark:from-blue-800/50 dark:via-blue-700/30 dark:to-blue-800/50"
              aria-hidden="true"
            />

            {PROCESS.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.25 + i * 0.1 }}
                  viewport={{ once: true }}
                  className="group flex flex-col items-start lg:items-center text-left lg:text-center"
                >
                  {/* Icon circle */}
                  <div className="relative mb-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-gray-900 border-2 border-blue-200 dark:border-blue-800 flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-600 transition-all duration-300 shadow-sm group-hover:shadow-blue-500/25 group-hover:shadow-md relative z-10">
                      <StepIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                    </div>
                  </div>

                  <p className="text-[10px] font-bold tracking-[0.18em] text-blue-500 dark:text-blue-500 uppercase mb-1.5">
                    {step.step}
                  </p>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1 tracking-tight">
                    {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20"
        >
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-blue-600 px-8 sm:px-12 py-10 sm:py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-400/20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-blue-800/30 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.07)_0%,_transparent_60%)]" />
            </div>

            <div className="relative z-10">
              <p className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1.5">
                Ready to create something special?
              </p>
              <p className="text-blue-200/80 text-sm sm:text-base font-light">
                Trusted by thousands of happy customers across India.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3 flex-shrink-0">
              <Link href="/custom-frame/wedding">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 bg-white/10 border-white/25 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm transition-all duration-200"
                >
                  <Heart className="h-4 w-4" aria-hidden="true" />
                  Wedding
                </Button>
              </Link>
              <Link href="/custom-frame/birthday">
                <Button
                  size="lg"
                  className="gap-2 bg-white text-blue-600 hover:bg-blue-50 shadow-xl shadow-blue-900/30 font-semibold transition-all duration-200"
                >
                  <Cake className="h-4 w-4" aria-hidden="true" />
                  Birthday
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
