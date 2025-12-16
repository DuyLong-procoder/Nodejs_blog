const mongoose = require("mongoose");

let cached = global._mongooseConn;
if (!cached) cached = global._mongooseConn = { conn: null, promise: null };

async function connect() {
  if (cached.conn) return cached.conn;

  const uri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shop_midterm";

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri)
      .then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  console.log("MongoDB connected");
  return cached.conn;
}

module.exports = { connect };
