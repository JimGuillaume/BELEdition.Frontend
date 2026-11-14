<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { ApiError } from '@/services/api'

const router = useRouter()
const route = useRoute()
const { login } = useAuth()

const email = ref('')
const motDePasse = ref('')
const erreur = ref<string | null>(null)
const chargement = ref(false)

async function soumettre() {
  erreur.value = null

  if (!email.value || !motDePasse.value) {
    erreur.value = 'Veuillez remplir tous les champs.'
    return
  }

  chargement.value = true
  try {
    await login(email.value, motDePasse.value)

    // Only follow internal redirects (avoids redirecting to another site)
    const redirect = route.query.redirect
    const cible = typeof redirect === 'string' && redirect.startsWith('/') ? redirect : '/'
    router.push(cible)
  } catch (e) {
    if (e instanceof ApiError) {
      // 401 bad credentials, 403 suspended, 423 locked: the backend sends the message
      erreur.value = e.message
    } else {
      erreur.value = 'Impossible de contacter le serveur.'
    }
  } finally {
    chargement.value = false
  }
}
</script>

<template>
  <main class="auth">
    <h1>Connexion</h1>

    <form @submit.prevent="soumettre" novalidate>
      <label for="email">Adresse e-mail</label>
      <input id="email" v-model.trim="email" type="email" autocomplete="email" required />

      <label for="mdp">Mot de passe</label>
      <input id="mdp" v-model="motDePasse" type="password" autocomplete="current-password" required />

      <p v-if="erreur" class="erreur" role="alert">{{ erreur }}</p>

      <button type="submit" :disabled="chargement">
        {{ chargement ? 'Connexion…' : 'Se connecter' }}
      </button>
    </form>

    <div class="separateur">ou</div>

    <!-- TODO: redirect to itsme's authorize URL once the itsme config is ready -->
    <button type="button" class="itsme" disabled>Se connecter avec itsme</button>

    <p>Pas encore de compte ? <RouterLink to="/inscription">Créer un compte</RouterLink></p>
  </main>
</template>

<style scoped>
  .auth {
    max-width: 360px;
    margin: 4rem auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  input {
    padding: 0.5rem;
  }

  button {
    padding: 0.6rem;
    cursor: pointer;
  }

    button:disabled {
      opacity: 0.6;
      cursor: default;
    }

  .erreur {
    color: #b00020;
    margin: 0;
  }

  .separateur {
    text-align: center;
    opacity: 0.6;
  }
</style>
