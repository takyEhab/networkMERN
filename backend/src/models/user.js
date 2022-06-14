const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
  message: String,
  time: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false },
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
  followers: Array,
  following: Array,
  // notifications: [messagesSchema]
});
const PostSchema = new mongoose.Schema({
  UsersLikes: Array,
  created_at: { type: Date, default: Date.now },
  likes: {
    type: Number,
    default: 0,
    min: 0,
  },
  post: { type: String, minlength: [5, "post should be at least 5 letters"] },
  writer: String,
});
module.exports = mongoose.model("User", UserSchema);
