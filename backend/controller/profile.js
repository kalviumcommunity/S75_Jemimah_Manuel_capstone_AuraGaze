const User = require("../models/user");
const bcrypt = require("bcryptjs");

// PUT: Update username, email, password, or AI best friend name
const updateUserInfo = async (req, res) => {
  try {
    const { email, newUsername, newEmail, newPassword, newAIBestFriendName } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Current email is required!" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const updateFields = {};

    if (newUsername) updateFields.username = newUsername;
    if (newEmail) updateFields.email = newEmail;

    if (newPassword) {
      const hashed = await bcrypt.hash(newPassword, 10);
      updateFields.password = hashed;
    }

    if (newAIBestFriendName) updateFields.aiBestFriendName = newAIBestFriendName;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({
      message: "Profile updated successfully!",
      updatedUsername: updatedUser.username,
      updatedEmail: updatedUser.email,
      updatedAIBestFriendName: updatedUser.aiBestFriendName,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Failed to update profile", error });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select("-password"); // 🔐 hiding password

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
      bestFriendName: user.bestFriendName, // 🟢 returns name
      bestFriendImage: user.bestFriendImage, // 🟢 returns image
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Failed to fetch user info", error });
  }
};

module.exports = {getUserInfo , updateUserInfo}