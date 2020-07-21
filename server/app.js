const express = require("express");
const app = express();
const { userJoin, getCurrentUser } = require("../utils/users.js");
const { formatMessage } = require("../utils/messages.js");

server = app.listen(3000, () => {
  console.log("server running on port 3000");
});

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("joined-chat", ({ username }) => {
    const user = userJoin(socket.id, username);
    console.log(user);
    //Welcome user as well display to ALL connected clients user has connected
    io.emit("message", {
      message: `Everyone welcome ${username} to FinChat!!!`,
      id: "BOT",
    });

    socket.on("send-message", (message) => {
      console.log(message);
      io.emit("message", {
        message: formatMessage(username, message),
        id: user.id,
      });
    });

    socket.on("user-typing", () => {
      let currentUser = getCurrentUser(socket.id);
      console.log("Current user typing: ", currentUser.username, socket.id);
      let userTypingMsg = `${currentUser.username} is typing...`;
      //send to all other clients except sender
      socket.broadcast.emit("user-typing", userTypingMsg);
    });

    socket.on("user-not-typing", () => {
      socket.broadcast.emit("user-not-typing");
    });
  });
});
