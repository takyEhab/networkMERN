const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
  message: String,
  time: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false },
});

const followSchema = new mongoose.Schema({
  user: String,
  created: { type: Date, default: Date.now },
});

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: [followSchema],
  following: [followSchema],
  // notifications: [messagesSchema]
});

module.exports = mongoose.model("User", UserSchema);
