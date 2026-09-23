const fs = require('fs');
const path = './components/cart/CartBenefits.tsx';
let content = fs.readFileSync(path, 'utf8');

// Reduce vertical gaps on mobile
content = content.replace(
  'gap-x-8 gap-y-8 sm:gap-y-12 my-12 sm:my-24 border-t border-border/50 pt-12 sm:pt-24', 
  'gap-x-8 gap-y-6 sm:gap-y-12 my-10 sm:my-24 border-t border-border/50 pt-10 sm:pt-24'
);

content = content.replace(
  'gap-y-6 sm:gap-y-8 gap-x-8 my-16 border-t border-border/50 pt-10 sm:pt-16',
  'gap-y-6 sm:gap-y-8 gap-x-8 my-10 border-t border-border/50 pt-10'
);

fs.writeFileSync(path, content, 'utf8');
