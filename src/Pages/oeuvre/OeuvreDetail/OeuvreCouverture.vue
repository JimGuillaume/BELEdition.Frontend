<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { BookOpen, Settings, Trash } from '@lucide/vue';
import { Card, CardAction, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Oeuvre } from '@/schemas/oeuvreSchema';

defineProps<{ oeuvre: Oeuvre }>();
defineEmits<{ delete: [] }>();

// Boutons posés sur l'image : fond sombre translucide pour rester lisibles quelle que soit la couverture.
const overlayButton =
  'bg-black/45 text-white backdrop-blur-sm hover:bg-black/65 hover:text-white dark:hover:bg-black/65';
</script>

<template>
  <Card class="relative isolate aspect-3/4 gap-0 py-0">
    <!-- Couverture en fond plein (enveloppée pour échapper aux styles img:first-child de Card) -->
    <div class="bg-muted absolute inset-0 -z-10">
      <img
        v-if="oeuvre.couverturePremiere"
        :src="oeuvre.couverturePremiere"
        :alt="`Couverture de ${oeuvre.titre}`"
        class="size-full object-cover"
      />
      <div
        v-else
        class="text-muted-foreground flex size-full flex-col items-center justify-center gap-2 text-xs"
      >
        <BookOpen class="size-8 opacity-60" />
        Pas de couverture
      </div>
    </div>

    <CardHeader class="px-3 pt-3">
      <CardAction class="flex gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          as-child
          :class="overlayButton"
          aria-label="Paramètres de l'œuvre"
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
          aria-label="Supprimer l'œuvre"
          title="Supprimer"
          @click="$emit('delete')"
        >
          <Trash />
        </Button>
      </CardAction>
    </CardHeader>
  </Card>
</template>
