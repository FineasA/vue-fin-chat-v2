const express = require("express");
const Datastore = require("nedb");
const serveStatic = require("serve-static");

// const cors = require("cors");
const path = require("path");
const app = express();

//import utilities
const { userJoin, getCurrentUser } = require("../utils/users.js");
const { formatMessage } = require("../utils/messages.js");

app.use("/", serveStatic(path.join(__dirname, "../dist")));
app.get(/.*/, (req, res) => {
  res.sendFile(__dirname + "../dist/index.html");
});

const PORT = process.env.PORT || 3000;

server = app.listen(PORT, () => {
  console.log(`CORS-enabled web server running on port ${PORT}`);
});

const usersDatabase = new Datastore({
  filename: "users.db",
  timestampData: true,
});
usersDatabase.loadDatabase();

const io = require("socket.io")(server, {
  handlePreflightRequest: (req, res) => {
    const headers = {
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
      "Access-Control-Allow-Credentials": true,
    };

    res.writeHead(200, headers);
    res.end();
  },
});

const chatRooms = ["Javascript", "Vue", "React", "Angular", "Python"];

const chatRoomUsers = {
  javascript: [],
  vue: [],
  react: [],
  angular: [],
  python: [],
};

io.on("connection", (socket) => {
  //manage create account request
  socket.on("create-account-request", (userRequest) => {
    //User to be authenticated
    //Find if username already exists
    usersDatabase.findOne(
      {
        username: userRequest.username,
      },
      (err, docs) => {
        //if no document is found doc is null
        if (err) {
          console.log(err);
        } else if (docs === null) {
          //Creating account...
          socket.emit("create-account-success");
          userRequest.loggedIn = true;
          usersDatabase.insert(userRequest);
        } else if (docs !== null) {
          //"Username already taken...
          socket.emit("create-account-failed");
        }
      }
    );
  });
  //manage previous user login request
  socket.on("login-account-request", (existingUser) => {
    //Login account info sent from client
    usersDatabase.findOne(
      {
        username: existingUser.username,
        password: existingUser.password,
        loggedIn: existingUser.loggedIn,
      },
      (err, docs) => {
        if (err) {
          console.log(err);
        } else if (docs === null) {
          //Incorrect username or password..."
          socket.emit("login-failed");
        } else if (docs !== null) {
          //Info correct, emit login auth success
          socket.emit("login-success");
        }
      }
    );
  });

  //listen for chat room room that user joins
  socket.on("chat-room-to-join", (chatRoomSelected, user) => {
    socket.join(chatRoomSelected);
    let chatTemp = chatRoomSelected.toLowerCase();

    //update to set inChatRoom to true and chatRoomJoined to the chatRoomSelected
    usersDatabase.update(
      { username: user.username },
      {
        $set: {
          loggedIn: true,
          inChatRoom: true,
          chatRoomJoined: chatRoomSelected,
        },
      }
    );
    //get updated usersDb val and store into chatRoomUsers value

    usersDatabase.findOne({ username: user.username }, (err, doc) => {
      if (err) {
        console.log(err);
      } else {
        chatRoomUsers[chatTemp].push(doc);

        //send users in chat to specific client in chatroom
        io.to(chatRoomSelected).emit(
          "send-users-in-chat",
          chatRoomUsers[chatTemp]
        );
      }
    });

    //listen to when user joins chat room and display bot message that welcomes user to chatroom
    socket.on("joined-chat", (chatRoomSelected, user) => {
      io.to(chatRoomSelected).emit("message", {
        message: `Everyone welcome ${user.username} to the ${chatRoomSelected} chatroom!`,
        id: "BOT",
      });
    });
  });

  socket.on("joined-chat", (chatRoomSelected, user) => {
    const user_recieved = userJoin(socket.id, user.username);

    //update user in users database upon joining chatroom
    usersDatabase.update(
      { username: user.username },
      {
        $set: {
          chatRoomJoined: chatRoomSelected,
          inChatRoom: true,
        },
      }
    );

    socket.on("send-message", (message) => {
      io.emit("message", {
        message: formatMessage(user_recieved.username, message),
        id: user_recieved.id,
      });
    });

    socket.on("user-typing", () => {
      let currentUser = getCurrentUser(socket.id);
      let userTypingMsg = `${currentUser.username} is typing...`;
      //send to all other clients except sender
      socket.broadcast.emit("user-typing", userTypingMsg);
    });

    socket.on("user-not-typing", () => {
      socket.broadcast.emit("user-not-typing");
    });

    //check for disconnections from chatroom
    socket.on("disconnect", (reason) => {
      let userDisconnected = getCurrentUser(socket.id);

      if (userDisconnected.username !== "null user") {
        usersDatabase.update(
          {
            username: userDisconnected.username,
          },
          {
            $set: {
              loggedIn: false,
              chatRoomJoined: null,
              inChatRoom: false,
            },
          }
        );
      }

      console.log(
        `${userDisconnected.username} has disconnected : Reason : ${reason} from chatroom ${chatRoomSelected}`
      );

      //filter chat rooms
      let lowerCaseRoom = chatRoomSelected.toLowerCase();

      let filteredChatRoom = chatRoomUsers[lowerCaseRoom].filter(
        (user) => user.username !== userDisconnected.username
      );
      console.log("Filtered Chatroom: ", filteredChatRoom);
      chatRoomUsers[lowerCaseRoom] = filteredChatRoom;

      // io.to(chatRoomSelected).emit("send-users-in-chat", filteredChatRoom);
      io.to(chatRoomSelected).emit(
        "send-updated-users-in-chat",
        filteredChatRoom
      );

      //update chatroomuserslist by filtering by name
      //somehow need to get the chatroomname when user disconnects to filter easily
    });
  });

  //check for disconnect at any point

  socket.on("disconnect", (reason) => {
    console.log("Disconnect reason: ", reason);
    let userDisconnected = getCurrentUser(socket.id);

    if (userDisconnected === undefined) {
      console.log("UNDEFINED!");
      userDisconnected = {
        username: "null",
        id: socket.id,
      };
    } else if (userDisconnected !== undefined) {
      console.log("NOT UNDEFINED!");
    }

    console.log(
      `${userDisconnected.username} has disconnected : Reason : ${reason}`
    );
  });
});

//uncomment when you want to wipe database

// usersDatabase.remove({}, { multi: true }, function(err, numRemoved) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Number of items removed: ", numRemoved);
//   }
// });
