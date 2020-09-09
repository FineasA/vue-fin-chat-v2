<template>
  <div>
    <h5>Users in {{chatRoom}}:</h5>
    <hr />
    <ul>
      <li v-for="(userInChat, index) in usersInChat" :key="index">{{userInChat.username}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["chatRoom", "socket"],
  data() {
    return {
      usersInChat: [],
    };
  },
  created() {
    this.socket.on("send-users-in-chat", (chatRoomUsers) => {
      this.usersInChat = chatRoomUsers;
      // console.log(this.usersInChat);
    });

    this.socket.on("send-updated-users-in-chat", (filteredChat) => {
      console.log(filteredChat);
      this.usersInChat = filteredChat;
    });
  },
};
</script>

<style>
</style>