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

export const confirmedClientStepSchema = confirmedStepSchema.extend({
  clientName: z.string(),
});

export const confirmedBookingStepSchema = confirmedClientStepSchema.extend({
  oldId: z.number(),
  services: z
    .object({
      serviceId: z.number(),
      serviceName: z.string(),
      price: z.number(),
      order: z.number(),
      durationMinutes: z.number(),
    })
    .array(),
});
