const fs = require('fs');
const path = './app/checkout/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Fix the \n literal
content = content.replace('<div className="grid gap-2 mt-6 pt-6 border-t border-border/50">\\n                    <h3', '<div className="grid gap-2 mt-6 pt-6 border-t border-border/50">\n                    <h3');

// 2. Fix the Total amount clipping by letting it take space and pushing label
content = content.replace(
  '<span className="text-[24px] sm:text-2xl font-semibold"',
  '<span className="text-[24px] sm:text-2xl font-semibold whitespace-nowrap flex-shrink-0"'
);
content = content.replace(
  '<span className="text-base tracking-wider">TOTAL</span>',
  '<span className="text-base tracking-wider min-w-0 pr-4">TOTAL</span>'
);

// 3. Fix the Product Title clipping/wrapping
content = content.replace(
  '<p className="font-medium text-[13px] sm:text-sm truncate">',
  '<p className="font-medium text-[13px] sm:text-sm line-clamp-2 min-w-0 pr-2">'
);

// 4. Ensure total wrapping block is clean
content = content.replace(
  '<div className="flex justify-between items-center mb-1">',
  '<div className="flex justify-between items-end mb-1 w-full gap-2">'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed checkout bugs.');
