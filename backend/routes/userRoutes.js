const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const {
  fetchPersonalInfo,
  fetchPersonalInfoById,
  updatePersonalInfo,
  updateResume,
  updateProfileImage,
} = require("../controllers/userController");

const router = express.Router();

// Lấy thông tin cá nhân
router.get("/", jwtAuth, fetchPersonalInfo);

// Lấy thông tin cá nhân theo id
router.get("/:id", jwtAuth, fetchPersonalInfoById);

// Cập nhật thông tin cá nhân
router.put("/", jwtAuth, updatePersonalInfo);

// Cập nhật resume
router.put("/resume", jwtAuth, updateResume);

// Cập nhật ảnh hồ sơ
router.put("/profile", jwtAuth, updateProfileImage);

module.exports = router