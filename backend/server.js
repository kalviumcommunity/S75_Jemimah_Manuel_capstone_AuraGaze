const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const authRouter = require("./routes/auth");
const onboardingRoutes = require("./routes/onboarding");
const chatRoutes = require("./routes/chat");

dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://auragaze1528.netlify.app",
  ],

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

  credentials: true,

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
};

app.use(cors(corsOptions));

// ✅ Body parsers (with increased limit for base64 image uploads)
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ✅ MongoDB Connection
connectDB();


// ✅ Serve static image files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/auth", authRouter);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/chat", chatRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// ✅ Start server
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});