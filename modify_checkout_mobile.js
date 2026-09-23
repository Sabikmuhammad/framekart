const fs = require('fs');
const path = './app/checkout/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Container & Spacing
content = content.replace('min-h-screen pb-24 lg:pb-12 bg-background', 'min-h-screen pb-[calc(8rem+env(safe-area-inset-bottom))] lg:pb-12 bg-background overflow-x-hidden w-full');
content = content.replace('pt-8 sm:pt-12 px-4 text-center', 'pt-6 sm:pt-12 px-4 sm:px-6 text-left sm:text-center');

// Hero Typography
content = content.replace('text-xs font-semibold tracking-[0.2em]', 'text-[11px] sm:text-xs font-semibold tracking-[0.2em]');
content = content.replace('text-3xl sm:text-4xl lg:text-5xl font-light', 'text-[30px] leading-[1.2] sm:text-4xl lg:text-5xl font-light');
content = content.replace('text-sm sm:text-base text-muted-foreground', 'text-[14px] leading-[1.45] sm:text-base text-muted-foreground');

// Progress
content = content.replace('flex items-center justify-center gap-4 text-xs font-medium tracking-widest', 'flex items-center justify-start sm:justify-center gap-4 text-[11px] sm:text-xs font-medium tracking-widest');

// Container
content = content.replace('container max-w-[1200px] mx-auto px-4 mt-8 sm:mt-16', 'w-full max-w-[1200px] mx-auto px-4 sm:px-6 mt-6 sm:mt-16');

// Section headers
content = content.replace('text-lg font-medium tracking-wide', 'text-[18px] sm:text-lg font-medium tracking-wide');
content = content.replace('text-sm text-muted-foreground', 'text-[13px] sm:text-sm text-muted-foreground');

// Gap sizes
content = content.replaceAll('grid gap-6', 'grid gap-5 sm:gap-6');

// Form inputs
content = content.replaceAll('h-12 sm:h-14', 'h-[50px] sm:h-14 text-[15px] sm:text-base');

// Labels
content = content.replaceAll('text-sm font-medium ml-1', 'text-[13px] sm:text-sm font-medium ml-1');
content = content.replace('text-sm font-medium ml-1 text-muted-foreground', 'text-[13px] sm:text-sm font-medium ml-1 text-muted-foreground');

// Delivery instructions title separator
content = content.replace('<div className="grid gap-2 mt-4">', '<div className="grid gap-2 mt-6 pt-6 border-t border-border/50">\\n                    <h3 className="text-[18px] sm:text-lg font-medium tracking-wide mb-2">DELIVERY NOTES</h3>');

// Save address
content = content.replace('p-4 rounded-xl border', 'p-3 sm:p-4 rounded-xl border');
content = content.replace('span className="text-sm font-medium"', 'span className="text-[13px] sm:text-sm font-medium"');

// Order Summary
content = content.replace('w-16 h-16', 'w-14 h-14 sm:w-16 sm:h-16');
content = content.replace('font-medium text-sm truncate', 'font-medium text-[13px] sm:text-sm truncate');
content = content.replace('text-xs text-muted-foreground mt-0.5', 'text-[11px] sm:text-xs text-muted-foreground mt-0.5');
content = content.replace('text-sm font-medium', 'text-[14px] sm:text-sm font-medium');

// Total
content = content.replace('text-2xl font-light', 'text-[24px] sm:text-2xl font-semibold');

// CTA
content = content.replace('mt-6 w-full h-14 rounded-xl text-base font-medium', 'mt-6 w-full h-[52px] sm:h-14 rounded-xl text-[15px] sm:text-base font-semibold');

// Secure checkout
content = content.replace('text-[11px] font-medium tracking-wide text-center max-w-[200px] opacity-70', 'text-[12px] sm:text-[13px] font-medium tracking-wide text-center max-w-[250px] opacity-80');
content = content.replace('ShieldCheck className="w-5 h-5 opacity-50"', 'ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 opacity-50"');

fs.writeFileSync(path, content, 'utf8');
console.log('Mobile checkout UI updated successfully.');
