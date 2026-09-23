const fs = require('fs');
const path = './components/cart/CartMarquee.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace MarqueeContent to double itself to ensure it never clips
const oldMarquee = `const MarqueeContent = () => (
  <>
    <span className="px-4">FREE SHIPPING</span>
    <span className="px-4 text-primary/40 text-[10px] hidden sm:inline">✦</span>
    <span className="px-4">15% LAUNCH OFFER</span>
    <span className="px-4 text-primary/40 text-[10px] hidden sm:inline">✦</span>
    <span className="px-4">SECURE CHECKOUT</span>
    <span className="px-4 text-primary/40 text-[10px] hidden sm:inline">✦</span>
    <span className="px-4">PREMIUM PACKAGING</span>
    <span className="px-4 text-primary/40 text-[10px] hidden sm:inline">✦</span>
  </>
);`;

const newMarquee = `const MarqueeItem = () => (
  <>
    <span className="px-3 sm:px-4">FREE SHIPPING</span>
    <span className="px-2 sm:px-4 text-primary/40 text-[10px]">✦</span>
    <span className="px-3 sm:px-4">15% LAUNCH OFFER</span>
    <span className="px-2 sm:px-4 text-primary/40 text-[10px]">✦</span>
    <span className="px-3 sm:px-4">SECURE CHECKOUT</span>
    <span className="px-2 sm:px-4 text-primary/40 text-[10px]">✦</span>
    <span className="px-3 sm:px-4">PREMIUM PACKAGING</span>
    <span className="px-2 sm:px-4 text-primary/40 text-[10px]">✦</span>
  </>
);

const MarqueeContent = () => (
  <>
    <MarqueeItem />
    <MarqueeItem />
  </>
);`;

content = content.replace(oldMarquee, newMarquee);

fs.writeFileSync(path, content, 'utf8');
