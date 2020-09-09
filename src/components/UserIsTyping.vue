<template>
  <em>
    <p class="small text-muted">{{broadcastedMsg}}</p>
  </em>
</template>

<script>
import { EventBus } from "../main.js";
export default {
  props: ["socket"],
  data() {
    return {
      broadcastedMsg: "",
    };
  },
  mounted() {
    //check if user is typing
    EventBus.$on("user-typing", (typing) => {
      if (typing) {
        this.socket.emit("user-typing");
      }
    });

    this.socket.on("user-typing", (userTypingMsg) => {
      this.broadcastedMsg = userTypingMsg;
    });

    //check for when user is not typing
    EventBus.$on("user-not-typing", (typing) => {
      if (!typing) {
        this.socket.emit("user-not-typing");
      }
    });

    this.socket.on("user-not-typing", () => {
      this.broadcastedMsg = "";
    });
  },
};
</script>

<style>
</style>