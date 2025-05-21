const User = require("../models/user");

exports.BestFriendImage = async (req, res) => {
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
