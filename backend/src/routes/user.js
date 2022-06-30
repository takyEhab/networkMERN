const express = require("express");
const router = express.Router();
const verifyToken = require("../services/auth");
const {
  login,
  register,
  logout,
  myProfile,
  searchUser,
  followUser,
} = require("../controllers/userController");

// logging
router.post("/login", login);

// registering
router.post("/register", register);

// logout
router.post("/logout", verifyToken, logout);

// data of the logged in user
router.get("/profile", verifyToken, myProfile);

// search user
router.get("/users/:username", searchUser);

// follow user
router.patch("/follow/:id", verifyToken, followUser);

module.exports = router;
