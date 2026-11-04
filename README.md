# BELEdition – Frontend

Frontend Vue 3 + TypeScript + Vite + Vue Router.

## Prérequis

- Node.js `^22.18.0` ou `>=24.12.0`
- VS Code avec les extensions recommandées (proposées automatiquement à l'ouverture du projet)

## Installation

```sh
git clone https://github.com/JimGuillaume/BELEdition.Frontend.git
cd BELEdition.Frontend
npm install
npm run dev
```

## Commandes

| Commande         | Rôle                                         |
| ---------------- | -------------------------------------------- |
| `npm run dev`    | Lance le serveur de développement            |
| `npm run build`  | Vérifie les types et compile pour la prod    |
| `npm run lint`   | Analyse et corrige le code (oxlint + eslint) |
| `npm run format` | Formate le code avec Prettier                |

## Structure

```
src/
├── assets/       # CSS global, images
├── components/   # Composants réutilisables (boutons, cartes, ...)
├── Pages/        # Une page = un dossier (ex: Pages/Accueil/AccueilPage.vue)
├── router/       # Déclaration des routes
├── services/     # Appels à l'API backend
├── types/        # Types / interfaces TypeScript partagés
├── App.vue
└── main.ts
```

### Ajouter une page

1. Créer `src/Pages/MaPage/MaPage.vue`
2. Ajouter la route dans `src/router/index.ts` :
   ```ts
   { path: '/ma-page', name: 'ma-page', component: () => import('@/Pages/MaPage/MaPage.vue') }
   ```

## Travailler en équipe (Git)

On ne pousse **jamais** directement sur `main`.

```sh
git checkout main
git pull                              # récupérer la dernière version
git checkout -b feature/nom-de-la-tache
# ... coder ...
git add .
git commit -m "Ajout de la page X"
git push -u origin feature/nom-de-la-tache
```

Puis ouvrir une **Pull Request** sur GitHub vers `main` et demander une relecture.

Avant chaque push : `npm run lint` et `npm run build` doivent passer.
