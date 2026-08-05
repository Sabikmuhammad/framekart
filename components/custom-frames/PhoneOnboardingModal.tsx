"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Phone, User, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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

  const handleCancel = async () => {
    try {
      await fetch("/api/custom-frame/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "modal_cancelled" }),
      });
    } catch (e) {
      console.error("Tracking error:", e);
    }

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
        className="max-w-[440px] rounded-[24px] border-none bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] focus:outline-none sm:max-w-[440px] [&>button]:hidden"
      >
        <div className="absolute inset-0 -z-10 rounded-[24px] bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Phone className="h-6 w-6 animate-pulse" />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">
            Create Your Custom Frame
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-gray-500 leading-relaxed">
            Before we begin, please enter your mobile number so we can save your design, provide order updates, and offer support whenever you need it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
              Full Name <span className="text-xs text-gray-400 font-normal">(Optional)</span>
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <User className="h-4 w-4" />
              </div>
              <Input
                id="name"
                type="text"
                disabled={loading}
                placeholder="Enter your name"
                className="pl-11 h-12 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 transition-all placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-xs font-medium text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
              Mobile Number <span className="text-red-500 font-bold">*</span>
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pr-2 border-r border-gray-200 text-sm font-semibold text-gray-500">
                +91
              </div>
              <Input
                id="phone"
                type="tel"
                disabled={loading}
                maxLength={10}
                placeholder="Enter your mobile number"
                className="pl-14 h-12 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 transition-all placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                {...register("phone")}
              />
            </div>
            {errors.phone && (
              <p className="text-xs font-medium text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {submitError && (
            <div className="rounded-xl bg-red-50 p-3.5 text-xs font-medium text-red-600 border border-red-100">
              {submitError}
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2 sm:flex-row-reverse">
            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full sm:flex-1 rounded-xl bg-blue-600 font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={handleCancel}
              className="h-12 w-full sm:w-auto rounded-xl border border-gray-200 bg-white font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all active:scale-[0.98]"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
