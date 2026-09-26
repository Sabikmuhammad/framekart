const mongoose = require("mongoose");

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to DB.");

  const Frame = mongoose.models.Frame || mongoose.model("Frame", new mongoose.Schema({}, { strict: false }));
  
  // Fetch up to 5 wall frames
  const frames = await Frame.find({ category: "Wall Frames" }).limit(5);
  console.log(`Number of MongoDB products selected: ${frames.length}`);
  
  if (frames.length === 0) {
    console.log("No wall frames found in DB.");
    process.exit(1);
  }

  const products = frames.map(f => {
    const obj = f.toObject();
    return {
      id: obj._id.toString(),
      name: obj.title || obj.name,
      price: obj.price,
      slug: obj.slug,
      url: `https://framekart.co.in/frames/${obj.slug}`,
      image: obj.imageUrl
    };
  });

  const phoneNumber = "917259788138";
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const catalogId = process.env.WHATSAPP_CATALOG_ID;
  const apiVersion = process.env.WHATSAPP_API_VERSION || "v20.0";

  // Slice to max 30 as per interactive.ts
  const productsToSend = products.slice(0, 30);
  console.log(`Number sent to Meta: ${productsToSend.length}`);

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
        text: "Here are some frames matching your request:"
      },
      footer: {
        text: "Tap below to view products"
      },
      action: {
        catalog_id: catalogId,
        sections: [
          {
            title: "Available Frames",
            product_items: productsToSend.map(p => ({ product_retailer_id: p.slug }))
          }
        ]
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
  if (response.ok) {
     console.log(`Meta message ID: ${data.messages?.[0]?.id}`);
  } else {
     console.log(`Error: ${JSON.stringify(data, null, 2)}`);
  }
  
  process.exit(0);
}

run().catch(console.error);
