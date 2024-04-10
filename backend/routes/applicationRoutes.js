const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const { 
  fetchApplicaions,
  updateApplicationStatus
} = require("../controllers/applicationController");

const router = express.Router();

// Applicant đọc tất cả đơn ứng tuyển của mình/Recruiter đọc tất cả đơn ứng tuyển của job của mình.
router.get("/", jwtAuth, fetchApplicaions);

// // Cập nhật trạng thái của đơn ứng tuyển: [Applicant: có thể hủy đơn, Recruiter: có thể sơ tuyển, chấp nhận, từ chối]
router.put("/:id", jwtAuth, updateApplicationStatus);

module.exports = router;