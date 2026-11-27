import { readonly, ref } from 'vue';
import type { Oeuvre } from '@/schemas/oeuvreSchema';
import { useGetAllOeuvres } from '@/api/oeuvre/useGetAllOeuvres';

// Liste partagée entre la sidebar et la page d'aperçu : une suppression ou une
// modification est visible partout sans refaire d'appel.
const oeuvres = ref<Oeuvre[]>([]);
const loading = ref(false);
let pending: Promise<void> | null = null;

export function useOeuvres() {
  // Les deux composants appellent fetch au montage : on réutilise la requête en cours.
  function fetchOeuvres(): Promise<void> {
    pending ??= (async () => {
      loading.value = true;
      try {
        oeuvres.value = await useGetAllOeuvres();
      } catch {
        // Erreur déjà signalée par un toast dans useGetAllOeuvres.
      } finally {
        loading.value = false;
        pending = null;
      }
    })();
    return pending;
  }

  function removeOeuvre(id: string) {
    oeuvres.value = oeuvres.value.filter((o) => o.id !== id);
  }

  // Ajoute ou remplace l'œuvre et la place en tête, comme le tri du backend
  // (ORDER BY COALESCE(DateModification, DateCreation) DESC).
  function upsertOeuvre(oeuvre: Oeuvre) {
    oeuvres.value = [oeuvre, ...oeuvres.value.filter((o) => o.id !== oeuvre.id)];
  }

  return {
    oeuvres: readonly(oeuvres),
    loading: readonly(loading),
    fetchOeuvres,
    removeOeuvre,
    upsertOeuvre,
  };
}
