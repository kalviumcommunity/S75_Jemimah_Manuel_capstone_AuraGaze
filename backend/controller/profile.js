const User = require("../models/user");
const bcrypt = require("bcryptjs");


// PUT: Update username, email, password, or AI best friend name

// ✅ GET: Fetch user info (for profile page)
const getUserInfo = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select("-password"); // hide password

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
      bestFriendName: user.bestFriendName,
      bestFriendImage: user.bestFriendImage,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Failed to fetch user info", error });
  }
};

// ✅ PUT: Update username, email, password, best friend name

const updateUserInfo = async (req, res) => {
  try {
    const { email, newUsername, newEmail, newPassword, newBestFriendName } = req.body;

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

    if (newBestFriendName) updateFields.bestFriendName = newBestFriendName;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({
      message: "Profile updated successfully!",
      updatedUsername: updatedUser.username,
      updatedEmail: updatedUser.email,
      updatedBestFriendName: updatedUser.bestFriendName,
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
      bestFriendName: user.bestFriendName,
      bestFriendImage: user.bestFriendImage,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Failed to fetch user info", error });
  }
};

entity-relationship
module.exports = {getUserInfo , updateUserInfo} 

module.exports = {getUserInfo , updateUserInfo}

// ❌ DELETE: Delete user account
const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required to delete the account!" });
    }

    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "Account deleted successfully!" });
  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({ message: "Failed to delete account", error });
  }
};

module.exports = { updateUserInfo, getUserInfo, deleteUser};

 main
