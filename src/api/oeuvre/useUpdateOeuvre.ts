import { toast } from 'vue-sonner';
import api from '@/services/api.ts';
import { OeuvreSchema, type Oeuvre, type OeuvreUpdateRequest } from '@/schemas/oeuvreSchema.ts';

export async function useUpdateOeuvre(id: string, request: OeuvreUpdateRequest): Promise<Oeuvre> {
  try {
    const response = await api.put(`api/oeuvre/${id}`, request);
    return OeuvreSchema.parse(response.data);
  } catch (error) {
    toast.error("Impossible d'enregistrer l'œuvre", {
      description: 'Vérifiez les champs puis réessayez.',
    });
    throw error;
  }
}
