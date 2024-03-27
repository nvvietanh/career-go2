const Application = require("../models/Application");

// Applicant đọc tất cả đơn ứng tuyển của mình/Recruiter đọc tất cả đơn ứng tuyển của job của mình.
const fetchApplicaions = (req, res) => {
  const user = req.user;

  Application.aggregate([
    {
      $lookup: {
        from: "jobapplicantinfos",
        localField: "userId",
        foreignField: "userId",
        as: "jobApplicant",
      },
    },
    { $unwind: "$jobApplicant" },
    {
      $lookup: {
        from: "jobs",
        localField: "jobId",
        foreignField: "_id",
        as: "job",
      },
    },
    { $unwind: "$job" },
    {
      $lookup: {
        from: "recruiterinfos",
        localField: "recruiterId",
        foreignField: "userId",
        as: "recruiter",
      },
    },
    { $unwind: "$recruiter" },
    {
      $match: {
        [user.type === "recruiter" ? "recruiterId" : "userId"]: user._id,
      },
    },
    {
      $sort: {
        dateOfApplication: -1,
      },
    },
  ])
    .then((applications) => {
      res.json(applications);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
}

// Cập nhật trạng thái đơn ứng tuyển
const updateApplicationStatus = (req, res) => {
  const user = req.user;
  const id = req.params.id;
  const status = req.body.status;

  // "applied", // ứng tuyển
  // "shortlisted", // được sơ tuyển
  // "accepted", // được chấp nhận
  // "rejected", // bị từ chối
  // "deleted", // job bị xóa kéo theo đơn bị xóa
  // "cancelled", // đơn bị từ chối bởi nhà tuyển dụng hoặc job đã chấp nhận đủ đơn.
  // "finished", // công việc của applicant kết thúc

  if (user.type === "recruiter") {
    if (status === "accepted") {

      // lấy id job từ application để lấy số vị trí tối đa của job
      // lấy số application đã được chấp nhận
      // lưu nếu thỏa mãn điều kiện
      Application.findOne({
        _id: id,
        recruiterId: user._id,
      })
        .then((application) => {
          if (application === null) {
            res.status(404).json({
              message: "Không tìm thấy đơn ứng tuyển",
            });
            return;
          }

          Job.findOne({
            _id: application.jobId,
            userId: user._id,
          }).then((job) => {
            if (job === null) {
              res.status(404).json({
                message: "Công việc không tồn tại",
              });
              return;
            }

            Application.countDocuments({
              recruiterId: user._id,
              jobId: job._id,
              status: "accepted",
            }).then((activeApplicationCount) => {
              if (activeApplicationCount < job.maxPositions) {
                // accepted
                application.status = status;
                application.dateOfJoining = req.body.dateOfJoining;
                application
                  .save()
                  .then(() => {
                    // từ chối các đơn ứng tuyển khác nếu đã chấp nhận đủ số lượng
                    Application.updateMany(
                      {
                        _id: {
                          $ne: application._id,
                        },
                        userId: application.userId,
                        status: {
                          $nin: [ "rejected", "deleted", "cancelled", "accepted","finished", ],
                        },
                      },
                      {
                        $set: {
                          status: "cancelled",
                        },
                      },
                      { multi: true }
                    )
                      .then(() => {
                        if (status === "accepted") {
                          Job.findOneAndUpdate(
                            {
                              _id: job._id,
                              userId: user._id,
                            },
                            {
                              $set: {
                                acceptedCandidates: activeApplicationCount + 1,
                              },
                            }
                          )
                            .then(() => {
                              res.json({
                                message: `Cập nhật trạng thái thành công`,
                              });
                            })
                            .catch((err) => {
                              res.status(400).json(err);
                            });
                        } else {
                          res.json({
                            message: `Cập nhật trạng thái thành công`,
                          });
                        }
                      })
                      .catch((err) => {
                        res.status(400).json(err);
                      });
                  })
                  .catch((err) => {
                    res.status(400).json(err);
                  });
              } else {
                res.status(400).json({
                  message: "Công việc này không còn vị trí trống",
                });
              }
            });
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      Application.findOneAndUpdate(
        {
          _id: id,
          recruiterId: user._id,
          status: {
            $nin: ["rejected", "deleted", "cancelled"],
          },
        },
        {
          $set: {
            status: status,
          },
        }
      )
        .then((application) => {
          if (application === null) {
            res.status(400).json({
              message: "Không thể cập nhật trạng thái đơn",
            });
            return;
          }
          if (status === "finished") {
            res.json({
              message: `Cập nhật trạng thái thành công`,
            });
          } else {
            res.json({
              message: `Cập nhật trạng thái thành công`,
            });
          }
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    }
  } else {
    if (status === "cancelled") {
      console.log(id);
      console.log(user._id);
      Application.findOneAndUpdate(
        {
          _id: id,
          userId: user._id,
        },
        {
          $set: {
            status: status,
          },
        }
      )
        .then((tmp) => {
          console.log(tmp);
          res.json({
            message: `Cập nhật trạng thái thành công`,
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      res.status(401).json({
        message: "Không đủ quyền thực hiện tác vụ",
      });
    }
  }
};

module.exports = {
  fetchApplicaions,
  updateApplicationStatus
}