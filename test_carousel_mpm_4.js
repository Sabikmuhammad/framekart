const mongoose = require("mongoose");

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to DB.");

  const Frame = mongoose.models.Frame || mongoose.model("Frame", new mongoose.Schema({}, { strict: false }));
  
  // Fetch up to 5 wall frames exactly like searchProducts
  const frames = await Frame.find({ category: "Wall Frames" }).limit(5);
  console.log(`Number of MongoDB products selected: ${frames.length}`);

  const phoneNumber = "917259788138";
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const catalogId = process.env.WHATSAPP_CATALOG_ID;
  const apiVersion = process.env.WHATSAPP_API_VERSION || "v20.0";

  // Build the cards array
  const cards = frames.slice(0, 10).map((f, index) => {
    return {
      card_index: index,
      type: "product",
      action: {
        product_retailer_id: f.slug,
        catalog_id: catalogId
      }
    };
  });

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phoneNumber,
    type: "interactive",
    interactive: {
      type: "carousel",
      body: {
        text: "Swipe left to see our best frames! 👉"
      },
      action: {
        cards: cards
      }
    }
  };

  const response = await fetch(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  
  const data = await response.json();
  console.log(`HTTP status: ${response.status}`);
  if (!response.ok) {
      console.log(`[WA PRODUCT] Meta error code: ${data?.error?.code || 'N/A'}`);
      console.log(`[WA PRODUCT] Meta error type: ${data?.error?.type || 'N/A'}`);
      console.log(`[WA PRODUCT] Meta error message: ${data?.error?.message || 'N/A'}`);
      console.log(`[WA PRODUCT] Meta error details: ${JSON.stringify(data?.error?.error_data?.details || 'N/A')}`);
      console.log(`[WA PRODUCT] Meta fbtrace_id: ${data?.error?.fbtrace_id || 'N/A'}`);
  } else {
      console.log("Success! Message ID:", data.messages[0].id);
  }
  
  process.exit(0);
}

run().catch(console.error);
