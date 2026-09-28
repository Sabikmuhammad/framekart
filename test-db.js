const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

const envPath = '/Users/muhammadsabik/Desktop/framekartweb/.env.local';
const envConfig = dotenv.parse(fs.readFileSync(envPath));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Since we don't have the models, we'll query directly
  const db = mongoose.connection.db;
  const orders = await db.collection('orders').find({}).sort({createdAt: -1}).limit(1).toArray();
  
  if (orders.length > 0) {
    console.log('Found order:', orders[0]._id.toString());
    console.log('Order totalAmount:', orders[0].totalAmount);
    
    // Now let's test the cashfree API locally using the production DB order
    const payload = {
      amount: orders[0].totalAmount || 1000,
      customerPhone: '9876543210',
      customerEmail: 'test@example.com',
      customerName: 'Test User',
      orderId: orders[0]._id.toString(),
      orderType: 'regular'
    };
    
    console.log('Sending payload:', JSON.stringify(payload));
    
    // Test local API
    try {
      const response = await fetch('http://localhost:3000/api/cashfree/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      console.log('API RESPONSE:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Fetch error:', e);
    }
    
    // Test production API
    try {
      const response = await fetch('https://framekart.co.in/api/cashfree/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      console.log('PRODUCTION API RESPONSE:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Prod Fetch error:', e);
    }
  } else {
    console.log('No orders found in DB.');
  }
  
  process.exit(0);
})();
