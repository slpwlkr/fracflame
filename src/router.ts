import { createRouter, createWebHistory } from 'vue-router'
import Flame from '@/views/Flame.vue'

const routerHistory = createWebHistory()

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Flame
    }
  ]
})

export default router
