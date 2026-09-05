import { revalidateTag } from 'next/cache';

/**
 * Signed revalidation for WordPress publish events.
 */
export async function revalidateTags(
  tags: string[],
  secret?: string
): Promise<{ ok: boolean; tags: string[] }> {
  const expected = process.env.GHOROA_REVALIDATE_SECRET || '';
  if (!expected || !secret || secret !== expected) {
    return { ok: false, tags };
  }
  for (const tag of tags) {
    revalidateTag(tag, 'max');
  }
  return { ok: true, tags };
}

