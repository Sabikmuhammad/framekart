require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function checkSchema() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("No MONGODB_URI found.");
    return;
  }
  
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('framekart');
    
    // Fetch a couple of products to see their schema
    const frames = await db.collection('frames').find({}).limit(5).toArray();
    console.log("=== Sample Frames Schema ===");
    for (const frame of frames) {
      console.log(JSON.stringify(frame, null, 2));
    }
    
    console.log("\n=== Checking blush-blossom-botanical-wall-frame ===");
    const blush = await db.collection('frames').findOne({ slug: 'blush-blossom-botanical-wall-frame' });
    if (blush) {
      console.log(JSON.stringify(blush, null, 2));
    } else {
      console.log("Could not find product with slug blush-blossom-botanical-wall-frame");
    }

  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

checkSchema();
