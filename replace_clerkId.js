const fs = require('fs');
const glob = require('glob');

const files = glob.sync('app/api/**/*.ts');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace User.findOne({ clerkId: userId })
  if (content.includes('clerkId: userId')) {
    content = content.replace(/User\.findOne\(\{\s*clerkId:\s*userId\s*\}\)/g, 'User.findById(userId)');
    changed = true;
  }
  
  if (content.includes('authResult.user.clerkId')) {
    content = content.replace(/authResult\.user\.clerkId/g, 'authResult.user._id.toString()');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Updated:', file);
  }
}
