const Message = require("../models/message");
const Conversation = require("../models/conversation");

const sendMessage = async (req, res) => {
  const { conversationId, text } = req.body;
  // if no post
  if (!conversationId || !text) {
    return res.status(400).send("conversationId, text are required");
  }

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).send("conversation does not exist");
    }
  } catch (err) {
    if (err.name === "CastError")
      return res.status(404).send("conversation does not exist");
  }

  try {
    const newMessage = await Message.create({
      ...req.body,
      sender: req.myInfo.username,
    });
    res.status(201).send(newMessage);
  } catch (err) {
    res.status(500).json(err);
  }
};


const getMessages = async (req, res) => {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversation_id,
      });
      res.status(200).send(messages);
    } catch (err) {
      res.status(500).json(err);
    }
}
  
module.exports = {sendMessage, getMessages}