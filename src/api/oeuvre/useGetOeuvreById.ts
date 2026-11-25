import { toast } from 'vue-sonner'
import api from '@/services/api.ts'
import { OeuvreSchema, type Oeuvre } from '@/schemas/oeuvreSchema.ts'

export async function useGetOeuvreById(id: string): Promise<Oeuvre> {
  try {
    const response = await api.get(`api/oeuvre/${id}`)
    return OeuvreSchema.parse(response.data)
  } catch (error) {
    toast.error("Impossible de charger l'œuvre", {
      description: 'Veuillez réessayer plus tard.',
    })
    throw error
  }
}
