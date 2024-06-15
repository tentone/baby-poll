import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/vote',
    },
    {
      path: '/results',
      name: 'results',
      component: () => import('./views/ResultsView.vue')
    },
    {
      path: '/vote',
      name: 'vote',
      component: () => import('./views/VoteView.vue')
    }
  ]
});