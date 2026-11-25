import { z } from 'zod'

export const OeuvreSchema = z.object({
  id: z.ulid(),
  titre: z.string(),
  resume: z.string().nullable(),
  couverturePremiere: z.url().nullable(),
  couvertureQuatrieme: z.url().nullable(),
  dateCreation: z.iso.datetime({ local: true }),
  dateModification: z.iso.datetime({ local: true }).nullable(),
})

export type Oeuvre = z.infer<typeof OeuvreSchema>
