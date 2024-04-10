const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const { 
  accessChat
} = require("../controllers/chatController");

const router = express.Router();

router.post("/", jwtAuth, accessChat);

module.exports = router;
