const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

// ==========================================
// Google OAuth Client
// ==========================================

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// ==========================================
// CREATE JWT
// ==========================================

const createToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ==========================================
// SIGNUP
// ==========================================

const signup = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
    } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const existingUsername = await User.findOne({
      username,
    });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,

      authProvider: "local",

      profileCompleted: false,

      profile: {
        nickname: "",
      },
    });

    await newUser.save();

    const token = createToken(newUser);

    return res.status(201).json({
      message: "Signup Successful",
      token,
      username: newUser.username,
      profileCompleted: false,
    });

  } catch (error) {
    console.error("Signup Error:", error);

    return res.status(500).json({
      message: "Signup Failed",
      error: error.message,
    });
  }
};

// ==========================================
// LOGIN
// ==========================================

const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    // Google-only account
    if (!user.password) {
      return res.status(400).json({
        message:
          "This account uses Google Sign-In. Please continue with Google.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      message: "Login Successful",
      token,
      username: user.username,
      profileCompleted: user.profileCompleted,
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      message: "Login Failed",
      error: error.message,
    });
  }
};

// ==========================================
// GOOGLE AUTHENTICATION
// ==========================================

const googleAuth = async (req, res) => {
  try {
    const { accessToken } = req.body;

    // --------------------------------------
    // Validate request
    // --------------------------------------

    if (!accessToken) {
      return res.status(400).json({
        message: "Google access token is required",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error(
        "GOOGLE_CLIENT_ID is missing from backend .env"
      );

      return res.status(500).json({
        message:
          "Google authentication is not configured on the server",
      });
    }

    // --------------------------------------
    // Verify Google access token
    // --------------------------------------

    const tokenInfo =
      await googleClient.getTokenInfo(accessToken);

    // Make sure the token belongs to OUR Google app
    if (
      tokenInfo.aud &&
      tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID
    ) {
      return res.status(401).json({
        message: "Invalid Google client",
      });
    }

    // --------------------------------------
    // Get Google user information
    // --------------------------------------

    const googleResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!googleResponse.ok) {
      console.error(
        "Google userinfo request failed:",
        googleResponse.status
      );

      return res.status(401).json({
        message: "Unable to verify Google account",
      });
    }

    const googleUser =
      await googleResponse.json();

    console.log("Google User:", {
      id: googleUser.sub,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      emailVerified: googleUser.email_verified,
    });

    // --------------------------------------
    // Validate Google account
    // --------------------------------------

    if (!googleUser.email) {
      return res.status(400).json({
        message:
          "Google account email could not be retrieved",
      });
    }

    if (!googleUser.email_verified) {
      return res.status(400).json({
        message:
          "Your Google email is not verified",
      });
    }

    // --------------------------------------
    // Find existing user
    // --------------------------------------

    const email =
      googleUser.email.toLowerCase();

    let user = await User.findOne({
      email,
    });

    // --------------------------------------
    // EXISTING USER
    // --------------------------------------

    if (user) {
      // Link Google account if not already linked
      if (!user.googleId) {
        user.googleId = googleUser.sub;
      }

      user.authProvider = "google";

      await user.save();

      const token = createToken(user);

      return res.status(200).json({
        message: "Google Login Successful",
        token,
        username: user.username,
        profileCompleted:
          user.profileCompleted,
      });
    }

    // --------------------------------------
    // NEW USER
    // --------------------------------------

    let username =
      googleUser.name ||
      email.split("@")[0];

    // Remove unusual characters
    username = username
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "");

    if (!username) {
      username = "AuraUser";
    }

    // --------------------------------------
    // Make username unique
    // --------------------------------------

    let baseUsername = username;
    let counter = 1;

    while (
      await User.findOne({ username })
    ) {
      username =
        `${baseUsername}${counter}`;
      counter++;
    }

    // --------------------------------------
    // Create Google user
    // --------------------------------------

    user = new User({
      username,
      email,

      // Google users don't need a password
      password: null,

      googleId: googleUser.sub,

      authProvider: "google",

      profileCompleted: false,

      profile: {
        nickname: "",
      },

      friend: {
        name: "",
        gender: null,
        ageGroup: null,
        image: "",
      },
    });

    await user.save();

    const token = createToken(user);

    return res.status(201).json({
      message: "Google Signup Successful",
      token,
      username: user.username,
      profileCompleted: false,
    });

  } catch (error) {
    console.error(
      "======================================"
    );

    console.error(
      "GOOGLE AUTHENTICATION ERROR"
    );

    console.error(
      error
    );

    console.error(
      "======================================"
    );

    return res.status(500).json({
      message:
        "Google authentication failed",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  signup,
  login,
  googleAuth,
};