const express = require("express");
const verifyToken = require("../services/auth");
const router = express.Router();
const { createConversation, getConversation } = require("../controllers/conversationController");

// create conversation with participants [me and receivers]
router.post("/", verifyToken, createConversation);

// my conversations
router.get("/mine", verifyToken, getConversation);

module.exports = router;
