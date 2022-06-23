import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import generateProfileColor from "../generateProfileColor";

export default function Conversation({ username }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      marginTop={1}
      bgcolor="lightGray"
      paddingX={2}
      paddingY={2}
      sx={{
        background: "#f1f1f1",
        "&:hover": {
          background: "#cecece",
        },
      }}
    >
      <Avatar
        sx={{
          width: 32,
          height: 32,
          marginRight: 2,
          bgcolor: generateProfileColor(username),
        }}
      >
        {username.charAt(0).toUpperCase()}
      </Avatar>
      <Box component="span" sx={{ display: 'block',fontSize:'15px' }}>{username}</Box>

    </Box>
  );
}
