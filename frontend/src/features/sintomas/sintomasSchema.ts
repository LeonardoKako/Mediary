import { z } from 'zod';

export const sintomaSchema = z.object({
  id: z.number(),
  usuario_id: z.number(),
  tipo: z.string(), // DOR, FEBRE, NÁUSEA, FADIGA, OUTRO...
  subtipo: z.string().nullable(), // CABEÇA, ABDOMINAL, etc
  descricao: z.string().nullable(),
  inicio: z.string(),
  fim: z.string().nullable(),
  criado_em: z.string(),
  atualizado_em: z.string()
});

export type Sintoma = z.infer<typeof sintomaSchema>;

export const createSintomaSchema = z.object({
  tipo: z.string(),
  subtipo: z.string().nullable(),
  descricao: z.string().nullable(),
  inicio: z.string()
});

export type CreateSintomaForm = z.infer<typeof createSintomaSchema>;
