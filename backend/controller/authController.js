const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===================================
// SIGNUP
// ===================================

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
  username,
  email,
  password: hashedPassword,

  profileCompleted: false,

  profile: {
    nickname: "",
  },
});

    await newUser.save();

// Create JWT
const token = jwt.sign(
  {
    userId: newUser._id,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

res.status(201).json({
  message: "Signup Successful",
  token,
  username: newUser.username,
  profileCompleted: false,
});
  } catch (error) {
  console.error("Signup Error:");
  console.error(error);

  res.status(500).json({
    message: "Signup Failed",
    error: error.message,
    stack: error.stack,
  });
}
};

// ===================================
// LOGIN
// ===================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
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

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      username: user.username,
      profileCompleted: user.profileCompleted,
    });

  } catch (error) {
    res.status(500).json({
      message: "Login Failed",
      error: error.message,
    });
  }
};

// ===================================

module.exports = {
  signup,
  login,
};