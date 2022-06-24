const mongoose = require("mongoose");

// const messagesSchema = new mongoose.Schema({
//   message: String,
//   time: { type: Date, default: Date.now },
//   seen: { type: Boolean, default: false },
// });

const FollowSchema = new mongoose.Schema(
  {
    user: String,
  },
  { timestamps: true }
);

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    followers: [FollowSchema],
    following: [FollowSchema],
    // notifications: [messagesSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
