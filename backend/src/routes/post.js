const express = require("express");
const verifyToken = require("../services/auth");
const router = express.Router();

const {
  getFollowing,
  userProfile,
  likePost,
  deletePost,
  getPosts,
  addPost,
  updatePost,
} = require("../controllers/postControllor");

// get all posts
router.get("/get-all", getPosts);

// add post
router.post("/add", verifyToken, addPost);

// update post
router.patch("/:id", verifyToken, updatePost);

// delete post
router.delete("/:id", verifyToken, deletePost);

// like post
router.patch("/like/:id", verifyToken, likePost);

// get user profile and posts by name
router.get("/user/:username", userProfile);

// get my followings posts
router.get("/following", verifyToken, getFollowing);

module.exports = router;
