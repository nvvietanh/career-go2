const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");
const User = require("../models/User");
const Chat = require("../models/Chat");


// lấy tin nhắn trong một đoạn chat
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// tạo tin nhắn mới
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  // console.log(content)
  // console.log(chatId)
  // console.log(req.user._id)
  
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }
  
  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  
  try {
    var message = await Message.create(newMessage);
    
    message = await message.populate("sender", "email").execPopulate();
    message = await message.populate("chat").execPopulate();
    console.log("ok")
    message = await User.populate(message, {
      path: "chat.users",
      select: "email",
    });
    // console.log(message)
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(400);
    console.log(error.message)
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };