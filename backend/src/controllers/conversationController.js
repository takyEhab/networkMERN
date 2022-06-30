const Conversation = require("../models/conversation");
const User = require("../models/user");

// create conversation
const createConversation = async (req, res) => {
  const { receiver } = req.body;
  // if no Conversation
  if (!receiver) {
    return res.status(400).send("receiver or receivers are required");
  }
  const receivers = Array.isArray(receiver) ? receiver : [receiver];

  const user = await User.findOne({ username: { $in: receivers } }).exec();

  if (!user)
    return res.status(404).send("one of the receivers username does not exist");
  if (receivers.includes(req.myInfo.username))
    return res.status(400).send("you can not start conversation with yourself");

  try {
    const newConversation = await Conversation.create({
      participants: [req.myInfo.username, ...receivers],
    });
    res.status(201).send(newConversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

// get my conversation
const getConversation = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.myInfo.username,
    }).exec();
    if (!conversations) return res.sendStatus(404);

    res.status(201).send(conversations);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createConversation,
  getConversation,
};
