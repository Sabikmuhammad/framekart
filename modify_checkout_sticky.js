const fs = require('fs');
const path = './app/checkout/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Update bottom padding for the new sticky bar
content = content.replace(
  'pb-[calc(8rem+env(safe-area-inset-bottom))] lg:pb-12',
  'pb-[calc(12rem+env(safe-area-inset-bottom))] lg:pb-12'
);

// Wrap the Button and Secure Payment text in a sticky mobile container
const buttonStartStr = `              <Button`;
const buttonEndStr = `</p>\n              </div>`;
const startIndex = content.indexOf(buttonStartStr);
const endIndex = content.indexOf(buttonEndStr, startIndex) + buttonEndStr.length;

if (startIndex !== -1 && endIndex !== -1) {
  let buttonBlock = content.substring(startIndex, endIndex);
  
  // Make the button itself full width but without mt-6 since the container has it
  buttonBlock = buttonBlock.replace('mt-6 w-full', 'w-full');
  
  // Create wrapper
  const newButtonBlock = `              <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+4rem)] left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border/50 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] lg:static lg:bottom-auto lg:left-auto lg:right-auto lg:p-0 lg:bg-transparent lg:border-none lg:backdrop-blur-none lg:z-auto lg:shadow-none lg:mt-6">
  ${buttonBlock}
              </div>`;

  content = content.substring(0, startIndex) + newButtonBlock + content.substring(endIndex);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Applied sticky mobile payment bar');
