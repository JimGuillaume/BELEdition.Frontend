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

// TODO : remplacer les données fictives par le vrai appel API quand un endpoint « liste des œuvres » existera, ex. :
//   const response = await api.get('api/oeuvre')
//   return OeuvreSchema.array().parse(response.data)
export async function GetOeuvres(): Promise<Oeuvre[]> {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `01JD000000000000000000000${i}`,
    titre: `Œuvre ${i + 1}`,
    resume:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    couverturePremiere: `https://picsum.photos/seed/oeuvre-${i}/600/800`,
    couvertureQuatrieme: `https://picsum.photos/seed/oeuvre-back-${i}/600/800`,
    dateCreation: '2026-01-15T10:00:00',
    dateModification: null,
  }))
}
