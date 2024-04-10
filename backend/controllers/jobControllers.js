const mongoose = require("mongoose");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Email = require("mongoose-type-email");


// Thêm 1 job (chỉ recruiter)
const addJob = (req, res) => {
  const user = req.user;

  if (user.type != "recruiter") {
    res.status(401).json({
      message: "Bạn không có quyền thêm việc làm",
    });
    return;
  }

  const data = req.body;

  let job = new Job({
    userId: user._id,
    title: data.title,
    maxApplicants: data.maxApplicants,
    maxPositions: data.maxPositions,
    dateOfPosting: data.dateOfPosting,
    deadline: data.deadline,
    skillsets: data.skillsets,
    jobType: data.jobType,
    duration: data.duration,
    salary: data.salary,
    rating: data.rating,
  });

  job
    .save()
    .then(() => {
      res.json({ message: "Việc làm đã được thêm vào cơ sở dữ liệu" });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

// Lấy tất cả job (có lọc)
const fetchJob = (req, res) => {
  
  let findParams = {};
  let sortParams = {};

  // lọc job của recruiter đang đăng nhập
  if (req.user) {
    let user = req.user;
    if (user.type === "recruiter" && req.query.myjobs) {
      findParams = {
        ...findParams,
        userId: user._id,
      };
    }
  }
  // lọc theo tên
  if (req.query.q) {
    findParams = {
      ...findParams,
      title: {
        $regex: new RegExp(req.query.q, "i"),
      },
    };
  }
  
  if (req.query.jobType) {
    let jobTypes = [];
    if (Array.isArray(req.query.jobType)) {
      jobTypes = req.query.jobType;
    } else {
      jobTypes = [req.query.jobType];
    }
    console.log(jobTypes);
    findParams = {
      ...findParams,
      jobType: {
        $in: jobTypes,
      },
    };
  }
  // lọc theo khoảng lương
  if (req.query.salaryMin && req.query.salaryMax) {
    findParams = {
      ...findParams,
      $and: [
        {
          salary: {
            $gte: parseInt(req.query.salaryMin),
          },
        },
        {
          salary: {
            $lte: parseInt(req.query.salaryMax),
          },
        },
      ],
    };
  } else if (req.query.salaryMin) {
    findParams = {
      ...findParams,
      salary: {
        $gte: parseInt(req.query.salaryMin),
      },
    };
  } else if (req.query.salaryMax) {
    findParams = {
      ...findParams,
      salary: {
        $lte: parseInt(req.query.salaryMax),
      },
    };
  }

  if (req.query.duration) {
    findParams = {
      ...findParams,
      duration: {
        $lt: parseInt(req.query.duration),
      },
    };
  }

  if (req.query.asc) {
    if (Array.isArray(req.query.asc)) {
      req.query.asc.map((key) => {
        sortParams = {
          ...sortParams,
          [key]: 1,
        };
      });
    } else {
      sortParams = {
        ...sortParams,
        [req.query.asc]: 1,
      };
    }
  }

  if (req.query.desc) {
    if (Array.isArray(req.query.desc)) {
      req.query.desc.map((key) => {
        sortParams = {
          ...sortParams,
          [key]: -1,
        };
      });
    } else {
      sortParams = {
        ...sortParams,
        [req.query.desc]: -1,
      };
    }
  }

  // console.log(findParams);
  // console.log(sortParams);

  // Job.find(findParams).collation({ locale: "en" }).sort(sortParams);
  // .skip(skip)
  // .limit(limit)

  // truy vấn
  let arr = [
    {
      $lookup: { // kết nối ngoài trái bảng Recruiter với bảng User với thuộc tính chung là userId
        from: "recruiterinfos",
        localField: "userId",
        foreignField: "userId",
        as: "recruiter",
      },
    },
    { $unwind: "$recruiter" },
    { $match: findParams },
  ];

  // thêm thứ tự sắp xếp nếu có
  if (Object.keys(sortParams).length > 0) {
    arr = [
      {
        $lookup: {
          from: "recruiterinfos",
          localField: "userId",
          foreignField: "userId",
          as: "recruiter",
        },
      },
      { $unwind: "$recruiter" },
      { $match: findParams },
      {
        $sort: sortParams,
      },
    ];
  }

  // console.log(arr);

  // truy vấn các document trong collection Job, gắn trường recruiter có userId tương ứng vào cuối
  Job.aggregate(arr)
    .then((posts) => {
      if (posts == null) {
        res.status(404).json({
          message: "Không tìm được việc làm nào",
        });
        return;
      }
      res.json(posts);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

// Lấy thông tin 1 job theo id
const getJobInfo = (req, res) => {
  Job.findOne({ _id: req.params.id })
    .then((job) => {
      if (job == null) {
        res.status(400).json({
          message: "Việc làm không tồn tại",
        });
        return;
      }
      res.json(job);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

// Cập nhật thông tin 1 job (chỉ recruiter)
const updateJobInfo = (req, res) => {
  const user = req.user;
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "Bạn không có quyền cập nhật thông tin việc làm",
    });
    return;
  }
  Job.findOne({
    _id: req.params.id,
    userId: user.id,
  })
    .then((job) => {
      if (job == null) {
        res.status(404).json({
          message: "Việc làm không tồn tại",
        });
        return;
      }
      // cập nhật thông tin job
      const data = req.body;
      if (data.maxApplicants) {
        job.maxApplicants = data.maxApplicants;
      }
      if (data.maxPositions) {
        job.maxPositions = data.maxPositions;
      }
      if (data.deadline) {
        job.deadline = data.deadline;
      }
      // lưu thông tin đã cập nhật vào db
      job
        .save()
        .then(() => {
          res.json({
            message: "Đã cập nhật thông tin việc làm",
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

// Xóa 1 job
const deleteJob = (req, res) => {
  const user = req.user;
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "Bạn không có quyền xóa việc làm",
    });
    return;
  }
  // truy vấn và xóa job
  Job.findOneAndDelete({
    _id: req.params.id,
    userId: user.id,
  })
    .then((job) => {
      if (job === null) {
        res.status(401).json({
          message: "Bạn không có quyền xóa việc làm",
        });
        return;
      }
      res.json({
        message: "Đã xóa việc làm",
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
}

// Ứng tuyển 1 job
const applyAJob = (req, res) => {
  const user = req.user;
  if (user.type != "applicant") {
    res.status(401).json({
      message: "Bạn không có quyền ứng tuyển việc làm",
    });
    return;
  }
  const data = req.body;
  const jobId = req.params.id;

  // kiểm tra xem đã ứng tuyển job này trước đó chưa
  // kiểm tra xem số đơn ứng tuyển của job đã đạt giới hạn chưa
  // kiểm tra xem user có đang có ít hơn 10 đơn ứng tuyển và user có đơn nào được chấp thuận chưa

  Application.findOne({
    userId: user._id,
    jobId: jobId,
    status: {
      $nin: ["deleted", "accepted", "cancelled"], // not in
    },
  })
    .then((appliedApplication) => {
      console.log(appliedApplication);
      if (appliedApplication !== null) {
        res.status(400).json({
          message: "Bạn đã ứng tuyển việc làm này",
        });
        return;
      }

      Job.findOne({ _id: jobId })
        .then((job) => {
          if (job === null) {
            res.status(404).json({
              message: "Công việc không tồn tại",
            });
            return;
          }
          // đếm số đơn applied/shortlisted/accepted của job này
          Application.countDocuments({
            jobId: jobId,
            status: {
              $nin: ["rejected", "deleted", "cancelled", "finished"], // applied, shortlisted
            },
          })
            .then((activeApplicationCount) => {
              // kiểm tra số đơn applied/shortlisted/accepted của job này có ít hơn số đơn tối đa không
              if (activeApplicationCount < job.maxApplicants) {
                Application.countDocuments({
                  userId: user._id,
                  status: {
                    $nin: ["rejected", "deleted", "cancelled", "finished"],
                  },
                })
                  .then((myActiveApplicationCount) => {
                    // kiểm tra xem user hiện ứng tuyển ít hơn 10 job không
                    if (myActiveApplicationCount < 10) {
                      Application.countDocuments({
                        userId: user._id,
                        status: "accepted",
                      }).then((acceptedJobs) => {
                        if (acceptedJobs === 0) {
                          const application = new Application({
                            userId: user._id,
                            recruiterId: job.userId,
                            jobId: job._id,
                            status: "applied",
                            sop: data.sop,
                          });
                          // lưu vào db
                          application
                            .save()
                            .then(() => {
                              res.json({
                                message: "Ứng tuyển thành công",
                              });
                            })
                            .catch((err) => {
                              res.status(400).json(err);
                            });
                        } else {
                          res.status(400).json({
                            message:
                              "Bạn đã được chấp nhận ở công việc khác và không thể ứng tuyển.",
                          });
                        }
                      });
                    } else {
                      res.status(400).json({
                        message:
                          "Bạn có 10 đơn ứng tuyển còn hoạt động và không thể ứng tuyển thêm.",
                      });
                    }
                  })
                  .catch((err) => {
                    res.status(400).json(err);
                  });
              } else {
                res.status(400).json({
                  message: "Công việc đã đạt giới hạn ứng tuyển",
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
    })
    .catch((err) => {
      res.json(400).json(err);
    });
}

// Lấy tất cả đơn ứng tuyển của 1 job
const fetchJobApplications = (req, res) => {
  const user = req.user;
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "Bạn không có quyền xem danh sách ứng tuyển của việc làm này",
    });
    return;
  }
  const jobId = req.params.id;

  let findParams = {
    jobId: jobId,
    recruiterId: user._id,
  };
  let sortParams = {};

  if (req.query.status) {
    findParams = {
      ...findParams,
      status: req.query.status,
    };
  }

  // truy vấn danh sách đơn ứng tuyển của job
  Application.find(findParams)
    .collation({ locale: "en" })
    .sort(sortParams)
    // .skip(skip)
    // .limit(limit)
    .then((applications) => {
      res.json(applications);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
}

// Lấy danh sách applicant cho một job hoặc toàn bộ job (dành cho recruiter)
const fetchJobApplicants = (req, res) => {
  const user = req.user;
  if (user.type === "recruiter") {
    // các tham số lọc
    let findParams = {
      recruiterId: user._id,
    };
    if (req.query.jobId) {
      findParams = {
        ...findParams,
        jobId: new mongoose.Types.ObjectId(req.query.jobId),
      };
    }
    if (req.query.status) {
      if (Array.isArray(req.query.status)) {
        findParams = {
          ...findParams,
          status: { $in: req.query.status },
        };
      } else {
        findParams = {
          ...findParams,
          status: req.query.status,
        };
      }
    }
    
    // tham số sắp xếp
    let sortParams = {};
    if (!req.query.asc && !req.query.desc) {
      sortParams = { _id: 1 };
    }
    if (req.query.asc) {
      if (Array.isArray(req.query.asc)) {
        req.query.asc.map((key) => {
          sortParams = {
            ...sortParams,
            [key]: 1,
          };
        });
      } else {
        sortParams = {
          ...sortParams,
          [req.query.asc]: 1,
        };
      }
    }
    if (req.query.desc) {
      if (Array.isArray(req.query.desc)) {
        req.query.desc.map((key) => {
          sortParams = {
            ...sortParams,
            [key]: -1,
          };
        });
      } else {
        sortParams = {
          ...sortParams,
          [req.query.desc]: -1,
        };
      }
    }

    Application.aggregate([ // với mỗi document application có userId = X
      {
        $lookup: { // tìm tất cả document applicant có userId = X, đặt trong 1 array, và gán array đó vào cuối document application với thuộc tính "jobApplicant" 
          from: "jobapplicantinfos",
          localField: "userId",
          foreignField: "userId",
          as: "jobApplicant",
        },
      },
      { $unwind: "$jobApplicant" }, // tách document application thành nhiều document khác nhau, trong đó mỗi document mới có thuộc tính "jobApplicant" là 1 phần tử trong thuộc tính array "jobApplication" của document ban đầu
      {
        $lookup: {
          from: "userauths",
          localField: "userId",
          foreignField: "_id",
          pipeline: [
            { $project : {
              _id : 0,
              email : 1
            }}
          ],
          as: "jobApplicantMail"
        }
      },
      // {
      //   $project: {
      //     "_id" : 0,
      //     "email": 1,
      //     "password" : 0,
      //     "type" : 0
      //   }
      // },
      { $unwind: "$jobApplicantMail" },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      { $match: findParams }, // khớp với giá trị các tham số lọc
      { $sort: sortParams }, // sắp xếp theo giá trị các tham số sắp xếp
    ])
      .then((applications) => {
        if (applications.length === 0) {
          res.status(404).json({
            message: "Không tìm thấy đơn ứng tuyển",
          });
          return;
        }
        res.json(applications);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(400).json({
      message: "Không đủ quyền truy cập danh sách ứng viên",
    });
  }
};

module.exports = { 
  addJob, 
  fetchJob, 
  getJobInfo, 
  updateJobInfo, 
  deleteJob, 
  applyAJob, 
  fetchJobApplications, 
  fetchJobApplicants 
};