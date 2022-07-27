import { createRouter, createWebHashHistory } from "vue-router";
import Online from "../views/Online.vue";
import Local from "../views/Local.vue";
import Write from "../views/Write.vue";
import Fav from "../views/Fav.vue";
import Settings from "../views/Settings.vue";

const routes = [
  {
    path: "/",
    name: "local",
    component: Local
  },
  {
    path: "/online",
    name: "online",
    component: Online
  },
  {
    path: "/fav",
    name: "fav",
    component: Fav
  },
  {
    path: "/write",
    name: "write",
    component: Write
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
