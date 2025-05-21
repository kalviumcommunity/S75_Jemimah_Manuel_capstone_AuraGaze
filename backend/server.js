const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./db/db");
const authRouter = require("./routes/auth");
const avatarRouter = require("./routes/avatar"); 

dotenv.config();

const app = express();

// ✅ CORS setup must be done early
const corsOptions = {
  origin: ["http://localhost:5173",
      "https://auragaze1528.netlify.app/",
],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handles preflight CORS requests

// ✅ Body parsers (with increased limit for base64 image uploads)
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ✅ MongoDB Connection
connectDB();


// ✅ Serve static image files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/auth", authRouter);
app.use("/avatar", avatarRouter);  // Avatar routes

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// ✅ Start server
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});