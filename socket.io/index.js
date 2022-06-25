const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (username, socketId) => {
  !users.some((item) => item.username === username) &&
    users.push({ username, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((item) => item.socketId !== socketId);
};

const getUser = (username) => {
  return users.find((item) => item.username === username);
};

io.on("connection", (socket) => {
  // when connect
  console.log("user connected");

  socket.on("addUser", (username) => {
    // ...
    addUser(username, socket.id);
    io.emit("users", users);
  });
  // send and get message

  socket.on("sentMessage", ({ senderName, receiverName, message }) => {
    const user = getUser(receiverName);
    console.log(user);
    io.to(user.socketId).emit("getMessage", { senderName, message });
  });
  // when disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
    removeUser(socket.id);
    io.emit("users", users);
  });
});
