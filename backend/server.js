const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passportConfig = require("./middlewares/passportConfig");
const cors = require("cors");
const fs = require("fs");
const morgan = require("morgan");

require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((res) => console.log("Connected to DB"))
  .catch((err) => console.log(err));

const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(morgan('dev'));

// Setting up middlewares
// app.use(cors(
//   {
//     origin: ["*"],
//     methods: ["POST", "GET", "PUT"],
//     credentials: true,
//   }
// ));

app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());

// Add routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/rating", require("./routes/ratingRoutes"));
app.use("/api/applicants", require("./routes/applicantRoutes"));

// app.use("/api", require("./routes/apiRoutes"));
// app.use("/upload", require("./routes/uploadRoutes"));

app.use((req, res, next) => {
  const error = new Error('Không tìm thấy trang');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status = 500;
  return res.status(statusCode).json({
      status: 'error',
      code: statusCode,
      stack: error.stack,
      message: error.message = 'Internal Server Error'
  })
});

app.get("/", (req, res) => {
  res.send("API is running...");
})

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}!`);
});
