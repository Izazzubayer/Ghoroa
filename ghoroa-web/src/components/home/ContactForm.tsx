'use client';

import { useState } from 'react';
import { localePrefix } from '@/lib/cms';

export function ContactForm({
  locale,
  settings,
}: {
  locale: 'en' | 'bn';
  settings: { phone: string; email: string };
}) {
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const [error, setError] = useState('');

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
      setStatus('ok');
      setError('');
      form.reset();
    } else {
      setStatus('err');
      setError('validation');
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-4">
      <label className="block">
        <span className="text-[0.62rem] uppercase tracking-[0.2em] text-gold-deep">Name</span>
        <input
          name="name"
          required
          className="mt-1 w-full border border-gold-deep/30 bg-forest/30 px-4 py-3 text-cream"
        />
      </label>
      <label className="block">
        <span className="text-[0.62rem] uppercase tracking-[0.2em] text-gold-deep">Email</span>
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full border border-gold-deep/30 bg-forest/30 px-4 py-3 text-cream"
        />
      </label>
      <label className="block">
        <span className="text-[0.62rem] uppercase tracking-[0.2em] text-gold-deep">Phone</span>
        <input
          name="phone"
          required
          className="mt-1 w-full border border-gold-deep/30 bg-forest/30 px-4 py-3 text-cream"
        />
      </label>
      <label className="block">
        <span className="text-[0.62rem] uppercase tracking-[0.2em] text-gold-deep">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          className="mt-1 w-full border border-gold-deep/30 bg-forest/30 px-4 py-3 text-cream"
        />
      </label>
      <button
        type="submit"
        className="border border-gold-deep/70 px-6 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gold"
      >
        {locale === 'bn' ? 'পাঠান' : 'Send'}
      </button>
      {status === 'ok' && (
        <p className="text-sm text-gold">
          {locale === 'bn' ? 'ধন্যবাদ — আমরা ২৪ ঘণ্টা লিখব।' : 'Thanks — we will reply within 24 hours.'}
        </p>
      )}
      {status === 'err' && (
        <p className="text-sm text-terracotta">
          {locale === 'bn' ? 'ফর্ম  লিখতে  লিখতে  লিখতে  লিখতে  লিখতে  লিখতে  লিখতে' : 'Please check your form and try again.'}
        </p>
      )}
    </form>
  );
}
