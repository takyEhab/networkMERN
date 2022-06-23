import { Box, Button, TextareaAutosize, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import Conversation from "../components/Conversation";
import Message from "../components/Message";

export default function Chats() {
  return (
    <Box
      display="flex"
      //   flexDirection="row"
      //   alignItems="center"
      //   bgcolor="red"
      overflow='hidden'
      height="86vh"
    >
      <Box flex={2}>
        <Box
          sx={{
            overflowY: "auto",
          }}
          padding={1}
          height="100%"
        >
          <Conversation username="Taky" />
          <Conversation username="Saif" />
          <Conversation username="Mohamed" />
          <Conversation username="Alex" />
          <Conversation username="Sara" />
          <Conversation username="Bella" />
          <Conversation username="Maria" />
          <Conversation username="Nada" />
          <Conversation username="Mariam" />
        </Box>
      </Box>
      <Box flex={10}>
        <Box height="100%" display="flex" flexDirection="column" padding={1}>
          <Box pr={2} sx={{ overflowY: "scroll" }}>
            <Message />
            <Message own={true} />
            <Message />
            <Message />
            <Message />
            <Message />
          </Box>
          <Box
            display="flex"
            mt={2}
            mb={1}
            alignItems="center"
            
            justifyContent="space-between"
            sx={{}}
          >
            <TextareaAutosize
              aria-label="minimum height"
              minRows={3}
              placeholder="Write a message"
              style={{ width: "80%", height: "80px" }}
            />
            <Button
              sx={{ width: "120px", height: "60px" }}
              variant="outlined"
              endIcon={<SendIcon />}
            >
              Send
            </Button>
            {/* <TextField
              id="filled-multiline-static"
              label="Multiline"
              multiline
              rows={4}
              placeholder="Write your message"
              variant="filled"
            /> */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
