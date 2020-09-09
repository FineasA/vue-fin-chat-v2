<template>
  <div>
    <ul>
      <li v-for="(msg,index) in messagesFilter" :key="index + 30">
        <div class="media-body">
          <div class="media mb-3" :class="[msg.id === socket.id ? 'user': 'users']">{{msg.message}}</div>
          <p
            class="mb-3"
            :class="[msg.id === socket.id ? 'user-time-stamp' : 'users-time-stamp']"
          >{{new Date() | moment('LLL')}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["messages", "socket"],
  updated() {
    // console.log(this.messages);
  },
  computed: {
    messagesFilter() {
      return this.messages.filter((msg) => {
        return msg.message.length > 0;
      });
    },
  },
};
</script>

<style>
li {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}
.user {
  margin: 20px;
  color: #fff;
  margin-bottom: 0 !important;
  padding-left: 1rem !important;
  padding-right: 1rem !important;
  padding-bottom: 0.5rem !important;
  padding-top: 0.5rem !important;
  border-radius: 0.25rem !important;
  background-color: #007bff !important;
  font-size: 0.9rem;

  margin-left: 15vw;
}
.users {
  margin: 20px;
  font-size: 0.9rem;
  margin-right: 15vw;
  border-radius: 0.25rem !important;
  background-color: #ddd;

  padding-left: 1rem !important;
  padding-right: 1rem !important;
  padding-bottom: 0.5rem !important;
  padding-top: 0.5rem !important;
  color: #6c757d !important;
  margin-bottom: 0 !important;
}

.user-time-stamp {
  margin-top: 10;
  width: 35%;
  float: right;
  color: #1a1a1a;
  font-size: 80%;
  font-weight: 400;
}
.users-time-stamp {
  margin-left: 2.2em;
  color: #6c757d !important;
  font-size: 80%;
  font-weight: 400;
}

.active {
  background-color: green;
}
</style>