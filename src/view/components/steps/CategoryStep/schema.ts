import { z } from 'zod';

export const categoryStepSchema = z.object(
  {
    categoryId: z.number(),
  },
  { message: 'Selecione uma categoria' },
);
