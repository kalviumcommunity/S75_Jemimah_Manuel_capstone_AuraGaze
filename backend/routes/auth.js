const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");

const { signup } = require("../controller/signup");
const { login } = require("../controller/login"); 
const { BestFriendName, BestFriendImage } = require("../controller/name");
const { updateUserInfo, getUserInfo } = require("../controller/profile");

const authRouter = express.Router();

// ✅ Public Routes
authRouter.post("/signup", signup); 
authRouter.post("/login", login);

// ✅ Protected Routes (Only for logged-in users)
authRouter.post("/bestFriendName", authMiddleware, BestFriendName); 
authRouter.post("/bestFriendImage", authMiddleware, BestFriendImage);
authRouter.put("/updateUser", authMiddleware, updateUserInfo);
authRouter.get("/userInfo/:username", authMiddleware, getUserInfo);

module.exports = authRouter;