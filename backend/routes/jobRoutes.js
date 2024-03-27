const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const { addJob, 
  fetchJob, 
  getJobInfo, 
  updateJobInfo, 
  deleteJob, 
  applyAJob, 
  fetchJobApplications, 
  fetchJobApplicants
} = require("../controllers/jobControllers");

const router = express.Router();



// Thêm 1 job
router.post("/", jwtAuth, addJob);

// Đọc tất cả job (có lọc)
router.get("/", jwtAuth, fetchJob);

// Đọc thông tin 1 job theo id
router.get("/:id", jwtAuth, getJobInfo);

// Cập nhật thông tin 1 job (chỉ recruiter)
router.put("/:id", jwtAuth, updateJobInfo);

// Xóa 1 job
router.delete("/:id", jwtAuth, deleteJob);

// Ứng tuyển một job (chỉ applicant)
router.post("/:id/applications", jwtAuth, applyAJob);


// Lấy tất cả đơn ứng tuyển của 1 job
router.get("/:id/applications", jwtAuth, fetchJobApplications);



module.exports = router;