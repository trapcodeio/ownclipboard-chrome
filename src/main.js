import "./assets/scss/app.scss";

import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import "./assets/tailwind.css";
import router from "./router";
import Busy from "./components/Busy.vue";
import TimeAgo from "./components/TimeAgo.vue";
import LoadingButton from "./components/LoadingButton.vue";

createApp(App)
  .use(router)
  .use(store)
  .component("Busy", Busy)
  .component("TimeAgo", TimeAgo)
  .component("LoadingButton", LoadingButton)
  .mount("#app");
