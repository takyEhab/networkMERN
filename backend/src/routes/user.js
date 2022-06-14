const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const verifyToken = require("../middleware/auth");

router.get("/profile", verifyToken, async (req, res) => {
  res.status(200).json(req.myInfo);
});
router.post("/logout", verifyToken, async (req, res) => {
  // res.status(200).json(req.myInfo)
  delete req.myInfo;
  res.status(201).json({ message: "Logged out" });
});
// logging
router.post("/login", async (req, res) => {
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
      res.status(200).json({ user, token });
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

// registering
router.post("/register", async (req, res) => {
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
    res.status(500).json(err);
  }
});


module.exports = router;
