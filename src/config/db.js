const mongoose = require("mongoose");

async function connect() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shop_midterm";
  await mongoose.connect(uri);
  console.log("MongoDB connected:", uri);
}

module.exports = { connect };
