import { toast } from 'vue-sonner';
import api from '@/services/api.ts';
import { OeuvreSchema, type Oeuvre, type OeuvreCreateRequest } from '@/schemas/oeuvreSchema.ts';

export async function useCreateOeuvre(request: OeuvreCreateRequest): Promise<Oeuvre> {
  try {
    const response = await api.post('api/oeuvre', request);
    return OeuvreSchema.parse(response.data);
  } catch (error) {
    toast.error("Impossible de créer l'œuvre", {
      description: 'Vérifiez les champs puis réessayez.',
    });
    throw error;
  }
}
