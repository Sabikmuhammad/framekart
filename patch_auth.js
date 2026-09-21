const fs = require('fs');
const file = '/Users/muhammadsabik/Desktop/framekartweb/app/(auth)/whatsapp-login/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the step state definition
content = content.replace(
  'const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");',
  'const [step, setStep] = useState<"PHONE" | "OTP" | "SUCCESS">("PHONE");'
);

// Replace handleVerifyOtp success branch
content = content.replace(
  /if \(response\.ok && data\.success\) \{[\s\S]*?\} else \{/g,
  `if (response.ok && data.success) {
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
      } else {`
);

// Replace main return rendering
content = content.replace(
  '<div className="min-h-[100dvh] flex flex-col lg:flex-row bg-white dark:bg-[#0a0a0a]">',
  '<div className="min-h-[100dvh] flex flex-col lg:flex-row bg-white dark:bg-[#0a0a0a]">'
);

fs.writeFileSync(file, content);
console.log('patched');
