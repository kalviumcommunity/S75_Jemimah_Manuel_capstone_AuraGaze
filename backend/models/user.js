const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    unique: true,
    required: true 
  },

  email: { 
    
    type: String,
    unique: true,
    required: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address",
    ],
  },
   
  password: { 
    type: String, 
    required: true 
  },

  bestFriendName: { 
    type: String 
  },
  bestFriendImage: {
    type: String, // URL or path to the chosen image
  }
});

module.exports = mongoose.model("User", userSchema);