const express = require("express");
const verifyToken = require("../services/auth");
const router = express.Router();
const { getMessages, sendMessage } = require("../controllers/messageController");


// send message
router.post("/", verifyToken, sendMessage);

// get messages
router.get("/:conversation_id", verifyToken, getMessages);

module.exports = router;
