const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
      res.status(400).send("username and password are required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, username },
        process.env.TOKEN_KEY,
        { expiresIn: "3d" }
      );
      // user
      return res.status(200).json({ user, token });
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
};

const register = async (req, res) => {
  try {
    const { username, password, password2 } = req.body;
    if (!(username && password && password2)) {
      res.status(400).send("username and password and password2 are required");
    }

    if (await User.findOne({ username })) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    if (password !== password2) {
      res.status(400).send("password must match");
    }
    encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, username },
      process.env.TOKEN_KEY,
      { expiresIn: "3d" }
    );

    // return new user
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const logout = async (req, res) => {
  // res.status(200).json(req.myInfo)
  delete req.myInfo;
  res.status(201).json({ message: "Logged out" });
};

const myProfile = async (req, res) => {
  res.status(200).json(req.myInfo);
};

const searchUser = async (req, res) => {
  // TODO as Django
  const re = new RegExp(`${req.params.username}`, "i");

  const users = await User.find(
    { username: re },
    "username followers following"
  ).exec();

  res.send(users);
};

const followUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "username followers following"
    );
    // see if the user exists
    if (!user) return res.sendStatus(404);
    // see if he is already followed by me or not
    const followObject = user.followers.find(
      (follow) => follow.user === req.myInfo.username
    );

    // if yes un follow, and remove my name from his followers list and his name from my following list
    //  and send you unfollowed ' his username' succsefly
    // if no yo do the opposite

    if (followObject) {
      await User.updateOne(
        { _id: req.myInfo._id },
        { $pull: { following: { user: user.username } } }
      );
      const index = user.followers.findIndex(
        (element) => element.user === req.myInfo.username
      );
      user.followers.splice(index, 1);
      await user.save();

      return res.json({ user, operation: "Unfollow" });
    } else {
      await User.updateOne(
        { _id: req.myInfo._id },
        { $push: { following: { user: user.username } } }
      );
      user.followers.push({ user: req.myInfo.username });
      await user.save();

      return res.json({ user, operation: "follow" });
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = { login, register, logout, myProfile, searchUser, followUser };
