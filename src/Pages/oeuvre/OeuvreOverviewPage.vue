<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { BookOpen, Plus, Settings, Trash } from '@lucide/vue';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Oeuvre } from '@/schemas/oeuvreSchema';
import { useOeuvres } from '@/composables/useOeuvres';
import OeuvreDeleteDialog from '@/Pages/oeuvre/OeuvreOverview/OeuvreDeleteDialog.vue';

const { oeuvres, loading, fetchOeuvres, removeOeuvre } = useOeuvres();

onMounted(fetchOeuvres);

// Une seule boîte de dialogue pour toute la grille. On ne remet pas oeuvreToDelete à null
// à la fermeture pour que le titre reste affiché pendant l'animation de sortie.
const deleteDialogOpen = ref(false);
const oeuvreToDelete = ref<Oeuvre | null>(null);

function askDelete(oeuvre: Oeuvre) {
  oeuvreToDelete.value = oeuvre;
  deleteDialogOpen.value = true;
}

function formatDate(o: Oeuvre) {
  return new Date(o.dateModification ?? o.dateCreation).toLocaleDateString('fr-FR');
}

// Boutons posés sur l'image : fond sombre translucide pour rester lisibles quelle que soit la couverture.
const overlayButton =
  'bg-black/45 text-white backdrop-blur-sm hover:bg-black/65 hover:text-white dark:hover:bg-black/65';
</script>

<template>
  <main class="p-3 sm:p-4 md:p-6">
    <div class="mb-4 flex items-center justify-between gap-3 sm:mb-6">
      <h1 class="text-xl font-semibold sm:text-2xl">Œuvres</h1>
      <Button as-child>
        <RouterLink :to="{ name: 'oeuvre-nouvelle' }">
          <Plus data-icon="inline-start" />
          Nouvelle œuvre
        </RouterLink>
      </Button>
    </div>

    <!--
      auto-fill + minmax : le nombre de colonnes suit la largeur réellement disponible
      (sidebar ouverte ou non) — 2 colonnes sur mobile, puis autant que la place le permet.
    -->
    <div
      class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,9.5rem),1fr))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] sm:gap-4 md:gap-6"
    >
      <template v-if="loading && !oeuvres.length">
        <Skeleton v-for="n in 8" :key="n" class="aspect-3/4 rounded-2xl" />
      </template>

      <Card
        v-for="oeuvre in oeuvres"
        :key="oeuvre.id"
        class="hover:ring-primary has-focus-visible:ring-primary relative isolate aspect-3/4 justify-between gap-0 py-0 transition-shadow hover:shadow-lg hover:ring-2 has-focus-visible:ring-2"
      >
        <!-- Couverture en fond plein (enveloppée pour échapper aux styles img:first-child de Card) -->
        <div class="bg-muted absolute inset-0 -z-10">
          <img
            v-if="oeuvre.couverturePremiere"
            :src="oeuvre.couverturePremiere"
            :alt="`Couverture de ${oeuvre.titre}`"
            class="size-full object-cover transition-transform duration-500 motion-safe:group-hover/card:scale-105"
            loading="lazy"
          />
          <div
            v-else
            class="text-muted-foreground flex size-full flex-col items-center justify-center gap-2 pb-[45%] text-xs"
          >
            <BookOpen class="size-8 opacity-60" />
            Pas de couverture
          </div>
        </div>

        <CardHeader class="px-2 pt-2 sm:px-3 sm:pt-3">
          <!-- relative z-10 : reste cliquable au-dessus du lien étiré de la carte -->
          <CardAction class="relative z-10 flex gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              as-child
              :class="overlayButton"
              :aria-label="`Paramètres de ${oeuvre.titre}`"
              title="Paramètres"
            >
              <RouterLink :to="{ name: 'oeuvre-parametres', params: { id: oeuvre.id } }">
                <Settings />
              </RouterLink>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              :class="[overlayButton, 'hover:bg-destructive dark:hover:bg-destructive']"
              :aria-label="`Supprimer ${oeuvre.titre}`"
              title="Supprimer"
              @click="askDelete(oeuvre)"
            >
              <Trash />
            </Button>
          </CardAction>
        </CardHeader>

        <!-- Dégradé sombre en bas pour garantir le contraste du texte sur n'importe quelle image -->
        <CardContent
          class="grid gap-1 bg-linear-to-t from-black/90 via-black/60 to-transparent px-3 pt-12 pb-3 text-white sm:px-4 sm:pt-16 sm:pb-4"
        >
          <CardTitle class="line-clamp-2 text-sm text-white sm:text-base">
            <!--
              Lien « étiré » : son ::after couvre toute la carte, ce qui la rend cliquable
              sans imbriquer le bouton Supprimer dans un lien.
            -->
            <RouterLink
              :to="{ name: 'oeuvre-detail', params: { id: oeuvre.id } }"
              class="outline-none after:absolute after:inset-0"
            >
              {{ oeuvre.titre }}
            </RouterLink>
          </CardTitle>
          <CardDescription class="text-xs text-white/70">
            {{ oeuvre.dateModification ? 'Modifiée le' : 'Créée le' }}
            {{ formatDate(oeuvre) }}
          </CardDescription>
          <p v-if="oeuvre.resume" class="mt-1 line-clamp-2 text-xs text-white/85 max-sm:hidden">
            {{ oeuvre.resume }}
          </p>
        </CardContent>
      </Card>
    </div>

    <div
      v-if="!loading && !oeuvres.length"
      class="text-muted-foreground flex flex-col items-center gap-4 py-12 text-center text-sm"
    >
      <p>Aucune œuvre pour le moment.</p>
      <Button variant="outline" as-child>
        <RouterLink :to="{ name: 'oeuvre-nouvelle' }">
          <Plus data-icon="inline-start" />
          Créer ma première œuvre
        </RouterLink>
      </Button>
    </div>

    <OeuvreDeleteDialog
      v-model:open="deleteDialogOpen"
      :oeuvre="oeuvreToDelete"
      @deleted="removeOeuvre"
    />
  </main>
</template>
