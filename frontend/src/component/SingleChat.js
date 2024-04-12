import { useState, useEffect, useContext } from "react";
import { Box, Input, makeStyles, FormControl, OutlinedInput, InputLabel, TextField, Grid } from "@material-ui/core";
import axios from "axios";
import { SetPopupContext } from "../App";
import ScrollableChat from "./ScrollableChat";
import { socket } from "../service/socket";

// var socket
var chatCompare;

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  messages: {
    display: "flex",
    flexDirection: "column",
    overflowY: "scroll",
    scrollbarWidth: "none",
  }
}));

const SingleChat = (props) => {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const setPopup = useContext(SetPopupContext);
  
  const [chat, setChat] = useState(props.chat);
  const [user, setUser] = useState({ "_id" : localStorage.getItem("userId")});
  const [rcvUser, setRcvUser] = useState(props.rcvUser);

  const fetchMessages = () => {
    console.log(chat)
    // console.log(user)
    if (!chat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/message/${chat._id}`,
        config
      ).then((res) => {
        console.log(res.data)
        setMessages(res.data);
        console.log(messages)
        socket.emit("join chat", chat._id);
      })

    } catch (error) {
      setPopup({
        open: true,
        severity: "error",
        message: "Không thể tải tin nhắn",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", chat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/message`,
          {
            content: newMessage,
            chatId: chat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        console.log(error)
        setPopup({
          open: true,
          severity: "error",
          message: "Không thể gửi tin nhắn",
        });
      }
    }
  };
  
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // if (!socketConnected) return;

    // console.log(newMessage)
  }

  useEffect(() => {
    // socket = io(ENDPOINT);
    socket.emit("setup", { "_id" : localStorage.getItem("userId") });
    socket.on("connected", () => setSocketConnected(true));

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/chat`,
        { "userId" : rcvUser.userId,
          "applicationId" : props.applicationId
        },
        config
      )
      .then((res) => {
        console.log(res.data)
        setChat(res.data);
        console.log(chat)
      })
      .catch((err) => {
        console.log(err.response);
        // console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
      });

      // if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      // onClose();
    } catch (error) {
      setPopup({
        open: true,
        severity: "error",
        message: "Có lỗi xảy ra",
      });
    }

  }, []);

  useEffect(() => {
    fetchMessages();
    chatCompare = chat;
  }, [chat, user]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      console.log("socket on msg revcieved")
      if (
        !chatCompare || // if chat is not selected or doesn't match current chat
        chatCompare._id !== newMessageRecieved.chat._id
      ) {

      } else {
        setMessages([...messages, newMessageRecieved]);
        console.log(newMessageRecieved)
      }
      setPopup({
        open: true,
        severity: "info",
        message: "Có tin nhắn mới",
      });
    });
  });

  return (
    <>
      <Box 
        width="100%"
        height="100%" 
        borderRadius="lg"
        bgcolor="#f8f8f8"
        justifyContent="flex-end"
        style={{
          display: "flex",
          paddingBottom:"5px",
          justifyContent: "flex-end",
          flexDirection: "column",
          overflowY: "hidden",
        }}
      >
        <div style={{
          display:"flex",
          flexDirection:"column",
          overflowY:"scroll",
          scrollbarWidth:"none"
        }}>
          <ScrollableChat user={user} messages={messages}/>
        </div>
      </Box>
      {/* <Grid item> */}
      {/* </Grid> */}
        <TextField label="Nhắn tin" variant="outlined"
          onChange={typingHandler} onKeyDown={sendMessage} value={newMessage}
          style={{display:"flex", width:"100%", paddingTop: "5px"}}/>
    </>
  )
}

export default SingleChat;