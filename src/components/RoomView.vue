<template>
  <b-list-group>
    <h1
      class="display-4 text-white"
      style="text-align: center; margin-bottom: 1.2rem"
    >Select room to join...</h1>
    <b-list-group-item
      @click="emitRoomSelected(room)"
      v-for="(room,index) in rooms"
      :key="index"
    >{{room}}</b-list-group-item>
  </b-list-group>
</template>

<script>
import { EventBus } from "../main.js";

export default {
  data() {
    return {
      rooms: ["Javascript", "Vue", "React", "Angular", "Python"],
      roomSelected: "",
    };
  },
  methods: {
    emitRoomSelected(roomSelected) {
      this.roomSelected = roomSelected;
      //Chat room selected
      EventBus.$emit("chat-room-selected", this.roomSelected);
    },
  },
};
</script>

<style>
</style>