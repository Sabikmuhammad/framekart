"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function WhatsAppLoginPage() {
  const router = useRouter();
  const { refreshSession, isAuthenticated } = useAuth();

  const [step, setStep] = useState<"PHONE" | "OTP" | "SUCCESS">("PHONE");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get("redirectUrl");
      router.replace(redirectUrl || "/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && step === "OTP") {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown, step]);

  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (phone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/whatsapp/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone }),
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setStep("OTP");
        setCountdown(60);
        setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
      } else {
        setErrorMsg(data.error || "Failed to send verification code. Please try again.");
      }
    } catch (error) {
      setErrorMsg("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (currentOtp: string) => {
    if (currentOtp.length < 6) {
      setErrorMsg("Please enter the 6-digit code.");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/whatsapp/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone, otp: currentOtp }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStep("SUCCESS");
        await refreshSession();
        
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get("redirectUrl");
        
        setTimeout(() => {
          if (redirectUrl && redirectUrl.startsWith("/")) {
            router.push(redirectUrl);
          } else {
            router.push("/");
          }
        }, 1500);
      } else {
        if (data.error?.toLowerCase().includes("expired")) {
          setErrorMsg("This code has expired. Request a new code to continue.");
        } else if (data.error?.toLowerCase().includes("too many")) {
          setErrorMsg("Too many attempts. Please request a new verification code.");
        } else {
          setErrorMsg("The verification code is incorrect. Please try again.");
        }
      }
    } catch (error) {
      setErrorMsg("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];

    // Handle paste
    if (value.length > 1) {
      const pastedData = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || "";
      }
      setOtp(newOtp);
      const nextIndex = Math.min(pastedData.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      if (newOtp.join("").length === 6) {
        handleVerifyOtp(newOtp.join(""));
      }
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value !== "" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
    
    if (newOtp.join("").length === 6) {
      handleVerifyOtp(newOtp.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  if (isAuthenticated) return null;

  return (
    <div 
      className="min-h-[100dvh] relative overflow-hidden flex flex-col justify-center items-center p-5 sm:p-6 dark:bg-[#0a0a0a]"
      style={{
        background: 'radial-gradient(circle at 20% 25%, rgba(59,130,246,0.035), transparent 28%), radial-gradient(circle at 80% 70%, rgba(59,130,246,0.025), transparent 30%), #FFFFFF'
      }}
    >
      {/* Floating Background Decorations (Real FrameKart Imagery) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top Left: Large frame outline */}
        <motion.div
           animate={{ y: [0, -10, 0], rotate: [0, -2, 0] }}
           transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
           className="absolute -top-[5%] -left-[5%] md:top-[5%] md:left-[5%] w-[200px] h-[250px] md:w-[300px] md:h-[350px] border border-[#0F172A] border-opacity-5 rounded-sm bg-white/35 shadow-[0_20px_60px_rgba(15,23,42,0.025)]"
        />
        
        {/* Top Right: Real Framed Photo */}
        <motion.div
           animate={{ y: [0, -12, 0], rotate: [0, 1.5, 0] }}
           transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
           className="absolute top-[10%] -right-[10%] md:top-[12%] md:right-[8%] w-[180px] h-[220px] md:w-[220px] md:h-[280px] rounded-lg overflow-hidden shadow-[0_15px_40px_rgba(15,23,42,0.04)] opacity-30 saturate-75 blur-[1px] md:blur-[2px]"
        >
          <Image src="/images/categories/p2.png" alt="Frame" fill className="object-cover" />
        </motion.div>

        {/* Bottom Left: Another Real Photo */}
        <motion.div
           animate={{ y: [0, -8, 0] }}
           transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
           className="absolute bottom-[5%] -left-[5%] md:bottom-[10%] md:left-[10%] w-[160px] h-[160px] md:w-[200px] md:h-[200px] rounded-md overflow-hidden opacity-[0.25] saturate-75 shadow-[0_15px_40px_rgba(15,23,42,0.04)] blur-[1px]"
        >
          <Image src="/images/categories/p7.png" alt="Frame" fill className="object-cover" />
        </motion.div>

        {/* Bottom Right: Frame Corner / Empty Frame */}
        <motion.div
           animate={{ y: [0, -15, 0], rotate: [0, -1, 0] }}
           transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
           className="absolute -bottom-[10%] -right-[5%] md:bottom-[15%] md:right-[15%] w-[180px] h-[240px] md:w-[240px] md:h-[320px] border border-[#64748B] border-opacity-10 rounded-lg shadow-[0_20px_60px_rgba(15,23,42,0.02)]"
        />
      </div>

      <div 
        className="w-full max-w-[430px] md:max-w-[500px] mx-auto bg-white dark:bg-[#141414] rounded-[28px] border border-[#0F172A] border-opacity-[0.07] dark:border-white/10 shadow-[0_20px_55px_rgba(15,23,42,0.08)] md:shadow-[0_30px_80px_rgba(15,23,42,0.10),0_8px_30px_rgba(15,23,42,0.05)] dark:shadow-none p-[28px] md:p-[48px] relative flex flex-col z-10"
      >
        {/* Brand Logo inside the card (Significantly Larger) */}
        <div className="mb-8 md:mb-10 flex justify-center pt-2">
          <Link href="/" className="inline-block">
            <Image src="/images/branding/Frame-2.png" alt="FrameKart" width={220} height={70} className="w-[180px] md:w-[220px] h-auto object-contain dark:invert" priority />
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {step === "PHONE" ? (
            <motion.div
              key="phone-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col flex-1"
            >
              <div className="mb-8 md:mb-10 text-center">
                <h1 className="text-[32px] sm:text-[36px] md:text-[40px] font-bold text-[#0F172A] dark:text-white tracking-tight leading-[1.1] mb-2.5">
                  Welcome back.
                </h1>
                <p className="text-[15px] sm:text-[17px] md:text-[18px] text-[#64748B] dark:text-gray-400 leading-relaxed max-w-[280px] mx-auto">
                  Sign in to continue to your FrameKart account.
                </p>
              </div>

              <form onSubmit={handleRequestOtp} className="space-y-6">
                <div className="space-y-2.5">
                  <label htmlFor="phone" className="block text-[14px] font-semibold text-[#334155] dark:text-gray-200">
                    Mobile number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <span className="text-gray-900 dark:text-white font-medium text-[16px]">+91</span>
                      <div className="h-5 w-[1px] bg-gray-200 dark:bg-gray-700 mx-3" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="block w-full pl-[5rem] pr-4 h-[56px] bg-[#FAFBFC] dark:bg-[#1a1a1a] border border-[#E2E8F0] dark:border-gray-800 rounded-[14px] text-[#0F172A] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#3B82F6] focus:ring-[4px] focus:ring-[#3B82F6]/10 transition-all text-[16px]"
                      autoFocus
                      aria-label="Mobile number"
                    />
                  </div>
                  {errorMsg && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[14px] text-red-500 font-medium">
                      {errorMsg}
                    </motion.p>
                  )}
                  <p className="text-[13px] sm:text-[14px] text-gray-500 dark:text-gray-500 pt-1">
                    We&apos;ll send a verification code to your WhatsApp.
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full h-[56px] rounded-[14px] md:rounded-[16px] text-[16px] font-semibold shadow-[0_8px_24px_rgba(59,130,246,0.16)] transition-all active:scale-[0.98] bg-[#3B82F6] hover:bg-blue-600 text-white"
                    disabled={isLoading || phone.length < 10}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Sending code...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Continue <ArrowRight className="w-4 h-4 ml-2" />
                      </span>
                    )}
                  </Button>
                </div>
                
                <div className="pt-4 flex items-center justify-center text-[13px] sm:text-[14px] text-gray-500 dark:text-gray-400 font-medium">
                  <span className="inline-flex items-center">
                    <span className="mr-2 text-[#22C55E] text-[10px]">◉</span>
                    Secure verification via WhatsApp
                  </span>
                </div>
              </form>
            </motion.div>
          ) : step === "SUCCESS" ? (
            <motion.div
              key="success-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center justify-center text-center py-8"
            >
              <div className="w-16 h-16 bg-[#3B82F6] rounded-full flex items-center justify-center mb-6 text-white shadow-lg">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-[28px] sm:text-[32px] font-bold text-[#0F172A] dark:text-white tracking-tight leading-[1.1] mb-2">
                You&apos;re signed in.
              </h1>
              <p className="text-[15px] sm:text-[17px] text-[#64748B] dark:text-gray-400">
                Welcome back to FrameKart.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="otp-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col flex-1"
            >
              <div className="mb-8 text-center relative">
                <button
                  onClick={() => setStep("PHONE")}
                  className="absolute left-0 top-0 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-gray-800 transition-colors h-10 w-10 rounded-full active:bg-gray-200 dark:active:bg-gray-700"
                  disabled={isLoading}
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-[30px] sm:text-[34px] md:text-[36px] font-bold text-[#0F172A] dark:text-white tracking-tight leading-[1.1] mb-2.5">
                  Check WhatsApp
                </h1>
                <p className="text-[15px] sm:text-[17px] text-[#64748B] dark:text-gray-400 leading-relaxed max-w-[280px] mx-auto">
                  We&apos;ve sent a 6-digit code to <span className="font-semibold text-[#0F172A] dark:text-white">+91 {phone}</span>.
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between gap-1.5 sm:gap-2 mb-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { otpInputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-[42px] h-[52px] min-[375px]:w-[48px] min-[375px]:h-[56px] sm:w-[54px] sm:h-[60px] text-center text-[22px] font-semibold bg-[#FAFBFC] dark:bg-[#1a1a1a] border border-[#E2E8F0] dark:border-gray-800 rounded-[12px] text-[#0F172A] dark:text-white focus:outline-none focus:border-[#3B82F6] focus:ring-[4px] focus:ring-[#3B82F6]/10 transition-all shadow-sm"
                        disabled={isLoading}
                        aria-label={`Digit ${index + 1}`}
                      />
                    ))}
                  </div>
                  {errorMsg && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[14px] text-red-500 font-medium text-center mt-3">
                      {errorMsg}
                    </motion.p>
                  )}
                </div>

                <div className="flex flex-col items-center space-y-6">
                  <Button
                    onClick={() => handleVerifyOtp(otp.join(""))}
                    className="w-full h-[56px] rounded-[14px] md:rounded-[16px] text-[16px] font-semibold shadow-[0_8px_24px_rgba(59,130,246,0.16)] transition-all active:scale-[0.98] bg-[#3B82F6] hover:bg-blue-600 text-white"
                    disabled={isLoading || otp.join("").length < 6}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Verifying...
                      </span>
                    ) : (
                      "Verify code"
                    )}
                  </Button>

                  <div className="text-[14px] font-medium">
                    <span className="text-[#64748B] dark:text-gray-400">Didn&apos;t receive it? </span>
                    <button
                      onClick={() => handleRequestOtp()}
                      disabled={countdown > 0 || isLoading}
                      className={`transition-colors min-h-[44px] px-2 -mx-2 ${
                        countdown > 0 
                          ? "text-gray-400 cursor-default" 
                          : "text-[#3B82F6] hover:text-blue-600 dark:text-blue-400 hover:underline"
                      }`}
                    >
                      {countdown > 0 ? `Resend in 00:${countdown.toString().padStart(2, '0')}` : "Resend code"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
