const fs = require('fs');
const file = '/Users/muhammadsabik/Desktop/framekartweb/app/(auth)/whatsapp-login/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Right side container
content = content.replace(
  '<div className="flex-1 flex flex-col justify-center px-5 sm:px-6 py-8 sm:py-12 lg:px-16 relative pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">',
  `<div 
        className="flex-1 flex flex-col px-6 lg:justify-center lg:px-16 relative overflow-y-auto"
        style={{ 
          paddingTop: 'max(24px, env(safe-area-inset-top))',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom))'
        }}
      >`
);

content = content.replace(
  '<div className="w-full max-w-[420px] mx-auto">',
  '<div className="w-full max-w-[420px] mx-auto flex-1 flex flex-col lg:justify-center pb-8">'
);

content = content.replace(
  '<div className="mb-8 lg:hidden">',
  '<div className="mb-10 lg:hidden">'
);

content = content.replace(
  'width={120} height={40} className="h-8 w-auto object-contain dark:invert"',
  'width={140} height={48} className="h-9 w-auto object-contain dark:invert"'
);

// 2. Welcome text
content = content.replace(
  '<h1 className="text-2xl min-[375px]:text-[28px] sm:text-[32px] font-semibold text-gray-900 dark:text-white tracking-tight mb-2 sm:mb-3">',
  '<h1 className="text-[32px] sm:text-[36px] font-semibold text-gray-900 dark:text-white tracking-tight mb-2 leading-[1.1]">'
);

content = content.replace(
  '<p className="text-gray-600 dark:text-gray-400 text-base">',
  '<p className="text-[15px] sm:text-[17px] text-gray-500 dark:text-gray-400 leading-relaxed">'
);

// 3. Input group
content = content.replace(
  '<div className="space-y-3">',
  '<div className="space-y-2.5">'
);

content = content.replace(
  '<label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">',
  '<label htmlFor="phone" className="block text-[15px] font-medium text-gray-900 dark:text-gray-200">'
);

content = content.replace(
  '<span className="text-gray-500 dark:text-gray-400 font-medium">+91</span>\n                        <div className="h-5 w-[1px] bg-gray-200 dark:bg-gray-700 mx-3" />',
  '<span className="text-gray-900 dark:text-white font-medium text-[17px]">+91</span>\n                        <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-800 mx-3" />'
);

content = content.replace(
  'className="block w-full pl-[4.5rem] pr-4 py-4 bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary transition-all text-lg shadow-sm"',
  'className="block w-full pl-[5rem] pr-4 h-14 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-[17px] shadow-sm"'
);

// 4. Button & WhatsApp
content = content.replace(
  'className="w-full h-14 rounded-xl text-base font-medium shadow-sm transition-all active:scale-[0.98]"',
  'className="w-full h-14 rounded-2xl text-[16px] font-semibold shadow-sm transition-all active:scale-[0.98]"'
);

content = content.replace(
  '<Button',
  '<div className="pt-2">\n                    <Button'
);

content = content.replace(
  '</Button>',
  '</Button>\n                  </div>'
);

const oldWhatsapp = `<div className="pt-6 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Secure verification via WhatsApp
                    </span>
                  </div>`;
const newWhatsapp = `<div className="pt-4 flex items-center justify-center text-[13px] sm:text-[14px] text-gray-500 dark:text-gray-400 font-medium">
                    <span className="inline-flex items-center">
                      <span className="mr-2 text-green-500 text-[10px]">◉</span>
                      Secure verification via WhatsApp
                    </span>
                  </div>`;
content = content.replace(oldWhatsapp, newWhatsapp);

// 5. OTP Step
content = content.replace(
  '<button\n                    onClick={() => setStep("PHONE")}\n                    className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-6 sm:mb-8 -ml-2 p-2 min-h-[44px] min-w-[44px]"\n                    disabled={isLoading}\n                  >\n                    <ArrowLeft className="w-4 h-4 mr-1.5" /> Back\n                  </button>',
  `<button
                    onClick={() => setStep("PHONE")}
                    className="flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-6 sm:mb-8 -ml-2 h-11 w-11 rounded-full active:bg-gray-200 dark:active:bg-gray-700"
                    disabled={isLoading}
                    aria-label="Go back"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>`
);

content = content.replace(
  '<h1 className="text-2xl min-[375px]:text-[28px] sm:text-[32px] font-semibold text-gray-900 dark:text-white tracking-tight mb-2 sm:mb-3">',
  '<h1 className="text-[32px] sm:text-[36px] font-semibold text-gray-900 dark:text-white tracking-tight mb-2 leading-[1.1]">'
);

content = content.replace(
  '<p className="text-gray-600 dark:text-gray-400 text-base">',
  '<p className="text-[15px] sm:text-[17px] text-gray-500 dark:text-gray-400 leading-relaxed">'
);

content = content.replace(
  'className="w-10 h-12 min-[375px]:w-12 min-[375px]:h-14 sm:w-14 sm:h-16 text-center text-lg min-[375px]:text-xl sm:text-2xl font-semibold bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary transition-all shadow-sm"',
  'className="w-[45px] h-[52px] min-[375px]:w-[50px] min-[375px]:h-[56px] sm:w-[56px] sm:h-[64px] text-center text-[22px] sm:text-2xl font-medium bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm"'
);

content = content.replace(
  'className="w-full h-14 rounded-xl text-base font-medium shadow-sm transition-all active:scale-[0.98]"',
  'className="w-full h-14 rounded-2xl text-[16px] font-semibold shadow-sm transition-all active:scale-[0.98]"'
);

// 6. Success Step
const successHTML = `            ) : step === "SUCCESS" ? (
              <motion.div
                key="success-step"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6 text-white shadow-lg">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight mb-2">
                  You're signed in.
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Welcome back to FrameKart.
                </p>
              </motion.div>
            ) : (`;
content = content.replace('            ) : (', successHTML);

fs.writeFileSync(file, content);
console.log('ui patched');
