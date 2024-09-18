import { z } from 'zod';

export const serviceStepSchema = z.object(
  {
    serviceId: z.number(),
    name: z.string(),
    price: z.number(),
    order: z.number(),
    durationMinutes: z.number(),
  },
  { message: 'Selecione um serviço' },
);
