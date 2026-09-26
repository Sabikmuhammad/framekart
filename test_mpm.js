const mongoose = require("mongoose");

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to DB.");

  const Frame = mongoose.models.Frame || mongoose.model("Frame", new mongoose.Schema({}, { strict: false }));
  
  const frames = await Frame.find({ category: "Wall Frames" }).limit(1);
  if (frames.length === 0) {
    console.log("No wall frames found in DB.");
    process.exit(1);
  }

  const frame = frames[0].toObject();
  console.log(`Testing with product: ${frame.title || frame.name} (Slug: ${frame.slug})`);

  const phoneNumber = "917259788138";
  
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const catalogId = process.env.WHATSAPP_CATALOG_ID;
  const apiVersion = process.env.WHATSAPP_API_VERSION || "v20.0";

  const payload = {
    messaging_product: "whatsapp",
    to: phoneNumber,
    type: "interactive",
    interactive: {
      type: "product_list",
      header: {
        type: "text",
        text: "FrameKart Products"
      },
      body: {
        text: "Here is a test Wall Frame:"
      },
      footer: {
        text: "Tap below to view products"
      },
      action: {
        catalog_id: catalogId,
        sections: [
          {
            title: "Available Frames",
            product_items: [
              { product_retailer_id: frame.slug }
            ]
          }
        ]
      }
    }
  };

  console.log("Sending WhatsApp Product List Message...");
  
  const response = await fetch(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  
  const data = await response.json();
  console.log("Status:", response.status);
  console.log("Response:", JSON.stringify(data, null, 2));
  
  process.exit(0);
}

run().catch(console.error);
