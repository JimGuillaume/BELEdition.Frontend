<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Oeuvre } from '@/schemas/oeuvreSchema'
import { GetOeuvres } from '@/services/oeuvreService'

const oeuvres = ref<Oeuvre[]>([])

onMounted(async () => {
  oeuvres.value = await GetOeuvres()
})

function formatDate(o: Oeuvre) {
  return new Date(o.dateModification ?? o.dateCreation).toLocaleDateString('fr-FR')
}
</script>

<template>
  <main class="p-4 md:p-6">
    <h1 class="mb-6 text-2xl font-semibold">Œuvres</h1>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4 md:gap-6">
      <Card
        v-for="oeuvre in oeuvres"
        :key="oeuvre.id"
        class="hover:ring-primary h-full transition-[box-shadow] hover:shadow-md hover:ring-2"
      >
        <img
          :src="oeuvre.couverturePremiere"
          :alt="`Couverture de ${oeuvre.titre}`"
          class="aspect-[3/4] w-full object-cover"
          loading="lazy"
        />
        <CardHeader>
          <CardTitle class="line-clamp-1">{{ oeuvre.titre }}</CardTitle>
          <CardDescription>
            {{ oeuvre.dateModification ? 'Modifiée le' : 'Créée le' }}
            {{ formatDate(oeuvre) }}
          </CardDescription>
        </CardHeader>
        <CardContent class="flex-1">
          <p class="text-muted-foreground line-clamp-3">{{ oeuvre.resume }}</p>
        </CardContent>
      </Card>
    </div>
  </main>
</template>
