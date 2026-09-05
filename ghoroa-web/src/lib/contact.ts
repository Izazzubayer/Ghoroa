/**
 * Contact form validation and rate-limit helpers.
 */

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

/**
 * Soft rate limit in process memory. Production should use Redis / edge
 * rate limits. Demo only.
 */
function getAttempts(bucket: string): number {
  const store = (globalThis as { __ghoroaAttempts?: Record<string, number> }).__ghoroaAttempts || {};
  return store[bucket] || 0;
}

function recordAttempt(bucket: string): void {
  const store = (globalThis as { __ghoroaAttempts?: Record<string, number> }).__ghoroaAttempts || {};
  store[bucket] = (store[bucket] || 0) + 1;
  (globalThis as { __ghoroaAttempts?: Record<string, number> }).__ghoroaAttempts = store;
}

/**
 * Validate and rate-limit a reservation enquiry.
 */
export async function submitContact(input: unknown): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'validation' };
  }

  const bucket = `contact:${parsed.data.email}`;
  if (getAttempts(bucket) >= 5) {
    return { ok: false, error: 'rate' };
  }
  recordAttempt(bucket);
  // Phase 1: no outbound mail. Wire a transactional provider later.
  return { ok: true };
}
