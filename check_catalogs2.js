require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

async function run() {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const wabaId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
  const version = process.env.WHATSAPP_API_VERSION || "v18.0";

  console.log(`Checking catalogs for WABA: ${wabaId}`);
  const res = await fetch(`https://graph.facebook.com/${version}/${wabaId}/product_catalogs`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  console.log("Catalogs:", JSON.stringify(data, null, 2));
}
run();
