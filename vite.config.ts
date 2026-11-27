import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      // En dev, /api est relayé vers le backend (BELEdition.Backend) : pas besoin de CORS.
      // On cible directement HTTPS car le backend redirige HTTP -> HTTPS (UseHttpsRedirection).
      proxy: {
        '/api': {
          target: env.API_PROXY_TARGET ?? 'https://localhost:7080',
          changeOrigin: true,
          secure: false, // certificat de dev ASP.NET auto-signé
        },
      },
    },
  }
})
