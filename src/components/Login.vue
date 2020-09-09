<template>
  <div class="login-container">
    <b-card class="user-type-selection" title="New User?" style="width: 20vw;">
      <b-card-text>Register here if you have not registed an account!</b-card-text>
      <b-form @keyup.enter="createAccount">
        <b-form-group id="username-input-group" label="Username:" label-for="username-input">
          <b-form-input
            id="username-input"
            type="text"
            required
            placeholder="Enter username..."
            v-model="newUser.username"
          ></b-form-input>
        </b-form-group>
        <b-form-group id="password-input-group" label="Password:" label-for="password-input">
          <b-form-input
            id="password-input"
            type="password"
            required
            placeholder="Enter password..."
            v-model="newUser.password"
          ></b-form-input>
        </b-form-group>
      </b-form>
      <b-button @click="createAccount">Create Account</b-button>
      <b-alert
        class="small muted login-failed-text"
        :show="createAccountFailed"
        variant="danger"
      >Username already exists...</b-alert>
    </b-card>
    <b-card class="user-type-selection" title="Returning User?" style="width: 20vw">
      <b-card-text>Login here!</b-card-text>
      <b-form @keyup.enter="login">
        <b-form-group id="username-input-group" label="Username:" label-for="username-input">
          <b-form-input
            id="username-input"
            type="text"
            required
            placeholder="Enter username..."
            v-model="existingUser.username"
          ></b-form-input>
        </b-form-group>
        <b-form-group id="password-input-group" label="Password:" label-for="password-input">
          <b-form-input
            id="password-input"
            type="password"
            required
            placeholder="Enter password..."
            v-model="existingUser.password"
          ></b-form-input>
        </b-form-group>
      </b-form>
      <b-button @click="login">Login</b-button>
      <b-alert
        class="small muted login-failed-text"
        :show="loginFailed"
        variant="danger"
      >Incorrect username or password...</b-alert>
    </b-card>
  </div>
</template>

<script>
import { EventBus } from "../main.js";

export default {
  props: ["socket"],
  data() {
    return {
      newUser: {
        username: "",
        password: "",
        loggedIn: false,
        inChatRoom: false,
        chatRoomJoined: null,
      },
      existingUser: {
        username: "",
        password: "",
        loggedIn: false,
        inChatRoom: false,
        chatRoomJoined: null,
      },
      userToSend: {
        username: "",
        password: "",
        loggedIn: false,
        inChatRoom: false,
        chatRoomJoined: null,
      },
      loginFailed: false,
      createAccountFailed: false,
      accountAuthComplete: false,
    };
  },
  methods: {
    authorizationComplete() {
      this.accountAuthComplete = true;
      EventBus.$emit("account-auth-complete", this.accountAuthComplete);
      EventBus.$emit("user-to-send", this.userToSend);
    },
    createAccount() {
      //Create account request initiated
      this.socket.emit("create-account-request", this.newUser);
      this.userToSend = this.newUser;
    },
    login() {
      //Login request initiated
      this.socket.emit("login-account-request", this.existingUser);
      this.userToSend = this.existingUser;
    },
  },
  created() {
    this.socket.on("login-failed", () => {
      //Login failed!
      this.loginFailed = true;
    });

    this.socket.on("login-success", () => {
      //Login success!
      this.loginFailed = false;
      this.authorizationComplete();
    });

    this.socket.on("create-account-failed", () => {
      //Error creating account, username already exists
      this.createAccountFailed = true;
    });

    this.socket.on("create-account-success", () => {
      //Account creation success!
      this.createAccountFailed = false;
      this.authorizationComplete();
    });
  },
};
</script>

<style>
.login-container {
  display: flex;
  flex-direction: row;
  padding: 1.2rem;
  flex-wrap: wrap;
}
.user-type-selection {
  padding: 0.5rem;
  box-sizing: border-box;
  display: flex;
  margin: 2.5rem;
}

.login-failed-text {
  margin-top: 0.9rem;
}
</style>