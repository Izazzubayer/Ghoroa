'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { Nav, SiteFooter, FaqSection } from '@/components/layout';
import { Hero } from '@/components/home/Hero';
import { Story } from '@/components/home/Story';
import { Feast } from '@/components/home/Feast';
import { Signatures } from '@/components/home/Signatures';
import { Reserve } from '@/components/home/Reserve';
import type { FaqItem, MenuPayload, Settings, LocationItem } from '@/lib/cms';

export function HomePageClient({
  locale,
  menu,
  settings,
  faqs,
  locations,
}: {
  locale: 'en' | 'bn';
  menu: MenuPayload;
  settings: Settings;
  faqs: FaqItem[];
  locations: LocationItem[];
}) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      const id = link?.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -72 });
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <a href="#home" className="skip-link">
        Skip to content
      </a>
      <Nav locale={locale} />
      <main>
        <Hero locale={locale} settings={settings} menu={menu} />
        <Story locale={locale} settings={settings} />
        <Feast locale={locale} />
        <Signatures locale={locale} menu={menu} />
        <FaqSection locale={locale} items={faqs} />
        <Reserve locale={locale} settings={settings} />
      </main>
      <SiteFooter locale={locale} settings={settings} />
    </>
  );
}
