const fs = require('fs');
const file = '/Users/muhammadsabik/Desktop/framekartweb/app/(auth)/whatsapp-login/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const newReturn = `  return (
    <div className="min-h-[100dvh] flex flex-col justify-center items-center p-5 sm:p-6 bg-gradient-to-b from-[#FAFBFC] to-[#F4F6F8] dark:from-[#0a0a0a] dark:to-[#111]">
      <div 
        className="w-full max-w-[430px] mx-auto bg-white dark:bg-[#141414] rounded-[24px] border border-slate-900/5 dark:border-white/5 shadow-[0_20px_60px_rgba(15,23,42,0.10)] dark:shadow-none p-6 min-[375px]:p-8 relative overflow-hidden flex flex-col"
      >
        {/* Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-500" />
        
        {/* Brand Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/" className="inline-block">
            <Image src="/images/branding/Frame-2.png" alt="FrameKart" width={130} height={44} className="h-8 w-auto object-contain dark:invert" />
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
              <div className="mb-8 text-center">
                <h1 className="text-[30px] sm:text-[34px] font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-2.5">
                  Welcome back.
                </h1>
                <p className="text-[15px] sm:text-[16px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-[280px] mx-auto">
                  Sign in to continue to your FrameKart account.
                </p>
              </div>

              <form onSubmit={handleRequestOtp} className="space-y-6">
                <div className="space-y-2.5">
                  <label htmlFor="phone" className="block text-[14px] font-semibold text-gray-700 dark:text-gray-200">
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
                      onChange={(e) => setPhone(e.target.value.replace(/\\D/g, "").slice(0, 10))}
                      className="block w-full pl-[5rem] pr-4 h-[56px] bg-[#F8FAFC] dark:bg-[#1a1a1a] border border-[#E2E8F0] dark:border-gray-800 rounded-[14px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-[4px] focus:ring-blue-500/10 transition-all text-[16px]"
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
                    className="w-full h-[56px] rounded-[14px] text-[16px] font-semibold shadow-[0_8px_20px_rgba(59,130,246,0.18)] transition-all active:scale-[0.98] bg-blue-500 hover:bg-blue-600 text-white"
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
                    <span className="mr-2 text-green-500 text-[10px]">◉</span>
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
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6 text-white shadow-lg">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                You&apos;re signed in.
              </h1>
              <p className="text-[15px] text-gray-500 dark:text-gray-400">
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
                <h1 className="text-[30px] sm:text-[34px] font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-2.5">
                  Check WhatsApp
                </h1>
                <p className="text-[15px] sm:text-[16px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-[280px] mx-auto">
                  We&apos;ve sent a 6-digit code to <span className="font-semibold text-gray-900 dark:text-white">+91 {phone}</span>.
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
                        className="w-[42px] h-[52px] min-[375px]:w-[48px] min-[375px]:h-[56px] sm:w-[54px] sm:h-[60px] text-center text-[22px] font-semibold bg-[#F8FAFC] dark:bg-[#1a1a1a] border border-[#E2E8F0] dark:border-gray-800 rounded-[12px] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-[4px] focus:ring-blue-500/10 transition-all shadow-sm"
                        disabled={isLoading}
                        aria-label={\`Digit \${index + 1}\`}
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
                    className="w-full h-[56px] rounded-[14px] text-[16px] font-semibold shadow-[0_8px_20px_rgba(59,130,246,0.18)] transition-all active:scale-[0.98] bg-blue-500 hover:bg-blue-600 text-white"
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
                    <span className="text-gray-500 dark:text-gray-400">Didn&apos;t receive it? </span>
                    <button
                      onClick={() => handleRequestOtp()}
                      disabled={countdown > 0 || isLoading}
                      className={\`transition-colors min-h-[44px] px-2 -mx-2 \${
                        countdown > 0 
                          ? "text-gray-400 cursor-default" 
                          : "text-blue-500 hover:text-blue-600 dark:text-blue-400 hover:underline"
                      }\`}
                    >
                      {countdown > 0 ? \`Resend in 00:\${countdown.toString().padStart(2, '0')}\` : "Resend code"}
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
`;

const returnIndex = content.indexOf('  return (');
content = content.substring(0, returnIndex) + newReturn;

fs.writeFileSync(file, content);
console.log('card design patched');
