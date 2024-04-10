const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const {
  updateRating,
  fetchRating
} = require("../controllers/ratingController");

const router = express.Router();

// Thêm hoặc cập nhật đánh giá // Sau khi thêm đánh giá phải cập nhật luôn
router.put("/", jwtAuth, updateRating);

// Đọc đánh giá
router.get("/", jwtAuth, fetchRating);

module.exports = router;