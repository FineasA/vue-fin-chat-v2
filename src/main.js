import Vue from "vue";
import App from "./App.vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import VueChatScroll from "vue-chat-scroll";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUserSecret,
  faPaperPlane,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faUserSecret, faPaperPlane, faSignInAlt);

Vue.component("font-awesome-icon", FontAwesomeIcon);

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
//Use vue-chat-scroll
Vue.use(VueChatScroll);
//use vue-moment
Vue.use(require("vue-moment"));

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

export const EventBus = new Vue();

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
