import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from "@/Dashboard";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Dashboard
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
