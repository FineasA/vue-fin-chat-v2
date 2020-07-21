<template>
  <div class="container">
    <h1 class="display-4 text-white">Fin Chat</h1>
    <p
      class="text-white lead mb-0"
    >An elegant chat built with VueJS ran by socket.io, express.js, and node.js</p>
    <p class="text-white lead mb-4">
      <strong>Stay connected...</strong>
    </p>
    <div class="col-7 px-0">
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
        <join-chat v-if="!joinedRoom"></join-chat>
        <message-input v-if="joinedRoom"></message-input>
      </div>
    </div>
  </div>
</template>

<script>
//import components
import JoinChat from "@/components/JoinChat.vue";
import MessageInput from "@/components/MessageInput.vue";
import UserIsTyping from "@/components/UserIsTyping.vue";
import ChatView from "@/components/ChatView.vue";

//import io and eventbus
import io from "socket.io-client";
import { EventBus } from "./main.js";

export default {
  components: {
    JoinChat,
    MessageInput,
    UserIsTyping,
    ChatView
  },
  data() {
    return {
      joinedRoom: false,
      user: {
        username: "",
        message: "",
        id: ""
      },
      messages: [],
      socket: io("localhost:3000")
    };
  },
  mounted() {
    //check when user joins chat
    EventBus.$on("joined-chat", username => {
      this.user.username = username;
      console.log(this.user.username);
      this.joinedRoom = true;
      this.socket.emit("joined-chat", {
        username: this.user.username
      });
    });

    //check for messages

    EventBus.$on("message", message => {
      this.user.message = message;
      console.log(this.user);
      this.socket.emit("send-message", this.user.message);
    });

    this.socket.on("message", message => {
      this.messages.push(message);
    });
  },
  created() {
    this.user.id = this.socket.id;
  },
  updated() {
    console.log(this.messages);
  }
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

