const mongoose = require("mongoose");
const { sendProductCarousel } = require("./lib/whatsapp/interactive");

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Frame = mongoose.models.Frame || mongoose.model("Frame", new mongoose.Schema({}, { strict: false }));
  
  // Fetch up to 5 wall frames
  const frames = await Frame.find({ category: "Wall Frames" }).limit(5);
  
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

  const res = await sendProductCarousel("917259788138", "Test Auto Recover", products);
  console.log("Final Result:", res);
  process.exit(0);
}
run().catch(console.error);
