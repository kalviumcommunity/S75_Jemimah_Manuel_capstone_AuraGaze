const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ MongoDB URI is missing in environment variables");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // One-time safety cleanup:
    // Remove any leftover explicit googleId: null values from old signups
    // so that the sparse unique index works correctly.
    try {
      const result = await conn.connection
        .collection("users")
        .updateMany({ googleId: null }, { $unset: { googleId: "" } });

      if (result.modifiedCount > 0) {
        console.log(
          `🔧 Cleaned up ${result.modifiedCount} user(s) with googleId: null`
        );
      }
    } catch (cleanupErr) {
      console.warn("⚠️ googleId cleanup skipped:", cleanupErr.message);
    }
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;