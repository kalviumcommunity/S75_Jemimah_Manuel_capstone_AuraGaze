require("dotenv").config(); // must run before ANY other require below

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const authRouter = require("./routes/auth");
const onboardingRoutes = require("./routes/onboarding");
const chatRoutes = require("./routes/chat");

const app = express();

/* ==========================================
   CORS Configuration
========================================== */

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
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

/* ==========================================
   Middleware
========================================== */

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

/* ==========================================
   Database
========================================== */

connectDB();

/* ==========================================
   Static Files
========================================== */

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* ==========================================
   Routes
========================================== */

app.use("/auth", authRouter);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/chat", chatRoutes);

/* ==========================================
   Health Check
========================================== */

app.get("/", (req, res) => {
  res.send("🚀 Aura Gaze Backend Running");
});

/* ==========================================
   Start Server
========================================== */

const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});