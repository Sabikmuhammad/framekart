const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1]] = match[2];
  }
});

async function dropIndex() {
  try {
    await mongoose.connect(envVars.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('offersettings');
    
    // Drop the unique index on name field
    await collection.dropIndex('name_1');
    console.log('✅ Successfully dropped name_1 unique index');
    
    // List all remaining indexes
    const indexes = await collection.indexes();
    console.log('Remaining indexes:', indexes);
    
    await mongoose.connection.close();
    console.log('Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

dropIndex();
