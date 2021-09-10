import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import FlameEditor from '@/views/FlameEditor.vue'
import Artworks from '@/views/Artworks.vue'
import MyArtworks from '@/views/MyArtworks.vue'
import MyBookmarks from '@/views/MyBookmarks.vue'

const routerHistory = createWebHistory()

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/flame',
      name: 'flame',
      component: FlameEditor
    },
    {
      path: '/artworks',
      name: 'artworks',
      component: Artworks
    },
    {
      path: '/my-artworks',
      name: 'myArtworks',
      component: MyArtworks
    },
    {
      path: '/my-bookmarks',
      name: 'myBookmarks',
      component: MyBookmarks
    }
  ]
})

export default router
