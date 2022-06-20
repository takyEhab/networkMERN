const express = require("express");
const verifyToken = require("../middleware/auth");
const router = express.Router();
const Post = require("../models/post");

// get all posts
router.get("/get-all", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// add post
router.post("/add", verifyToken, async (req, res) => {
  const { post } = req.body;
  // if no post
  if (!post) {
    return res.status(400).send("Post is required");
  }
  try {
    const newPost = await Post.create({
      post,
      writer: req.myInfo.username,
    });
    res.status(201).send(newPost);
  } catch (err) {
    res.status(400).send(err.errors.post.message);
  }
});

// update post
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.sendStatus(404);
    if (!req.body.post) {
      return res.status(400).send("Post is required");
    }
    if (post.writer === req.myInfo.username) {
      post.post = req.body.post;
      await post.save();
      return res.status(201).json({ post, message: "post edited" });
    } else {
      return res.status(403).json({ message: "Can't edit other users post" });
    }
  } catch (err) {
    err.name === "CastError"
      ? res.sendStatus(404)
      : res
          .status(400)
          .send(
            err.errors?.post.message ? err.errors.post.message : err.message
          );
  }
});

// delete post
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.sendStatus(404);
    if (post.writer === req.myInfo.username) {
      post.remove();
      return res.status(201).json({ post, message: "post deleted" });
    } else {
      return res.status(403).json({ message: "Can't delete other users post" });
    }
    // res.status(200).json({ post, message: 'post deleted' });
  } catch (err) {
    err.name === "CastError"
      ? res.sendStatus(404)
      : res.status(500).json({ message: err.message });
  }
});
router.patch("/like/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.sendStatus(404);
    if (post.UsersLikes.includes(req.myInfo.username)) {
      post.UsersLikes.splice(post.UsersLikes.indexOf(req.myInfo.username), 1);
      await post.save();
      return res.status(201).json({ post, message: "unlike" });
    } else {
      post.UsersLikes.push(req.myInfo.username);
      post.save();
      return res.status(201).json({ post, message: "like" });
    }
    // res.status(200).json({ message: "Liked" });
  } catch (err) {
    err.name === "CastError"
      ? res.sendStatus(404)
      : res.status(500).json({ message: err.message });
  }
});

module.exports = router;
