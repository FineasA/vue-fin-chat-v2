<template>
  <div>
    <form @submit.prevent="sendMessage" class="bg-light">
      <div class="input-group">
        <input
          type="text"
          placeholder="Type a message"
          aria-describedby="button-addon2"
          v-model="message"
          class="form-control rounded-0 border-0 py-4 bg-light"
        />
        <div class="input-group-append">
          <button id="button-addon2" type="submit" class="btn btn-link">
            <font-awesome-icon :icon="['fa', 'paper-plane']" />
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
    sendMessage() {
      EventBus.$emit("message", this.message);
      this.message = "";
    }
  },
  data() {
    return {
      message: ""
    };
  },
  updated() {
    if (this.message.length > 0) {
      EventBus.$emit("user-typing", true);
    } else if (this.message.length === 0) {
      EventBus.$emit("user-not-typing", false);
    }
  }
};
</script>

<style>
</style>