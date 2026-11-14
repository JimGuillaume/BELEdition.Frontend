import { ref, computed } from 'vue'
import { api, tokenStore } from '@/services/api'

type CurrentUser = { id: string; email: string }

const user = ref<CurrentUser | null>(null) // outside the function = shared by every component

export function useAuth() {
  async function login(email: string, motDePasse: string) {
    const { token } = await api<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, motDePasse }),
    })
    tokenStore.set(token)
    await loadMe()
  }

  async function loadMe() {
    if (!tokenStore.get()) return
    try {
      user.value = await api<CurrentUser>('/auth/me')
    } catch {
      user.value = null
    }
  }

  function logout() {
    tokenStore.clear()
    user.value = null
  }

  return { user, isAuthenticated: computed(() => !!user.value), login, loadMe, logout }
}
