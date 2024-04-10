const asyncHandler = require("express-async-handler");
const Chat = require("../models/Chat");
const User = require("../models/User");
const Application = require("../models/Application");

// tạo hoặc truy cập 1 đoạn chat 1-1
const accessChat = asyncHandler(async (req, res) => {
  const user = req.user;
  const userId = req.body.userId

  if (!userId) {
    console.log("Không có id user");
    return res.sendStatus(400);
  }

  // if (user.type == "recruiter") {
  //   console.log("here")
  // await Application.findOne({
  //   // "userId" : user.type == "recruiter" ? userId : user._id,
  //   // "recruiterId": user.type == "recruiter" ? user._id : userId
  //   "_id" : req.body.applicationId
  // })
  // .then((application) => {
  //   console.log(application)
  //   if (!(["shortlisted", "accepted", "finished"].includes(application.status))) {
  //     res.status(400).json({
  //       message : "Đơn cần được sơ tuyển để chat"
  //     })
  //   }
  // });

  let isChat = await Chat.find({
    $and: [
      { "users": { $elemMatch: { $eq: req.user._id } } },
      { "users": { $elemMatch: { $eq: req.body.userId } } },
    ],
  })
    .populate("userauths", "-password")
    .populate("latestMessage")
    .catch((err) => {
      console.log(err.message)
    })
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "email",
  });

  // nếu đã có đoạn chat
  if (isChat.length > 0) {
    // console.log(isChat[0])
    res.send(isChat[0]);
  }
  // nếu không có đoạn chat
  else {
    var chatData = {
      chatName: "sender",
      users: [req.user._id, userId],
    };
    
    try {
      const createdChat = await Chat.create(chatData);
      console.log("ok")
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("userauths", "-password");
      // console.log(fullChat)
      // res.status(200).json(fullChat);
      res.send(fullChat);
    } catch (error) {
      res.status(400);
      console.log(error.message)
      throw new Error(error.message);
    }
  }
  // tìm nếu đoạn chat đã có
});

module.exports = { accessChat };