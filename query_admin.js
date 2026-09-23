const mongoose = require('mongoose');
const uri = "mongodb+srv://sabikrayya0:sabik2005@cluster0.sscsjq0.mongodb.net/framekart?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri).then(async () => {
  const users = await mongoose.connection.db.collection('users').find({ role: "ADMIN" }).toArray();
  console.log(users);
  process.exit(0);
});
