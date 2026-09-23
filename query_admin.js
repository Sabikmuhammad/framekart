const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;
mongoose.connect(uri).then(async () => {
  const users = await mongoose.connection.db.collection('users').find({ role: "ADMIN" }).toArray();
  console.log(users);
  process.exit(0);
});
