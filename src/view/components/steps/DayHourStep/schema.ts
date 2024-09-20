import { z } from 'zod';

export const dayHourStepSchema = z.object(
  {
    date: z.string(),
    startTime: z.number(),
    durationMinutes: z.number(),
  },
  { message: 'Selecione um dia e horário' },
);
