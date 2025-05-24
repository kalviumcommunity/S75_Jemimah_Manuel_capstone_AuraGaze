const User = require("../models/user");

db-read-write
// 🎀 Save Best Friend Name
const BestFriendName = async (req, res) => {
  try {
    const { username, bestFriendName } = req.body;

    if (!username || !bestFriendName) {
      return res.status(400).json({ message: "Username and best friend name are required!" });
    }

    const user = await User.findOneAndUpdate(
      { username },
      { bestFriendName },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "Best friend name saved!", name: user.bestFriendName });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// 🎀 Save Best Friend Image
main
const BestFriendImage = async (req, res) => {
  try {
    const { username, bestFriendImage } = req.body;

    if (!username || !bestFriendImage) {
      return res.status(400).json({ message: "Username and image URL are required!" });
    }

    const user = await User.findOneAndUpdate(
      { username },
      { bestFriendImage },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "Best friend image saved!", image: user.bestFriendImage });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
db-read-write

module.exports = { BestFriendName, BestFriendImage };

const BestFriendName = async (req, res) => {
  try {
    const { username, bestFriendName } = req.body;

    if (!username || !bestFriendName) {
      return res.status(400).json({ message: "Username and best friend name are required!" });
    }

    const user = await User.findOneAndUpdate(
      { username },
      { bestFriendName },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "Best friend name saved!", name: user.bestFriendName });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

module.exports = { BestFriendImage, BestFriendName };
main
