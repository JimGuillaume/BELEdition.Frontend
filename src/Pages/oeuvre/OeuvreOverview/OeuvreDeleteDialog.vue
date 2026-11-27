<script setup lang="ts">
import { ref } from 'vue';
import { Trash } from '@lucide/vue';
import { toast } from 'vue-sonner';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { Oeuvre } from '@/schemas/oeuvreSchema';
import { useDeleteOeuvre } from '@/api/oeuvre/useDeleteOeuvre';

const props = defineProps<{ oeuvre: Oeuvre | null }>();
const open = defineModel<boolean>('open', { required: true });
const emit = defineEmits<{ deleted: [id: string] }>();

const deleting = ref(false);

async function confirmDelete() {
  if (!props.oeuvre) return;
  deleting.value = true;
  try {
    await useDeleteOeuvre(props.oeuvre.id);
    toast.success(`« ${props.oeuvre.titre} » a été supprimée`);
    emit('deleted', props.oeuvre.id);
    open.value = false;
  } catch {
    // Erreur déjà signalée par un toast ; la boîte reste ouverte pour réessayer.
  } finally {
    deleting.value = false;
  }
}

// Empêche la fermeture (Échap, clic extérieur) pendant la suppression.
function onOpenChange(value: boolean) {
  if (!deleting.value) open.value = value;
}
</script>

<template>
  <AlertDialog :open="open" @update:open="onOpenChange">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogMedia class="bg-destructive/10 text-destructive">
          <Trash />
        </AlertDialogMedia>
        <AlertDialogTitle>Supprimer cette œuvre ?</AlertDialogTitle>
        <AlertDialogDescription>
          « {{ oeuvre?.titre }} » sera définitivement supprimée. Cette action est irréversible.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel :disabled="deleting">Annuler</AlertDialogCancel>
        <!-- Button simple plutôt qu'AlertDialogAction, qui fermerait la boîte avant la fin de l'appel. -->
        <Button variant="destructive" :disabled="deleting" @click="confirmDelete">
          {{ deleting ? 'Suppression…' : 'Supprimer' }}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
