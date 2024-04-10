const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    maxApplicants: {
      type: Number,
      validate: [
        {
          validator: Number.isInteger,
          msg: "Số ứng viên tối đa phải là số nguyên lớn hơn 0",
        },
        {
          validator: function (value) {
            return value > 0;
          },
          msg: "Số ứng viên tối đa phải lớn hơn 0",
        },
      ],
    },
    maxPositions: {
      type: Number,
      validate: [
        {
          validator: Number.isInteger,
          msg: "Số vị trí còn lại phải là số nguyên lớn hơn 0",
        },
        {
          validator: function (value) {
            return value > 0;
          },
          msg: "Số vị trí còn lại phải lớn hơn 0",
        },
      ],
    },
    activeApplications: {
      type: Number,
      default: 0,
      validate: [
        {
          validator: Number.isInteger,
          msg: "Đơn ứng tuyển còn hoạt động phải là số nguyên",
        },
        {
          validator: function (value) {
            return value >= 0;
          },
          msg: "Đơn ứng tuyển còn hoạt động phải lớn hơn hoặc bằng 0",
        },
      ],
    },
    acceptedCandidates: {
      type: Number,
      default: 0,
      validate: [
        {
          validator: Number.isInteger,
          msg: "Ứng viên đã chấp nhận phải là số nguyên",
        },
        {
          validator: function (value) {
            return value >= 0;
          },
          msg: "Ứng viên đã chấp nhận phải lớn hơn hoặc bằng 0",
        },
      ],
    },
    dateOfPosting: {
      type: Date,
      default: Date.now,
      timezone: 'Asia/Ho_Chi_Minh'
    },
    deadline: {
      type: Date,
      validate: [
        {
          validator: function (value) {
            return this.dateOfPosting < value;
          },
          msg: "Hạn nộp đơn phải lớn hơn thời gian tạo",
        },
      ],
    },
    skillsets: [String],
    jobType: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      min: 0,
      validate: [
        {
          validator: Number.isInteger,
          msg: "Thời lượng phải là số nguyên",
        },
      ],
    },
    salary: {
      type: Number,
      validate: [
        {
          validator: Number.isInteger,
          msg: "Lương phải là số nguyên lớn hơn 0",
        },
        {
          validator: function (value) {
            return value >= 0;
          },
          msg: "Lương phải là số dương",
        },
      ],
    },
    rating: {
      type: Number,
      max: 5.0,
      default: -1.0,
      validate: {
        validator: function (v) {
          return v >= -1.0 && v <= 5.0;
        },
        msg: "Đánh giá không hợp lệ",
      },
    },
  },
  { collation: { locale: "en" } }
);

module.exports = mongoose.model("jobs", schema);
