const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "applied", // ứng tuyển
        "shortlisted", // được sơ tuyển
        "accepted", // được chấp nhận
        "rejected", // bị từ chối
        "deleted", // job bị xóa kéo theo đơn bị xóa
        "cancelled", // đơn bị từ chối bởi nhà tuyển dụng hoặc job đã chấp nhận đủ đơn.
        "finished", // công việc của applicant kết thúc
      ],
      default: "applied",
      required: true,
    },
    dateOfApplication: {
      type: Date,
      default: Date.now,
    },
    dateOfJoining: {
      type: Date,
      validate: [
        {
          validator: function (value) {
            return this.dateOfApplication <= value;
          },
          msg: "dateOfJoining should be greater than dateOfApplication",
        },
      ],
    },
    sop: {
      type: String,
      validate: {
        validator: function (v) {
          return v.split(" ").filter((ele) => ele != "").length <= 250;
        },
        msg: "Statement of purpose should not be greater than 250 words",
      },
    },
  },
  { collation: { locale: "en" } }
);

// schema.virtual("applicationUser", {
//   ref: "JobApplicantInfo",
//   localField: "userId",
//   foreignField: "userId",
//   justOne: true,
// });

// schema.virtual("applicationRecruiter", {
//   ref: "RecruiterInfo",
//   localField: "recruiterId",
//   foreignField: "userId",
//   justOne: true,
// });

// schema.virtual("applicationJob", {
//   ref: "jobs",
//   localField: "jobId",
//   foreignField: "_id",
//   justOne: true,
// });

module.exports = mongoose.model("applications", schema);
