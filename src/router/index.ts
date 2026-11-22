import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AccueilPage from '@/Pages/Accueil/AccueilPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // Chaque route enfant est affichée dans la mise en page avec barre de menu + barre latérale.
      // Ajouter les routes hors de ce bloc pour les pages sans elles (ex. : une page de connexion).
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'accueil',
          component: AccueilPage,
          meta: { title: 'Accueil' },
        },
        {
          path: 'oeuvres',
          name: 'oeuvres',
          component: () => import('@/Pages/oeuvre/OeuvreOverviewPage.vue'),
          meta: { title: 'Œuvres' },
        },
      ],
    },
  ],
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - Bel Edition` : 'Bel Edition'
})

export default router
