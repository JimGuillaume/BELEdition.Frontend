import { z } from 'zod';

export const OeuvreSchema = z.object({
  id: z.ulid(),
  titre: z.string(),
  resume: z.string().nullable(),
  couverturePremiere: z.url().nullable(),
  couvertureQuatrieme: z.url().nullable(),
  dateCreation: z.iso.datetime({ local: true }),
  dateModification: z.iso.datetime({ local: true }).nullable(),
});

export type Oeuvre = z.infer<typeof OeuvreSchema>;

// Champ texte facultatif : une chaîne vide est envoyée comme null au backend.
const optionalText = z
  .string()
  .trim()
  .transform((v) => v || null);

const optionalCoverUrl = z
  .string()
  .trim()
  .max(500, "L'URL ne doit pas dépasser 500 caractères.")
  .refine((v) => v === '' || z.httpUrl().safeParse(v).success, {
    error: 'URL invalide (doit commencer par http:// ou https://).',
  })
  .transform((v) => v || null);

// Champs éditables d'une œuvre, partagés par la création et la modification —
// mêmes règles que Create/UpdateOeuvreCommandValidator côté backend.
export const OeuvreFormSchema = z.object({
  titre: z
    .string()
    .trim()
    .min(1, 'Le titre est obligatoire.')
    .max(300, 'Le titre ne doit pas dépasser 300 caractères.'),
  resume: optionalText,
  couverturePremiere: optionalCoverUrl,
  couvertureQuatrieme: optionalCoverUrl,
});

// Valeurs du formulaire (toutes des chaînes) / données validées (chaînes vides -> null).
export type OeuvreFormValues = z.input<typeof OeuvreFormSchema>;
export type OeuvreFormData = z.output<typeof OeuvreFormSchema>;

// Corps de PUT /api/oeuvre/{id}
export type OeuvreUpdateRequest = OeuvreFormData;

// Corps de POST /api/oeuvre
export type OeuvreCreateRequest = OeuvreFormData & {
  idAuteur: string;
  idType: string;
  idStatus: string;
};

export const emptyOeuvreForm = (): OeuvreFormValues => ({
  titre: '',
  resume: '',
  couverturePremiere: '',
  couvertureQuatrieme: '',
});

export const oeuvreToForm = (o: Oeuvre): OeuvreFormValues => ({
  titre: o.titre,
  resume: o.resume ?? '',
  couverturePremiere: o.couverturePremiere ?? '',
  couvertureQuatrieme: o.couvertureQuatrieme ?? '',
});
