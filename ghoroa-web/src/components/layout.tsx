'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { localePrefix } from '@/lib/cms';
import { SplitAccordion, type AccordionItemData } from '@/components/watermelon/card-split-accordian';
import { Reveal } from '@/components/primitives';

export type NavLink = { href: string; label: string };

export function Nav({
  locale,
  solid: _solid,
  links,
}: {
  locale: 'en' | 'bn';
  solid?: boolean;
  links?: NavLink[];
}) {
  const [open, setOpen] = useState(false);
  const defaultLinks: NavLink[] = [
    { href: localePrefix(locale), label: 'Home' },
    { href: `${localePrefix(locale)}/about`, label: 'Our Story' },
    { href: `${localePrefix(locale)}/menu`, label: 'Menu' },
    { href: `${localePrefix(locale)}/locations`, label: 'Locations' },
    { href: `${localePrefix(locale)}/contact`, label: 'Reservations' },
  ];
  const LINKS = links ?? defaultLinks;
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        open || _solid ? 'bg-dark/95 shadow-[0_1px_0_rgba(236,177,116,0.18)] backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[82rem] items-center justify-between gap-6 px-5 py-4 lg:px-10">
        <a href={localePrefix(locale)} aria-label="Ghoroa — home" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-with-wordmark-dark.svg" alt="Ghoroa" className="h-12 w-auto" width="180" height="48" />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 text-cream/75 hover:text-gold"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:+8801711223344"
            className="hidden border border-gold-deep/70 px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold transition-colors duration-300 hover:bg-gold hover:text-forest sm:inline-flex"
          >
            Book a table
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex h-10 w-10 items-center justify-center border border-gold-deep/50 text-gold lg:hidden"
          >
            <span aria-hidden className="text-base leading-none">
              {open ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        ref={panelRef}
        hidden={!open}
        className="border-t border-gold-deep/20 bg-dark/98 px-5 pb-8 pt-4 backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Mobile">
          <ul className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="display block border-b border-cream/10 py-3 text-xl text-cream hover:text-gold"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href="tel:+8801711223344"
          onClick={() => setOpen(false)}
          className="mt-5 inline-flex border border-gold-deep/70 px-5 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gold"
        >
          Book a table
        </a>
      </div>
    </header>
  );
}

export function FaqSection({
  locale,
  items,
}: {
  locale: 'en' | 'bn';
  items: Array<{ id: number; question: string; answer: string }>;
}) {
  const accordion: AccordionItemData[] = items.map((item, i) => ({
    id: i + 1,
    title: item.question,
    content: item.answer,
  }));

  return (
    <section id="faq" className="relative bg-dark pb-24 lg:pb-32" aria-labelledby="faq-title">
      <div className="mx-auto max-w-3xl px-5 lg:px-10">
        <Reveal className="flex flex-col items-center text-center">
          <p className="flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold-deep">
            <svg aria-hidden width="6" height="6" viewBox="0 0 8 8" fill="currentColor">
              <path d="M4 0l4 4-4 4-4-4z" />
            </svg>
            {locale === 'bn' ? 'জানুন' : 'Good to know'}
            <svg aria-hidden width="6" height="6" viewBox="0 0 8 8" fill="currentColor">
              <path d="M4 0l4 4-4 4-4-4z" />
            </svg>
          </p>
          <h2 id="faq-title" className="display mt-5 text-[clamp(1.8rem,3.4vw,2.7rem)] font-normal text-cream">
            {locale === 'bn' ? 'প্রশ্ন, উত্তর।' : 'Questions, answered.'}
          </h2>
          <span aria-hidden className="mt-5 inline-flex items-center gap-2 text-gold-deep">
            <span className="h-px w-8 bg-current opacity-50" />
            <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
              <path d="M4 0l4 4-4 4-4-4z" />
            </svg>
            <span className="h-px w-8 bg-current opacity-50" />
          </span>
        </Reveal>

        <Reveal delay={0.08} className="mt-12">
          <SplitAccordion items={accordion} />
        </Reveal>
      </div>
    </section>
  );
}

export function SiteFooter({
  locale,
  settings,
}: {
  locale: 'en' | 'bn';
  settings: {
    order_now: string;
    phone: string;
    address: string;
    social: { instagram: string; facebook: string };
    tagline: string;
  };
}) {
  const prefix = localePrefix(locale);
  const columns = [
    {
      title: locale === 'bn' ? 'এক্সপ্লোর' : 'Explore',
      links: [
        [locale === 'bn' ? 'হোম' : 'Home', prefix],
        [locale === 'bn' ? 'আমাদের গল্প' : 'Our Story', `${prefix}/about`],
        [locale === 'bn' ? 'মেনু' : 'Menu', `${prefix}/menu`],
      ],
    },
    {
      title: locale === 'bn' ? 'ভিজিট' : 'Visit',
      links: [
        [locale === 'bn' ? 'রিজার্ভেশন' : 'Reservations', `${prefix}/contact`],
        [locale === 'bn' ? 'WhatsApp' : 'Order on WhatsApp', settings.order_now || 'https://wa.me/'],
        [locale === 'bn' ? 'ফোন' : 'Call us', `tel:${settings.phone.replace(/\s/g, '')}`],
      ],
    },
    {
      title: locale === 'bn' ? 'আইন' : 'Legal',
      links: [
        [locale === 'bn' ? 'FAQ' : 'FAQ', `${prefix}/faq`],
        [locale === 'bn' ? 'প্রাইভেসি' : 'Privacy', `${prefix}/privacy-policy`],
        [locale === 'bn' ? 'শর্ত' : 'Terms', `${prefix}/terms`],
      ],
    },
  ];

  return (
    <footer className="border-t border-gold-deep/20 bg-dark pt-16 pb-8" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Site footer
      </h2>
      <div className="mx-auto max-w-[82rem] px-5 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-with-wordmark-dark.svg" alt="Ghoroa" className="h-14 w-auto" width="200" height="56" />
            <p className="mt-5 max-w-xs text-[0.85rem] leading-[1.75] text-cream/75">{settings.tagline}</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">{col.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <a href={href} className="text-[0.85rem] text-cream/70 transition-colors hover:text-gold">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-6 sm:flex-row">
          <p className="text-[0.72rem] text-cream/60">© {new Date().getFullYear()} Ghoroa. All rights reserved.</p>
          <ul className="flex gap-5">
            <li>
              <a
                href={settings.social.instagram}
                className="text-[0.72rem] uppercase tracking-[0.14em] text-cream/70 transition-colors hover:text-gold"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={settings.social.facebook}
                className="text-[0.72rem] uppercase tracking-[0.14em] text-cream/70 transition-colors hover:text-gold"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
