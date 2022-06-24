import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { format } from "timeago.js";
import generateProfileColor from "../generateProfileColor";

export default function Message({ own, message }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      mt={3}
      alignItems={own ? "start" : "end"}
    >
      <Box display="flex">
        <Avatar
          sx={{
            width: 32,
            height: 32,
            marginRight: 1,
            bgcolor: generateProfileColor(message.sender),
          }}
        >
          {message.sender.charAt(0).toUpperCase()}
        </Avatar>
        <Typography
          sx={{
            padding: "13px",
            borderRadius: 5,
            backgroundColor: own ? "#1877f2" : "#d6d6d6",
            color: own ? "white" : "black",
            maxWidth: "600px",
          }}
        >
          {message.text}
        </Typography>
      </Box>

      <Typography sx={{ opacity: "0.5", fontSize: "15px", marginTop: 1 }}>
        {format(message.createdAt)}
      </Typography>
    </Box>
  );
}
