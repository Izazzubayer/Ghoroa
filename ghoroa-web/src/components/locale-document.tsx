'use client';

import { useEffect } from 'react';
import type { Locale } from '@/lib/cms';

/** Syncs <html lang> + .locale-bn so Bangla uses Noto Serif Bengali site-wide. */
export function LocaleDocument({ locale }: { locale: Locale }) {
  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale === 'bn' ? 'bn' : 'en';
    root.classList.toggle('locale-bn', locale === 'bn');
  }, [locale]);

  return null;
}
