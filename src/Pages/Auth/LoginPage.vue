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
const afficherMdp = ref(false)

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
  <main class="page">
    <section class="carte">
      <header class="entete">
        <h1>Connexion</h1>
        <p class="sous-titre">Heureux de vous revoir. Connectez-vous pour continuer.</p>
      </header>

      <form @submit.prevent="soumettre" novalidate>
        <div class="champ">
          <label for="email">Adresse e-mail</label>
          <input id="email"
                 v-model.trim="email"
                 type="email"
                 autocomplete="email"
                 placeholder="nom@exemple.be"
                 :aria-invalid="!!erreur"
                 required />
        </div>

        <div class="champ">
          <label for="mdp">Mot de passe</label>
          <div class="champ-mdp">
            <input id="mdp"
                   v-model="motDePasse"
                   :type="afficherMdp ? 'text' : 'password'"
                   autocomplete="current-password"
                   placeholder="••••••••"
                   :aria-invalid="!!erreur"
                   required />
            <button type="button"
                    class="oeil"
                    :aria-label="afficherMdp ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                    :aria-pressed="afficherMdp"
                    @mousedown.prevent
                    @click="afficherMdp = !afficherMdp">
              <span class="material-symbols-outlined" aria-hidden="true">
                {{ afficherMdp ? 'visibility_off' : 'visibility' }}
              </span>
            </button>
          </div>
        </div>

        <p v-if="erreur" class="erreur" role="alert">{{ erreur }}</p>

        <button type="submit" class="btn btn-principal" :disabled="chargement">
          <span v-if="chargement" class="spinner" aria-hidden="true"></span>
          {{ chargement ? 'Connexion…' : 'Se connecter' }}
        </button>
      </form>

      <div class="separateur"><span>ou</span></div>

      <!-- TODO: redirect to itsme's authorize URL once the itsme config is ready -->
      <button type="button" class="btn btn-itsme" disabled>Se connecter avec itsme</button>

      <p class="pied">
        Pas encore de compte ?
        <RouterLink to="/inscription">Créer un compte</RouterLink>
      </p>
    </section>
  </main>
</template>

<style scoped>
  .page {
    --encre: #1c2433;
    --gris: #5b6577;
    --bord: #d9dee7;
    --fond: #f4f6fa;
    --primaire: #2747d9;
    --primaire-hover: #1f3ab5;
    --itsme: #ff4612;
    --erreur: #b00020;
    --rayon: 10px;
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 2rem 1rem;
    background: var(--fond);
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    color: var(--encre);
  }

  .carte {
    width: 100%;
    max-width: 400px;
    padding: 2.5rem 2rem;
    background: #fff;
    border: 1px solid var(--bord);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(28, 36, 51, 0.08);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .entete h1 {
    margin: 0 0 0.35rem;
    font-size: 1.6rem;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .sous-titre {
    margin: 0;
    color: var(--gris);
    font-size: 0.95rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .champ {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  label {
    font-size: 0.875rem;
    font-weight: 600;
  }

  input {
    padding: 0.7rem 0.85rem;
    font-size: 1rem;
    color: var(--encre);
    background: #fff;
    border: 1px solid var(--bord);
    border-radius: var(--rayon);
    transition: border-color 0.15s, box-shadow 0.15s;
  }

    input::placeholder {
      color: #a3abb9;
    }

    input:focus {
      outline: none;
      border-color: var(--primaire);
      box-shadow: 0 0 0 3px rgba(39, 71, 217, 0.15);
    }

    input[aria-invalid='true'] {
      border-color: var(--erreur);
    }

    /* Hide Edge's built-in reveal/clear buttons: we provide our own toggle */
    input::-ms-reveal,
    input::-ms-clear {
      display: none;
    }

  .champ-mdp {
    position: relative;
    display: flex;
  }

    .champ-mdp input {
      flex: 1;
      padding-right: 2.75rem;
    }

  .oeil {
    position: absolute;
    top: 50%;
    right: 0.4rem;
    transform: translateY(-50%);
    display: grid;
    place-items: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    color: var(--gris);
    background: none;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

    .oeil:hover {
      color: var(--encre);
      background: var(--fond);
    }

    .oeil:focus-visible {
      outline: 2px solid var(--primaire);
      outline-offset: 1px;
    }

    .oeil .material-symbols-outlined {
      font-size: 20px;
      line-height: 1;
      user-select: none;
    }

  .erreur {
    margin: 0;
    padding: 0.65rem 0.85rem;
    font-size: 0.9rem;
    color: var(--erreur);
    background: #fdecee;
    border: 1px solid #f5c2c8;
    border-radius: var(--rayon);
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: var(--rayon);
    cursor: pointer;
    transition: background-color 0.15s, transform 0.05s, opacity 0.15s;
  }

    .btn:active:not(:disabled) {
      transform: translateY(1px);
    }

    .btn:focus-visible {
      outline: 3px solid rgba(39, 71, 217, 0.35);
      outline-offset: 2px;
    }

    .btn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

  .btn-principal {
    margin-top: 0.25rem;
    color: #fff;
    background: var(--primaire);
  }

    .btn-principal:hover:not(:disabled) {
      background: var(--primaire-hover);
    }

  .btn-itsme {
    color: #fff;
    background: var(--itsme);
  }

  .spinner {
    width: 1em;
    height: 1em;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: tourner 0.7s linear infinite;
  }

  @keyframes tourner {
    to {
      transform: rotate(360deg);
    }
  }

  .separateur {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--gris);
    font-size: 0.85rem;
  }

    .separateur::before,
    .separateur::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--bord);
    }

  .pied {
    margin: 0;
    text-align: center;
    font-size: 0.9rem;
    color: var(--gris);
  }

    .pied a {
      color: var(--primaire);
      font-weight: 600;
      text-decoration: none;
    }

      .pied a:hover {
        text-decoration: underline;
      }
</style>
