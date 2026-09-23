"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PremiumVisitorPopup({
  isOpen,
  onClose,
  onSuccess,
  title = "Unlock Your Perfect Frame",
  subtitle = "Enter your details to receive personalized frame recommendations and exclusive updates.",
  eyebrow = "Let's stay connected",
  sourceOverride,
  triggerOverride,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  sourceOverride?: string;
  triggerOverride?: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }

    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);

    try {
      // Gather engagement stats from localStorage since we track it on client now
      const productViews = parseInt(localStorage.getItem("fk_visitor_product_views") || "0", 10);
      const cartActivity = localStorage.getItem("fk_visitor_cart_active") === "true";
      const source = sourceOverride || "organic"; // We can expand this later if we parse referrers
      const trigger = triggerOverride || "engagement";

      const res = await fetch("/api/visitor/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name.trim(), 
          phone: digitsOnly,
          productViews,
          cartActivity,
          source,
          trigger
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setSuccess(true);
      
      // Let the parent component know we succeeded so it can permanently suppress the popup
      onSuccess();
      
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Parent component (Tracker) will handle dismissal logic
    onClose();
    // Clear state in case the component stays mounted
    setTimeout(() => {
      setName("");
      setPhone("");
      setError("");
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay - NO BLUR as per requirements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/25"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex flex-col justify-end sm:justify-center sm:items-center sm:p-4 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* The actual card */}
            <div 
              className="w-full sm:max-w-[520px] pointer-events-auto bg-white sm:rounded-[28px] rounded-t-[28px] shadow-2xl border border-black/5"
              style={{ paddingBottom: "max(env(safe-area-inset-bottom), 1rem)" }}
            >
              <div className="relative p-6 sm:p-10">
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute right-4 top-4 sm:right-6 sm:top-6 flex h-9 w-9 items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4 text-black/70" />
                </button>

                {success ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center text-center space-y-5 py-12"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 ring-8 ring-green-50/50">
                      <Check className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold tracking-tight text-slate-900">Thanks, {name}!</h3>
                      <p className="text-slate-500">We&apos;ll make your FrameKart experience seamless.</p>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-7 pt-2">
                    <div className="space-y-3">
                      {eyebrow && (
                        <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                          {eyebrow}
                        </span>
                      )}
                      <h3 id="modal-title" className="text-3xl font-semibold tracking-tight text-slate-900 leading-tight whitespace-pre-line">
                        {title}
                      </h3>
                      <p className="text-base text-slate-500 pt-1 whitespace-pre-line">
                        {subtitle}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-12 sm:h-14 bg-white border-slate-200 rounded-xl px-4 text-base shadow-sm focus-visible:ring-primary/20 transition-all placeholder:text-slate-400"
                          disabled={loading}
                          aria-label="Your name"
                        />
                      </div>
                      <div>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="h-12 sm:h-14 bg-white border-slate-200 rounded-xl px-4 text-base shadow-sm focus-visible:ring-primary/20 transition-all placeholder:text-slate-400"
                          disabled={loading}
                          aria-label="Phone number"
                        />
                      </div>
                    </div>

                    {error && (
                      <p className="text-sm font-medium text-red-500">{error}</p>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full h-12 sm:h-14 rounded-xl text-base font-medium shadow-sm transition-all" 
                      disabled={loading}
                    >
                      {loading ? "Please wait..." : "Continue →"}
                    </Button>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <p className="text-center text-[13px] text-slate-400">
                        Your details are safe with us.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
