import { NextResponse } from 'next/server';
import { revalidateTags } from '@/lib/revalidate';
import { contactSchema, submitContact } from '@/lib/contact';

export async function POST(req: Request) {
  let body: { secret?: string; tags?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }

  const secret = body.secret || '';
  const tags = body.tags || [];
  const result = await revalidateTags(tags, secret);
  if (!result.ok) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ ok: true, tags: result.tags });
}
