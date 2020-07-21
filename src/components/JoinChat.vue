<template>
  <div>
    <form @submit.prevent="joinChatRoom" class="bg-light">
      <div class="input-group">
        <input
          type="text"
          placeholder="Username: "
          aria-describedby="button-addon2"
          required
          v-model="username"
          class="form-control rounded-0 border-0 py-4 bg-light"
        />
        <div class="input-group-append">
          <button id="button-addon2" type="submit" class="btn btn-link">
            <font-awesome-icon :icon="['fa', 'sign-in-alt']" />
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { EventBus } from "../main.js";

export default {
  methods: {
    joinChatRoom() {
      EventBus.$emit("joined-chat", this.username);
    }
  },
  data() {
    return {
      username: ""
    };
  }
};
</script>

<style>
</style>