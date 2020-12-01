import { createRouter, createWebHashHistory } from 'vue-router'
import Online from "@/Online";
import Local from "@/Local";
import Write from "@/Write";
import Fav from "@/Fav";

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
    path: '/fav',
    name: 'fav',
    component: Fav
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
