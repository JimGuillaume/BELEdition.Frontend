import { toast } from 'vue-sonner'
import api from '@/services/api.ts'
import { OeuvreSchema, type Oeuvre } from '@/schemas/oeuvreSchema.ts'

export async function useGetOeuvresByUserId(userId: string): Promise<Oeuvre[]> {
  try {
    const response = await api.get(`api/oeuvre/user/${userId}`)
    return OeuvreSchema.array().parse(response.data)
  } catch (error) {
    toast.error('Impossible de charger les œuvres', {
      description: 'Veuillez réessayer plus tard.',
    })
    throw error
  }
}
