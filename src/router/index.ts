import { createRouter, createWebHistory } from 'vue-router'
import AccueilPage from '@/Pages/Accueil/AccueilPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'accueil',
      component: AccueilPage,
      meta: { title: 'Accueil' },
    },
    {
      path: '/oeuvres',
      name: 'oeuvres',
      component: () => import('@/Pages/oeuvre/OeuvreOverviewPage.vue'),
      meta: { title: 'Œuvres' },
    },
  ],
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - Bel Edition` : 'Bel Edition'
})

export default router
