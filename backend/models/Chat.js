const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true
    },
    users: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAuth"
    }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", schema);