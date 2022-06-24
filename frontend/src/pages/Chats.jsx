import { useState, useEffect, useCallback, useRef } from "react";
import { Box, Button, TextareaAutosize } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";

import Conversation from "../components/Conversation";
import Message from "../components/Message";
import api from "../axios";
import { useSnackbar } from "notistack";

export default function Chats() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState(null);
  const [message, setMessage] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const myInfoState = useSelector((state) => state.myInfoState);
  const scrollRef = useRef();

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
          console.log(res.data);
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
    api
      .post(
        `/message`,
        { conversationId: messages[0].conversationId, text: message },
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
          {conversations.map((conversation) => (
            <div
              key={conversation._id}
              onClick={() => {
                console.log(conversation);
                getMessages(conversation._id);
              }}
            >
              <Conversation
                username={
                  conversation.participants.filter(
                    (name) => name !== myInfoState.myInfo.username
                  )[0]
                }
              />
            </div>
          ))}
        </Box>
      </Box>
      <Box flex={10}>
        {messages && (
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
