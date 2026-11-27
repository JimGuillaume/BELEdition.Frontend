import { toast } from 'vue-sonner';
import api from '@/services/api.ts';
import { OeuvreSchema, type Oeuvre } from '@/schemas/oeuvreSchema.ts';

export async function useGetAllOeuvres(): Promise<Oeuvre[]> {
  try {
    const response = await api.get('api/oeuvre');
    return OeuvreSchema.array().parse(response.data);
  } catch (error) {
    // id fixe : la sidebar et la page d'aperçu appellent toutes deux cet endpoint,
    // on évite ainsi d'afficher deux fois le même toast.
    toast.error('Impossible de charger les œuvres', {
      id: 'get-all-oeuvres-error',
      description: 'Veuillez réessayer plus tard.',
    });
    throw error;
  }
}
