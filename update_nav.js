const fs = require('fs');

let navPath = './components/layout/Navbar.tsx';
let nav = fs.readFileSync(navPath, 'utf8');
nav = nav.replace('pathname?.startsWith("/whatsapp-login") || ', '');
nav = nav.replace(/<Link href="\/whatsapp-login">[\s\S]*?<\/Link>/g, '');
nav = nav.replace(/\) : \(\s*\)/g, ') : null'); // If an empty parens was left
fs.writeFileSync(navPath, nav, 'utf8');

let mNavPath = './components/layout/MobileNav.tsx';
let mNav = fs.readFileSync(mNavPath, 'utf8');
mNav = mNav.replace('pathname?.startsWith("/whatsapp-login") || ', '');
mNav = mNav.replace(' || pathname?.startsWith("/whatsapp-login")', '');
fs.writeFileSync(mNavPath, mNav, 'utf8');

let mHeadPath = './components/layout/MobileHeader.tsx';
let mHead = fs.readFileSync(mHeadPath, 'utf8');
mHead = mHead.replace('pathname?.startsWith("/whatsapp-login") || ', '');
mHead = mHead.replace(/\{\!isSignedIn && \([\s\S]*?<\/Link>\s*\)\}/g, '{!isSignedIn && null}');
fs.writeFileSync(mHeadPath, mHead, 'utf8');

let footPath = './components/layout/Footer.tsx';
let foot = fs.readFileSync(footPath, 'utf8');
foot = foot.replace('pathname?.startsWith("/whatsapp-login") || ', '');
foot = foot.replace(' || pathname?.startsWith("/whatsapp-login")', '');
fs.writeFileSync(footPath, foot, 'utf8');

console.log("Navigators updated.");
