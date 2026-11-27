<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { ArrowLeft } from '@lucide/vue';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import { emptyOeuvreForm, type OeuvreFormData } from '@/schemas/oeuvreSchema';
import { useCreateOeuvre } from '@/api/oeuvre/useCreateOeuvre';
import { useOeuvres } from '@/composables/useOeuvres';
import {
  PLACEHOLDER_AUTEUR_ID,
  PLACEHOLDER_STATUS_ID,
  PLACEHOLDER_TYPE_ID,
} from '@/lib/placeholderRefs';
import OeuvreForm from '@/Pages/oeuvre/OeuvreForm/OeuvreForm.vue';

const router = useRouter();
const { upsertOeuvre } = useOeuvres();

async function create(data: OeuvreFormData) {
  const created = await useCreateOeuvre({
    ...data,
    idAuteur: PLACEHOLDER_AUTEUR_ID,
    idType: PLACEHOLDER_TYPE_ID,
    idStatus: PLACEHOLDER_STATUS_ID,
  });
  upsertOeuvre(created);
  toast.success(`« ${created.titre} » a été créée`);
  await router.push({ name: 'oeuvres' });
}
</script>

<template>
  <main class="mx-auto w-full max-w-3xl p-3 sm:p-4 md:p-6">
    <Button variant="ghost" size="sm" as-child class="mb-4">
      <RouterLink :to="{ name: 'oeuvres' }">
        <ArrowLeft data-icon="inline-start" />
        Retour aux œuvres
      </RouterLink>
    </Button>

    <OeuvreForm
      :initial="emptyOeuvreForm()"
      title="Nouvelle œuvre"
      description="Renseignez les informations de votre œuvre. Seul le titre est obligatoire."
      submit-label="Créer l'œuvre"
      submitting-label="Création…"
      :cancel-to="{ name: 'oeuvres' }"
      :submit="create"
    />
  </main>
</template>
