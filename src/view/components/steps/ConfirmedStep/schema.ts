import { z } from 'zod';

export const confirmedStepSchema = z.object({
  date: z.string(),
  startTime: z.number(),
  endTime: z.number(),
  forPersonName: z.string().optional(),
  clientId: z.number(),
  professionalId: z.number(),
  services: z
    .object({
      serviceId: z.number(),
      price: z.number(),
      order: z.number(),
    })
    .array(),
});
