const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(

  {

    user: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },

    sender: {

      type: String,

      enum: ["user", "ai"],

      required: true,

    },

    message: {

      type: String,

      required: true,

      trim: true,

    },

  },

  {

    timestamps: true,

  }

);

module.exports =
  mongoose.models.Chat ||
  mongoose.model("Chat", chatSchema);