import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(320),
  phone: z.string().min(6).max(40),
  guests: z.string().max(10).optional(),
  preferred_date: z.string().max(40).optional(),
  preferred_time: z.string().max(40).optional(),
  message: z.string().min(10).max(4000),
  locale: z.enum(['en', 'bn']).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
