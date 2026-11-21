import { z } from 'zod'

export const OeuvreSchema = z.object({
  id: z.ulid(),
  titre: z.string(),
  resume: z.string(),
  couverturePremiere: z.url(),
  couvertureQuatrieme: z.url(),
  dateCreation: z.iso.datetime({ local: true }),
  dateModification: z.iso.datetime({ local: true }).nullable(),
})

export type Oeuvre = z.infer<typeof OeuvreSchema>
