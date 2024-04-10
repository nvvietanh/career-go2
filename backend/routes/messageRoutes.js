const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const { 
  allMessages,
  sendMessage
} = require("../controllers/messageController");

const router = express.Router();

router.get("/:chatId", jwtAuth, allMessages);
router.post("/", jwtAuth, sendMessage);

module.exports = router;