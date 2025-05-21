const User = require("../models/user");

exports.BestFriendName = async (req, res) => {
  try {
    const { name, username } = req.body;

    if (!name || !username) {
      return res.status(400).json({ message: "Name and username are required!" });
    }

    const user = await User.findOneAndUpdate(
      { username },
      { bestFriendName: name },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: `Nice ${name}, now onwards you're my best friend! 💖` });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
