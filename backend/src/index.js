const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

require("dotenv").config();

const userRoute = require("./routes/user");
const postRoute = require("./routes/post");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");

// middleware
const whitelist = ["http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(express.json());

mongoose.connect(process.env.DATABASE_URI_CLOUD);

const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("connected to mongoDB"));

//routes
app.use("/user", userRoute);
app.use("/posts", postRoute);
app.use("/conversation", conversationRoute);
app.use("/message", messageRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`The app listening on port ${PORT}!`));
