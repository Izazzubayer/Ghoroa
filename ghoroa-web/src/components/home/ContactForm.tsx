'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const fieldClass =
  'rounded-none border-gold-deep/30 bg-forest/30 px-4 py-3 text-cream placeholder:text-cream/50 focus-visible:border-gold focus-visible:ring-gold/40';

export function ContactForm({
  locale,
}: {
  locale: 'en' | 'bn';
  settings: { phone: string; email: string };
}) {
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        locale,
      }),
    });
    if (res.ok) {
      toast.success(
        locale === 'bn' ? 'ধন্যবাদ — আমরা ২৪ ঘণ্টার মধ্যে লিখব।' : 'Thanks — we will reply within 24 hours.',
      );
      form.reset();
    } else {
      toast.error(
        locale === 'bn' ? 'ফর্মটি যাচাই করে আবার চেষ্টা করুন।' : 'Please check your form and try again.',
      );
    }
  }

  const labels =
    locale === 'bn'
      ? { name: 'নাম', email: 'ইমেইল', phone: 'ফোন', message: 'বার্তা', send: 'পাঠান' }
      : { name: 'Name', email: 'Email', phone: 'Phone', message: 'Message', send: 'Send' };

  return (
    <form onSubmit={onSubmit} className="mt-10">
      <FieldGroup className="gap-4">
        <Field>
          <FieldLabel className="text-[0.62rem] uppercase tracking-[0.2em] text-gold-deep">{labels.name}</FieldLabel>
          <Input name="name" required className={fieldClass} />
        </Field>
        <Field>
          <FieldLabel className="text-[0.62rem] uppercase tracking-[0.2em] text-gold-deep">{labels.email}</FieldLabel>
          <Input name="email" type="email" required className={fieldClass} />
        </Field>
        <Field>
          <FieldLabel className="text-[0.62rem] uppercase tracking-[0.2em] text-gold-deep">{labels.phone}</FieldLabel>
          <Input name="phone" required className={fieldClass} />
        </Field>
        <Field>
          <FieldLabel className="text-[0.62rem] uppercase tracking-[0.2em] text-gold-deep">{labels.message}</FieldLabel>
          <Textarea name="message" required rows={5} className={fieldClass} />
        </Field>
        <Button type="submit" variant="primary" size="cta">
          {labels.send}
        </Button>
      </FieldGroup>
    </form>
  );
}
