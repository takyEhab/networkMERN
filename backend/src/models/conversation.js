const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    participants: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
