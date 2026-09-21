const fs = require('fs');

// 1. app/admin/layout.tsx
let adminLayout = fs.readFileSync('app/admin/layout.tsx', 'utf8');
adminLayout = adminLayout.replace(/import \{ auth \} from "@clerk\/nextjs\/server";/g, 'import { getCurrentUser } from "@/lib/auth/authorization";');
adminLayout = adminLayout.replace(/const \{ userId \} = auth\(\);\s*if \(\!userId\) \{\s*redirect\("\/sign-in"\);\s*\}\s*await dbConnect\(\);\s*const user = await User\.findOne\(\{ clerkId: userId \}\);\s*if \(\!user \|\| user\.role !== "admin"\) \{\s*redirect\("\/"\);\s*\}/g, 
  `const user = await getCurrentUser();\n\n  if (!user || user.role !== "ADMIN") {\n    redirect("/whatsapp-login");\n  }`);
adminLayout = adminLayout.replace(/import User from "@\/models\/User";\n/g, '');
adminLayout = adminLayout.replace(/import dbConnect from "@\/lib\/db";\n/g, '');
fs.writeFileSync('app/admin/layout.tsx', adminLayout);

// 2. app/checkout/page.tsx
let checkoutPage = fs.readFileSync('app/checkout/page.tsx', 'utf8');
checkoutPage = checkoutPage.replace(/import \{ useUser \} from "@clerk\/nextjs";/g, 'import { useAuth } from "@/context/AuthContext";');
checkoutPage = checkoutPage.replace(/const \{ isSignedIn, user \} = useUser\(\);/g, 'const { isAuthenticated: isSignedIn, user } = useAuth();');
checkoutPage = checkoutPage.replace(/router\.push\("\/sign-in"\);/g, 'router.push("/whatsapp-login");');
fs.writeFileSync('app/checkout/page.tsx', checkoutPage);

// 3. app/custom-frame/page.tsx
let customFramePage = fs.readFileSync('app/custom-frame/page.tsx', 'utf8');
customFramePage = customFramePage.replace(/import \{ useAuth \} from "@clerk\/nextjs";/g, 'import { useAuth as useCustomAuth } from "@/context/AuthContext";');
customFramePage = customFramePage.replace(/const \{ isSignedIn \} = useAuth\(\);/g, 'const { isAuthenticated: isSignedIn } = useCustomAuth();');
fs.writeFileSync('app/custom-frame/page.tsx', customFramePage);

// 4. app/custom-frame/[occasion]/page.tsx
let customOccasionPage = fs.readFileSync('app/custom-frame/[occasion]/page.tsx', 'utf8');
customOccasionPage = customOccasionPage.replace(/import \{ useAuth \} from "@clerk\/nextjs";/g, 'import { useAuth as useCustomAuth } from "@/context/AuthContext";');
customOccasionPage = customOccasionPage.replace(/const \{ isSignedIn \} = useAuth\(\);/g, 'const { isAuthenticated: isSignedIn } = useCustomAuth();');
fs.writeFileSync('app/custom-frame/[occasion]/page.tsx', customOccasionPage);

// 5. app/profile/page.tsx
let profilePage = fs.readFileSync('app/profile/page.tsx', 'utf8');
profilePage = profilePage.replace(/import \{ useUser, UserProfile, useClerk \} from "@clerk\/nextjs";/g, 'import { useAuth } from "@/context/AuthContext";');
profilePage = profilePage.replace(/const \{ user \} = useUser\(\);\n\s*const \{ signOut \} = useClerk\(\);/g, 'const { user, logout } = useAuth();\n  const signOut = (cb: any) => { logout(); cb(); };');
// Replace UserProfile component with a simple fallback
profilePage = profilePage.replace(/<UserProfile[\s\S]*?\/>/g, 
  `<div className="p-4 text-center">
                    <p className="text-gray-500 mb-4">Account settings are managed via your phone number.</p>
                    <p className="text-lg font-medium">{user?.phoneNumber}</p>
                    <p className="text-sm text-gray-400 mt-2">More profile settings coming soon!</p>
                  </div>`);
fs.writeFileSync('app/profile/page.tsx', profilePage);

console.log('Fixed all clerk imports in frontend pages');
