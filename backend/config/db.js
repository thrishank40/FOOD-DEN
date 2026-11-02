const mongoose = require("mongoose");

const connectDB = async (retries = 3, delay = 3000) => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGODB_URI / MONGO_URI is not defined in environment variables.");
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 30000, // 30s timeout for reliable Atlas connection
        connectTimeoutMS: 30000,
      });

      console.log(`✅ MongoDB Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
      return conn;
    } catch (error) {
      console.error(`⚠️ MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`);
      if (attempt < retries) {
        console.log(`⏳ Retrying in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};

module.exports = connectDB;


