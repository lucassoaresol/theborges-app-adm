import { z } from 'zod';

export const clientStepSchema = z.object(
  {
    clientId: z.number(),
    name: z.string(),
    phone: z.string(),
  },
  { message: 'Selecione um cliente' },
);
