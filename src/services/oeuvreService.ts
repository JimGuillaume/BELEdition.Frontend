import { toast } from 'vue-sonner'
import api from './api'
import { OeuvreSchema, type Oeuvre } from '@/schemas/oeuvreSchema'

export async function GetOeuvreById(id: string): Promise<Oeuvre> {
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
