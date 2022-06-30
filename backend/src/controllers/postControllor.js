const Post = require("../models/post");
const User = require("../models/user");

const getPosts = async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
};

const updatePost = async (req, res) => {
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
};

const addPost = async (req, res) => {
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
};

const deletePost = async (req, res) => {
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
};

const likePost = async (req, res) => {
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
};

const userProfile = async (req, res) => {
  try {
    const user = await User.findOne(
      { username: req.params.username },
      "username followers following"
    ).exec();
    if (!user) return res.sendStatus(404);
    const userPosts = await Post.find({ writer: req.params.username }).exec();

    res.json({ user, userPosts });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getFollowing = async (req, res) => {
  const names = req.myInfo.following.map(function (obj) {
    return obj.user;
  });

  const posts = await Post.find({ writer: { $in: names } }).exec();
  res.json(posts);
};

module.exports = {getPosts, updatePost,addPost, deletePost, likePost, userProfile, getFollowing };
