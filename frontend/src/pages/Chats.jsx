import { useState, useEffect, useCallback, useRef } from "react";
import { Box, Button, TextareaAutosize, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";

import Conversation from "../components/Conversation";
import Message from "../components/Message";
import api from "../axios";
import { useSnackbar } from "notistack";
import { io } from "socket.io-client";

export default function Chats() {
  const [conversations, setConversations] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const myInfoState = useSelector((state) => state.myInfoState);
  const scrollRef = useRef();
  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:5000");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderName,
        text: data.message,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      conversation?.participants.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, conversation]);

  useEffect(() => {
    myInfoState.myInfo &&
      socket.current.emit("addUser", myInfoState.myInfo.username);
    // socket.current.on("users", (users) => {
    //   console.log(users);
    // });
  }, [myInfoState.myInfo]);
  
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    api
      .get(`/conversation/mine`, myInfoState.CONFIG)
      .then((res) => {
        setConversations(res.data);
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  }, []);

  const getMessages = useCallback(
    (id) => {
      api
        .get(`/message/${id}`, myInfoState.CONFIG)
        .then((res) => {
          setMessages(res.data);
        })
        .catch((err) => {
          enqueueSnackbar(err.message, { variant: "error" });
        });
    },
    [conversations]
  );
  const handleSubmit = (event) => {
    event.preventDefault();

    const receiverName = conversation.participants.find(
      (name) => name !== myInfoState.myInfo.username
    );
    socket.current.emit("sentMessage", {
      senderName: myInfoState.myInfo?.username,
      receiverName,
      message,
    });

    api
      .post(
        `/message`,
        { conversationId: conversation._id, text: message },
        myInfoState.CONFIG
      )
      .then((res) => {
        setMessages((prev) => [...prev, res.data]);
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });

    setMessage("");
  };
  return (
    <Box display="flex" overflow="hidden" height="86vh">
      <Box flex={2}>
        <Box
          sx={{
            overflowY: "auto",
          }}
          padding={1}
          height="100%"
        >
          <Typography mt={1} sx={{ fontSize: "15px", fontWeight: "1000" }}>
            My conversations
          </Typography>
          {conversations.map((conversation) => (
            <div
              key={conversation._id}
              onClick={() => {
                getMessages(conversation._id);
                setConversation(conversation);
              }}
            >
              <Conversation
                username={conversation.participants.find(
                  (name) => name !== myInfoState.myInfo?.username
                )}
              />
            </div>
          ))}
        </Box>
      </Box>
      <Box flex={10}>
        {conversation && (
          <Box height="100%" display="flex" flexDirection="column" padding={1}>
            <Box pr={2} sx={{ overflowY: "scroll" }}>
              {messages.map((message) => (
                <div key={message._id} ref={scrollRef}>
                  <Message
                    message={message}
                    own={message.sender === myInfoState.myInfo.username}
                  />
                </div>
              ))}
            </Box>
            <Box
              display="flex"
              mt={2}
              mb={1}
              alignItems="center"
              justifyContent="space-between"

              // position="fixed"
              // sx={{top: "auto", bottom: 0}}
            >
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder="Write a message"
                style={{ width: "80%", height: "80px" }}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
              <Button
                sx={{ width: "120px", height: "60px" }}
                variant="outlined"
                endIcon={<SendIcon />}
                onClick={handleSubmit}
              >
                Send
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
