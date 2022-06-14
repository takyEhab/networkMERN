const express = require("express");
const verifyToken = require("../middleware/auth");
const router = express.Router();
const Post = require("../models/post");

router.get("/get-all", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});
router.post("/add", verifyToken, async (req, res) => {
  const { post } = req.body;
  // if no post
  if (!post) {
    return res.status(400).json("Post are required");
  }
  try {
    const newPost = await Post.create({
      post,
      writer: req.myInfo.username,
    });
    res.status(201).send(newPost);
  } catch (err) {
    res.status(400).send( err.errors.post.message)
  }

  // res.status(200).json({ post });
});

module.exports = router;
