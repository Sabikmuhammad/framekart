"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const onboardingSchema = z.object({
  name: z.string().max(100, "Name must be under 100 characters").optional().or(z.literal("")),
  phone: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits consisting of numbers only"),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export function PhoneOnboardingModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  // Track modal_displayed on mount
  useEffect(() => {
    fetch("/api/custom-frame/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "modal_displayed" }),
    }).catch((err) => console.error("Tracking error:", err));
  }, []);

  const onSubmit = async (data: OnboardingFormData) => {
    setLoading(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/custom-frame/visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsOpen(false);
        // Refresh the page so server-side checks verify the new cookie and remove modal
        router.refresh();
      } else {
        setSubmitError(result.error || "Failed to submit. Please try again.");
      }
    } catch (error) {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Track cancellation in the background without awaiting it
    fetch("/api/custom-frame/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "modal_cancelled" }),
    }).catch((err) => console.error("Tracking error:", err));

    setIsOpen(false);
    // Redirect user back or to home page
    router.push("/");
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="max-w-[460px] w-[92vw] sm:max-w-[460px] p-0 border-none bg-transparent shadow-none [&>button]:hidden overflow-visible"
      >
        {/* Apple/Stripe-style Radial Blue Glow behind the card */}
        <div className="absolute -inset-16 -z-20 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18)_0%,transparent_60%)] pointer-events-none blur-3xl" />

        {/* 1px Gradient Border Wrapper for Premium Glassmorphism Effect */}
        <div className="relative w-full rounded-[28px] p-[1px] bg-gradient-to-b from-white/40 via-white/10 to-blue-500/20 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.12),0_0_1px_1px_rgba(255,255,255,0.4)_inset] overflow-hidden">
          
          {/* Card Body */}
          <div className="rounded-[27px] bg-white/75 dark:bg-slate-900/80 backdrop-blur-xl px-6 py-6 sm:px-7 sm:py-7">
            
            <DialogHeader className="text-center space-y-1">
              {/* FrameKart Actual Corporate Logo */}
              <div className="mx-auto mb-4 flex justify-center">
                <Image
                  src="/images/branding/Frame-2.png"
                  alt="FrameKart"
                  width={160}
                  height={42}
                  priority
                  className="h-10 w-auto object-contain dark:invert"
                />
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Create Your Custom Frame
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
                Before we begin, please enter your mobile number so we can save your design, provide order updates, and offer support whenever you need it.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Full Name <span className="text-[10px] text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    disabled={loading}
                    placeholder="Enter your name"
                    className="w-full h-11 rounded-2xl border-none bg-slate-50 dark:bg-slate-800/40 px-4 text-sm text-gray-900 dark:text-white transition-all placeholder:text-gray-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-[10px] font-medium text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pr-2 border-r border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold text-gray-500">
                    +91
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    disabled={loading}
                    maxLength={10}
                    placeholder="Enter your mobile number"
                    className="w-full h-11 pl-14 rounded-2xl border-none bg-slate-50 dark:bg-slate-800/40 pr-4 text-sm text-gray-900 dark:text-white transition-all placeholder:text-gray-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    {...register("phone")}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[10px] font-medium text-red-500">{errors.phone.message}</p>
                )}
              </div>

              {submitError && (
                <div className="rounded-xl bg-red-50 dark:bg-red-950/20 p-3 text-[11px] font-medium text-red-600 dark:text-red-400 border border-red-100 dark:border-red-950/50">
                  {submitError}
                </div>
              )}

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.01, boxShadow: "0 10px 20px -10px rgba(59,130,246,0.3)" }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-semibold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(59,130,246,0.15)] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Please wait...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={(e) => handleCancel(e)}
                  className="w-full text-center text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mt-3 py-2 cursor-pointer relative z-50"
                >
                  Cancel and return to home
                </button>
              </div>
            </form>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
