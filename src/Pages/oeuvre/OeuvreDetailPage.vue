<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { ArrowLeft } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Oeuvre } from '@/schemas/oeuvreSchema';
import { useGetOeuvreById } from '@/api/oeuvre/useGetOeuvreById';
import { useOeuvres } from '@/composables/useOeuvres';
import OeuvreCouverture from '@/Pages/oeuvre/OeuvreDetail/OeuvreCouverture.vue';
import OeuvreDeleteDialog from '@/Pages/oeuvre/OeuvreOverview/OeuvreDeleteDialog.vue';

const props = defineProps<{ id: string }>();

const router = useRouter();
const { removeOeuvre } = useOeuvres();

const oeuvre = ref<Oeuvre | null>(null);
const status = ref<'loading' | 'ready' | 'error'>('loading');
const deleteDialogOpen = ref(false);

// watch plutôt qu'onMounted : la page est réutilisée quand on passe d'une œuvre à l'autre.
watch(
  () => props.id,
  async (id) => {
    status.value = 'loading';
    try {
      oeuvre.value = await useGetOeuvreById(id);
      status.value = 'ready';
    } catch {
      status.value = 'error';
    }
  },
  { immediate: true },
);

async function onDeleted(id: string) {
  removeOeuvre(id);
  await router.push({ name: 'oeuvres' });
}
</script>

<template>
  <main class="p-3 sm:p-4 md:p-6">
    <Button variant="ghost" size="sm" as-child class="mb-4">
      <RouterLink :to="{ name: 'oeuvres' }">
        <ArrowLeft data-icon="inline-start" />
        Retour aux œuvres
      </RouterLink>
    </Button>

    <div v-if="status === 'loading'" class="grid gap-6 md:grid-cols-[minmax(0,18rem)_1fr]">
      <Skeleton class="aspect-3/4 rounded-2xl" />
    </div>

    <p v-else-if="status === 'error'" class="text-muted-foreground">
      Cette œuvre est introuvable ou n'a pas pu être chargée.
    </p>

    <template v-else-if="oeuvre">
      <h1 class="mb-4 text-xl font-semibold sm:mb-6 sm:text-2xl">{{ oeuvre.titre }}</h1>

      <div class="grid gap-6 md:grid-cols-[minmax(0,18rem)_1fr]">
        <OeuvreCouverture
          :oeuvre="oeuvre"
          class="w-full max-w-72"
          @delete="deleteDialogOpen = true"
        />
        <div>Composant Infos/Tag</div>
      </div>
      <div class="mt-6">Composant Chapitres</div>

      <OeuvreDeleteDialog v-model:open="deleteDialogOpen" :oeuvre="oeuvre" @deleted="onDeleted" />
    </template>
  </main>
</template>
