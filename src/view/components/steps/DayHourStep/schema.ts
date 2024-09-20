import { z } from 'zod';

export const dayHourStepSchema = z.object(
  {
    date: z.string(),
    startTime: z.number().min(1, 'Selecione um dia e horário'),
    durationMinutes: z.number(),
  },
  { message: 'Selecione um dia e horário' },
);
