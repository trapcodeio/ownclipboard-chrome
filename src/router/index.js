import { createRouter, createWebHashHistory } from 'vue-router'
import Online from "@/Online";
import Local from "@/Local";
import Write from "@/Write";

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
  {
    path: '/write',
    name: 'write',
    component: Write
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
