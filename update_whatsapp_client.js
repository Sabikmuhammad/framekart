const fs = require('fs');
let clientPath = './lib/whatsapp/client.ts';
let client = fs.readFileSync(clientPath, 'utf8');

// Remove sendWhatsAppOtp and interfaces
const removeRegex = /export interface SendWhatsAppOtpOptions[\s\S]*?\}\n\n/g;
client = client.replace(removeRegex, '');

// Also remove from imports if there was any (doesn't seem to be, it's just exported)
fs.writeFileSync(clientPath, client, 'utf8');
console.log("WhatsApp client updated.");
