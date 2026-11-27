<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { RouterLink, type RouteLocationRaw } from 'vue-router';
import { isAxiosError } from 'axios';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  OeuvreFormSchema,
  type OeuvreFormData,
  type OeuvreFormValues,
} from '@/schemas/oeuvreSchema';

// Formulaire partagé par la création et la modification d'une œuvre.
// Valide côté client, appelle `submit`, puis affiche les erreurs 400 du backend sous chaque champ.
const props = withDefaults(
  defineProps<{
    initial: OeuvreFormValues;
    title: string;
    description?: string;
    submitLabel: string;
    submittingLabel: string;
    cancelTo: RouteLocationRaw;
    // Modification : on désactive l'envoi tant que rien n'a changé.
    requireChanges?: boolean;
    // Doit rejeter (throw) en cas d'échec pour que le formulaire reste éditable.
    submit: (data: OeuvreFormData) => Promise<void>;
  }>(),
  { requireChanges: false },
);

type Field = keyof OeuvreFormValues;

const form = reactive<OeuvreFormValues>({ ...props.initial });
const errors = reactive<Partial<Record<Field, string>>>({});
const saving = ref(false);

const isDirty = computed(() =>
  (Object.keys(props.initial) as Field[]).some((k) => props.initial[k] !== form[k]),
);

const covers = [
  { field: 'couverturePremiere', label: 'Première de couverture' },
  { field: 'couvertureQuatrieme', label: 'Quatrième de couverture' },
] as const;

function clearErrors() {
  for (const key of Object.keys(errors) as Field[]) delete errors[key];
}

// Les erreurs FluentValidation arrivent avec les noms C# (« Titre ») : on les ramène au camelCase.
function applyServerErrors(error: unknown) {
  if (!isAxiosError(error) || error.response?.status !== 400) return;
  const serverErrors: Record<string, string[]> = error.response.data?.errors ?? {};
  for (const [key, messages] of Object.entries(serverErrors)) {
    const field = (key.charAt(0).toLowerCase() + key.slice(1)) as Field;
    if (field in form) errors[field] = messages[0];
  }
}

async function onSubmit() {
  clearErrors();
  const result = OeuvreFormSchema.safeParse(form);
  if (!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors;
    for (const [key, messages] of Object.entries(fieldErrors)) {
      errors[key as Field] = messages?.[0];
    }
    return;
  }

  saving.value = true;
  try {
    await props.submit(result.data);
  } catch (error) {
    applyServerErrors(error);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <Card>
      <CardHeader>
        <CardTitle>{{ title }}</CardTitle>
        <CardDescription v-if="description">{{ description }}</CardDescription>
      </CardHeader>

      <CardContent class="grid gap-6">
        <div class="grid gap-2">
          <Label for="titre">Titre</Label>
          <Input
            id="titre"
            v-model="form.titre"
            maxlength="300"
            required
            :aria-invalid="!!errors.titre"
            aria-describedby="titre-error"
          />
          <p v-if="errors.titre" id="titre-error" class="text-destructive text-sm">
            {{ errors.titre }}
          </p>
        </div>

        <div class="grid gap-2">
          <Label for="resume">Résumé</Label>
          <Textarea
            id="resume"
            v-model="form.resume"
            class="min-h-32"
            :aria-invalid="!!errors.resume"
          />
          <p v-if="errors.resume" class="text-destructive text-sm">{{ errors.resume }}</p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2">
          <div v-for="cover in covers" :key="cover.field" class="grid content-start gap-2">
            <Label :for="cover.field">{{ cover.label }}</Label>
            <Input
              :id="cover.field"
              v-model="form[cover.field]"
              type="url"
              inputmode="url"
              placeholder="https://…"
              maxlength="500"
              :aria-invalid="!!errors[cover.field]"
            />
            <p v-if="errors[cover.field]" class="text-destructive text-sm">
              {{ errors[cover.field] }}
            </p>
            <img
              v-if="form[cover.field]"
              :src="form[cover.field]"
              :alt="`Aperçu : ${cover.label}`"
              class="bg-muted aspect-3/4 w-40 rounded-lg object-cover"
            />
            <div
              v-else
              class="bg-muted text-muted-foreground flex aspect-3/4 w-40 items-center justify-center rounded-lg text-xs"
            >
              Pas de couverture
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter class="justify-end gap-2">
        <Button variant="outline" as-child>
          <RouterLink :to="cancelTo">Annuler</RouterLink>
        </Button>
        <Button type="submit" :disabled="saving || (requireChanges && !isDirty)">
          {{ saving ? submittingLabel : submitLabel }}
        </Button>
      </CardFooter>
    </Card>
  </form>
</template>
