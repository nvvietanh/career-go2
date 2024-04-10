const User = require("../models/User");
const Recruiter = require("../models/Recruiter");
const JobApplicant = require("../models/JobApplicant");

// lấy thông tin cá nhân
const fetchPersonalInfo = (req, res) => {
  const user = req.user;
  if (user.type === "recruiter") {
    Recruiter.findOne({ userId: user._id })
      .then((recruiter) => {
        if (recruiter == null) {
          res.status(404).json({
            message: "Người dùng không tồn tại",
          });
          return;
        }
        res.json(recruiter);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    JobApplicant.findOne({ userId: user._id })
      .then((jobApplicant) => {
        if (jobApplicant == null) {
          res.status(404).json({
            message: "Người dùng không tồn tại",
          });
          return;
        }
        res.json(jobApplicant);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
}

// lấy thông tin cá nhân theo id
const fetchPersonalInfoById = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((userData) => {
      if (userData === null) {
        res.status(404).json({
          message: "Người dùng không tồn tại",
        });
        return;
      }

      if (userData.type === "recruiter") {
        Recruiter.findOne({ userId: userData._id })
          .then((recruiter) => {
            if (recruiter === null) {
              res.status(404).json({
                message: "Người dùng không tồn tại",
              });
              return;
            }
            res.json(recruiter);
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      } else {
        JobApplicant.findOne({ userId: userData._id })
          .then((jobApplicant) => {
            if (jobApplicant === null) {
              res.status(404).json({
                message: "Người dùng không tồn tại",
              });
              return;
            }
            res.json(jobApplicant);
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
}

// cập nhật thông tin cá nhân
const updatePersonalInfo = (req, res) => {
  const user = req.user;
  const data = req.body;
  if (user.type == "recruiter") {
    Recruiter.findOne({ userId: user._id })
      .then((recruiter) => {
        if (recruiter == null) {
          res.status(404).json({
            message: "Người dùng không tồn tại",
          });
          return;
        }
        if (data.name) {
          recruiter.name = data.name;
        }
        if (data.contactNumber) {
          recruiter.contactNumber = data.contactNumber;
        }
        if (data.bio) {
          recruiter.bio = data.bio;
        }
        recruiter
          .save()
          .then(() => {
            res.json({
              message: "Đã cập nhật thông tin người dùng",
            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    JobApplicant.findOne({ userId: user._id })
      .then((jobApplicant) => {
        if (jobApplicant == null) {
          res.status(404).json({
            message: "Người dùng không tồn tại",
          });
          return;
        }
        if (data.name) {
          jobApplicant.name = data.name;
        }
        if (data.education) {
          jobApplicant.education = data.education;
        }
        if (data.skills) {
          jobApplicant.skills = data.skills;
        }
        // if (data.resume) {
        //   jobApplicant.resume = data.resume;
        // }
        // if (data.profile) {
        //   jobApplicant.profile = data.profile;
        // }
        console.log(jobApplicant);
        jobApplicant
          .save()
          .then(() => {
            res.json({
              message: "Đã cập nhật thông tin người dùng",
            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
}

// cập nhật resume
const updateResume = (req, res) => {
  const user = req.user;
  const data = req.body;
  JobApplicant.findOne({ userId: user._id })
    .then((applicant) => {
      if (applicant == null) {
        res.status(404).json({
          message: "Người dùng không tồn tại",
        });
        return;
      }
      if (data.type == "resume" && data.content) {
        applicant.resume = data.content;
      }
      applicant.save()
        .then(() => {
          res.json({
            message: "Đã cập nhật Resume",
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

// cập nhật ảnh hồ sơ
const updateProfileImage = (req, res) => {
  const user = req.user;
  const data = req.body;
  JobApplicant.findOne({ userId: user._id })
    .then((applicant) => {
      if (applicant == null) {
        res.status(404).json({
          message: "Người dùng không tồn tại",
        });
        return;
      }
      if (data.type == "profile" && data.content) {
        applicant.profile = data.content;
      }
      applicant.save()
        .then(() => {
          res.json({
            message: "Đã cập nhật ảnh hồ sơ",
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

module.exports = {
  fetchPersonalInfo,
  fetchPersonalInfoById,
  updatePersonalInfo,
  updateResume,
  updateProfileImage,
};