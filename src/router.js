import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/ResultsView.vue')
    },
    {
      path: '/vote',
      name: 'vote',
      component: () => import('./views/VoteView.vue')
    }
  ]
})

export default router
