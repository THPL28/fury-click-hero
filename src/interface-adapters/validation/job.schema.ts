import { z } from 'zod';

export const dispatchJobSchema = z.object({
  target: z.string().min(1, 'Target is required'),
  type: z.enum(['email', 'notification', 'report'], {
    errorMap: () => ({ message: 'Type must be email, notification or report' }),
  }),
  payload: z.record(z.any()).default({}),
});

export type DispatchJobRequest = z.infer<typeof dispatchJobSchema>;
