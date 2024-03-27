const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const {
  fetchJobApplicants
} = require("../controllers/jobControllers");

const router = express.Router();

// Lấy danh sách applicant cho một job hoặc toàn bộ job (dành cho recruiter)
router.get("/", jwtAuth, fetchJobApplicants);

module.exports = router;