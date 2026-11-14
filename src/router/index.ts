import { createRouter, createWebHistory } from 'vue-router'
import AccueilPage from '@/Pages/Accueil/AccueilPage.vue'
import { useAuth } from '@/composables/useAuth'

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
      path: '/connexion',
      name: 'login',
      component: () => import('@/Pages/Auth/LoginPage.vue'),
      meta: { title: 'Connexion', guestOnly: true },
    },
  ],
})

router.beforeEach(async (to) => {
  const { isAuthenticated, loadMe } = useAuth()
  if (!isAuthenticated.value) await loadMe()

  if (to.meta.requiresAuth && !isAuthenticated.value)
    return { name: 'login', query: { redirect: to.fullPath } }
  if (to.meta.guestOnly && isAuthenticated.value) return { name: 'accueil' }
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - Bel Edition` : 'Bel Edition'
})

export default router
