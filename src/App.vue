<template>
  <div class="container">
    <h1 class="display-4 text-white">Fin Chat</h1>
    <p
      class="text-white lead mb-0"
    >An elegant chat built with VueJS ran by socket.io, express.js, and node.js</p>
    <p class="text-white lead mb-4">
      <strong>Stay connected...</strong>
    </p>
    <!-- Add Login View Here -->
    <login :socket="socket" v-if="!loggedIn"></login>
    <!-- Add Room View Here -->
    <room-view v-if="loggedIn && !roomSelected"></room-view>
    <b-row>
      <div class="col-9 px-0" v-if="roomSelected">
        <div
          class="px-4 py-5 chat-box bg-white"
          v-chat-scroll="{smooth: true}"
          style="border-radius: 10px 0 0 0"
        >
          <chat-view :messages="messages" :socket="socket"></chat-view>
        </div>

        <!-- Typing area -->
        <user-is-typing :socket="socket"></user-is-typing>
        <div>
          <message-input></message-input>
        </div>
      </div>
      <users-in-chat-display
        :chatRoom="chatRoomSelected"
        :socket="socket"
        v-if="roomSelected"
        class="col-3 px-5 text-white"
      ></users-in-chat-display>
    </b-row>
  </div>
</template>

<script>
//import components

import MessageInput from "@/components/MessageInput.vue";
import UserIsTyping from "@/components/UserIsTyping.vue";
import ChatView from "@/components/ChatView.vue";
import RoomView from "@/components/RoomView.vue";
import Login from "@/components/Login.vue";
import UsersInChatDisplay from "@/components/UsersInChatDisplay.vue";

//import io and eventbus
import io from "socket.io-client";
import { EventBus } from "./main.js";

export default {
  components: {
    MessageInput,
    UserIsTyping,
    ChatView,
    RoomView,
    Login,
    UsersInChatDisplay,
  },
  data() {
    return {
      loggedIn: false,
      roomSelected: false,
      chatRoomSelected: "",
      user: {
        username: "",
        message: "",
      },
      messages: [],
      //if local make sure localhost:3000
      //if not local make sure heroku link https://vue-fin-chat.herokuapp.com/
      //also makesure its node server.js not nodemon when on heroku, nodemon when local
      socket: io("https://vue-fin-chat.herokuapp.com/"),
    };
  },
  mounted() {
    //check when user joins chat
    EventBus.$on("joined-chat", (username) => {
      this.user.username = username;
      this.socket.emit("joined-chat", {
        username: this.user.username,
      });
    });

    //check for messages

    EventBus.$on("message", (message) => {
      this.user.message = message;
      this.socket.emit("send-message", this.user.message);
    });

    this.socket.on("message", (message) => {
      //message from client
      this.messages.push(message);
    });
  },
  created() {
    // this.user.id = this.socket.id;

    //listen for account authorization completion
    EventBus.$on("account-auth-complete", (accountAuthComplete) => {
      if (accountAuthComplete) {
        this.loggedIn = true;
      }
    });

    //listen for chat room selection
    EventBus.$on("chat-room-selected", (chatRoomSelected) => {
      this.socket.emit("chat-room-to-join", chatRoomSelected, this.user);
      this.roomSelected = true;
      this.chatRoomSelected = chatRoomSelected;
      //User sent to joined-chat socket event

      this.socket.emit("joined-chat", chatRoomSelected, this.user);
    });

    //listen for user to send
    EventBus.$on("user-to-send", (user) => {
      this.user = user;
    });
  },
  updated() {
    // console.log(this.messages);
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
body {
  background-color: #74ebd5;
  background-image: linear-gradient(90deg, #74ebd5 0%, #9face6 100%);

  min-height: 100vh;
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  width: 5px;
  background: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  width: 1em;
  background-color: #ddd;
  outline: 1px solid slategrey;
  border-radius: 1rem;
}

.text-small {
  font-size: 0.9rem;
}

.messages-box,
.chat-box {
  height: 510px;
  overflow-y: scroll;
}

.rounded-lg {
  border-radius: 0.5rem;
}
</style>

