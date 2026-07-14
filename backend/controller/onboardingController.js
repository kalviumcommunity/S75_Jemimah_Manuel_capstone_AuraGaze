const User = require("../models/User");

// =========================================
// SAVE COMPLETE ONBOARDING
// =========================================

const saveOnboarding = async (req, res) => {

  try {

    const userId = req.user.userId;

    const {
      nickname,
      dob,
      friendName,
      gender,
      age,
      image,
    } = req.body;

    // Validation

    if (
      !nickname ||
      !dob ||
      !friendName ||
      !gender ||
      !age ||
      !image
    ) {
      return res.status(400).json({
        message: "Please complete all onboarding details.",
      });
    }

    // ==========================
    // Calculate Age Group
    // ==========================

    let ageGroup = "";

    if (age <= 18) {

      ageGroup = "school";

    }

    else if (age <= 40) {

      ageGroup = "young";

    }

    else {

      ageGroup = "elder";

    }

    const updatedUser = await User.findByIdAndUpdate(

      userId,

      {

        profileCompleted: true,

        profile: {

          nickname,

          dob,

        },

        friend: {

          name: friendName,

          gender,

          ageGroup,

          image,

        },

      },

      {

        new: true,

      }

    );

    res.status(200).json({

      message: "Onboarding Completed Successfully",

      user: updatedUser,

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      message: error.message,

    });

  }

};

// =========================================
// GET USER PROFILE
// =========================================

const getOnboarding = async (req, res) => {

  try {

    const user = await User.findById(req.user.userId);

    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });

    }

    res.status(200).json(user);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

module.exports = {
  saveOnboarding,
  getOnboarding,
};