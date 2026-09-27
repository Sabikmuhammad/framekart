"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, FileText, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

export default function BulkOrderSuccessPage() {
  const searchParams = useSearchParams();
  const type = searchParams?.get("type");
  const orderId = searchParams?.get("id");

  const isQuote = type === "quote";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden text-center"
      >
        <div className="p-8 pb-6 bg-green-50 dark:bg-green-900/20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15, delay: 0.2 }}
            className="w-20 h-20 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isQuote ? "Quote Requested Successfully!" : "Bulk Order Confirmed!"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isQuote 
              ? "We have received your bulk order requirements. Our team will review the details and get back to you with a custom quotation shortly."
              : "Thank you for your bulk order. Your payment has been received and production will begin soon."}
          </p>
        </div>

        <div className="p-8 pt-6 space-y-6 bg-white dark:bg-gray-900 border-t">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Order Reference</p>
              <p className="font-mono font-medium text-sm text-gray-900 dark:text-white">
                {orderId || "Pending"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/profile">
              <Button className="w-full h-12 text-base rounded-xl">
                Track Status
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full h-12 text-base rounded-xl">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
