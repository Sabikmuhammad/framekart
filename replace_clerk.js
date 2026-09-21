const fs = require('fs');
const glob = require('glob');

const files = glob.sync('app/api/**/*.ts');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace import
  if (content.includes('from "@clerk/nextjs/server"')) {
    content = content.replace(/import\s+\{.*\}\s+from\s+"@clerk\/nextjs\/server";?/g, 'import { getCurrentUser } from "@/lib/auth/authorization";');
    changed = true;
  }

  // Replace auth calls
  if (content.includes('await auth()') || content.includes('auth()')) {
    content = content.replace(/const\s+\{\s*userId\s*\}\s*=\s*(?:await\s+)?auth\(\);?/g, 
      'const user = await getCurrentUser();\n    const userId = user?._id.toString();');
    changed = true;
  }
  
  if (content.includes('getAuth(req)')) {
     content = content.replace(/const\s+\{\s*userId\s*\}\s*=\s*getAuth\(req\);?/g, 
      'const user = await getCurrentUser();\n    const userId = user?._id.toString();');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Updated:', file);
  }
}
