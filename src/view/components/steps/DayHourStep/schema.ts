import { z } from 'zod';

export const dayHourStepSchema = z.object(
  {
    date: z.string(),
    startTime: z.number(),
    price: z.number(),
    order: z.number(),
    durationMinutes: z.number(),
  },
  { message: 'Selecione um serviço' },
);
