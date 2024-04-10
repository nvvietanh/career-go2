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
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/message", require("./routes/messageRoutes"));

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

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}!`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    console.log("User connected: " + userData._id)
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    // console.log(newMessageRecieved);

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
      console.log("socket.on.newmsg")
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});