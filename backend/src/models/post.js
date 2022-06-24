const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    UsersLikes: [String],
    // likes: {
    //   type: Number,
    //   default: 0,
    //   min: 0,
    // },
    post: { type: String, minlength: [5, "post should be at least 5 letters"] },
    writer: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Post", PostSchema);
