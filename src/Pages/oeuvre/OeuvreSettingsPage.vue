<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { ArrowLeft } from '@lucide/vue';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import { oeuvreToForm, type Oeuvre, type OeuvreFormData } from '@/schemas/oeuvreSchema';
import { useGetOeuvreById } from '@/api/oeuvre/useGetOeuvreById';
import { useUpdateOeuvre } from '@/api/oeuvre/useUpdateOeuvre';
import { useOeuvres } from '@/composables/useOeuvres';
import OeuvreForm from '@/Pages/oeuvre/OeuvreForm/OeuvreForm.vue';

const props = defineProps<{ id: string }>();

const router = useRouter();
const { upsertOeuvre } = useOeuvres();

// La modification se fait depuis la page détail : retour, annulation et enregistrement y ramènent.
const detailRoute = computed(() => ({ name: 'oeuvre-detail', params: { id: props.id } }));

const oeuvre = ref<Oeuvre | null>(null);
const status = ref<'loading' | 'ready' | 'error'>('loading');

onMounted(async () => {
  try {
    oeuvre.value = await useGetOeuvreById(props.id);
    status.value = 'ready';
  } catch {
    status.value = 'error';
  }
});

async function save(data: OeuvreFormData) {
  const updated = await useUpdateOeuvre(props.id, data);
  upsertOeuvre(updated);
  toast.success('Œuvre enregistrée');
  await router.push(detailRoute.value);
}
</script>

<template>
  <main class="mx-auto w-full max-w-3xl p-3 sm:p-4 md:p-6">
    <Button variant="ghost" size="sm" as-child class="mb-4">
      <RouterLink :to="detailRoute">
        <ArrowLeft data-icon="inline-start" />
        Retour à l'œuvre
      </RouterLink>
    </Button>

    <p v-if="status === 'loading'" class="text-muted-foreground">Chargement…</p>

    <p v-else-if="status === 'error'" class="text-muted-foreground">
      Cette œuvre est introuvable ou n'a pas pu être chargée.
    </p>

    <OeuvreForm
      v-else-if="oeuvre"
      :initial="oeuvreToForm(oeuvre)"
      title="Paramètres de l'œuvre"
      :description="`Modifiez les informations de « ${oeuvre.titre} ».`"
      submit-label="Enregistrer"
      submitting-label="Enregistrement…"
      :cancel-to="detailRoute"
      require-changes
      :submit="save"
    />
  </main>
</template>
