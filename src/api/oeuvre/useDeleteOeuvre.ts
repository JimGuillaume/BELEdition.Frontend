import { toast } from 'vue-sonner';
import api from '@/services/api.ts';

export async function useDeleteOeuvre(id: string): Promise<void> {
  try {
    await api.delete(`api/oeuvre/${id}`);
  } catch (error) {
    toast.error("Impossible de supprimer l'œuvre", {
      description: 'Veuillez réessayer plus tard.',
    });
    throw error;
  }
}
