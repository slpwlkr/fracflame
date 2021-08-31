import { createRouter, createWebHistory } from 'vue-router'
import FlameEditor from '@/views/FlameEditor.vue'

const routerHistory = createWebHistory()

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: FlameEditor
    }
  ]
})

export default router
