"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart, Shield, Truck, CreditCard, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const features = [
    { icon: Shield, text: "Secure Payment", color: "text-blue-500" },
    { icon: Truck, text: "Fast Delivery", color: "text-green-500" },
    { icon: CreditCard, text: "Easy Returns", color: "text-purple-500" },
    { icon: Heart, text: "Quality Assured", color: "text-red-500" },
  ];

  const quickLinks = [
    { href: "/frames", label: "Shop Frames" },
    { href: "/custom-frame", label: "Custom Frames" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  const policies = [
    { href: "/shipping-policy", label: "Shipping Policy" },
    { href: "/return-policy", label: "Return Policy" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook", color: "hover:bg-blue-500" },
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:bg-pink-500" },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:bg-sky-500" },
  ];

  return (
    <footer className="relative border-t bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(0_0_0/0.05)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.05)_1px,transparent_0)] [background-size:24px_24px] pointer-events-none" />
      
      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4 py-12 lg:py-16 relative z-10">
        {/* Features Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 lg:mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
            >
              <div className={`p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 ${feature.color}`}>
                <feature.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                FrameKart
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
              Transform your memories into timeless art. Premium quality frames with custom designs, delivered to your doorstep.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-white transition-all ${social.color}`}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="mb-4 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full" />
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary flex items-center gap-2 group transition-colors"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="mb-4 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full" />
              Policies
            </h4>
            <ul className="space-y-3 text-sm">
              {policies.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary flex items-center gap-2 group transition-colors"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="mb-4 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full" />
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400 group">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <a href="mailto:support@framekart.co.in" className="hover:text-primary transition-colors">
                  support@framekart.co.in
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400 group">
                <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <a href="tel:+917259788138" className="hover:text-primary transition-colors">
                  +91 7259788138
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="leading-relaxed">Mangaluru, Karnataka, India</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="pt-8 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
              &copy; {currentYear} FrameKart. All rights reserved. Made with{" "}
              <Heart className="inline h-4 w-4 text-red-500 fill-red-500" /> in India
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-500">
              <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
              <Link href="/privacy" className="hover:text-primary transition-colors">Cookies</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
