import { createRouter, createWebHashHistory } from 'vue-router'
import Online from "@/Online";
import Local from "@/Local";

const routes = [
  {
    path: '/',
    name: 'local',
    component: Local
  },
  {
    path: '/online',
    name: 'online',
    component: Online
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
