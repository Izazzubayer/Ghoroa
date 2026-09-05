'use client';

import { Nav, SiteFooter } from '@/components/layout';
import { Hero } from '@/components/home/Hero';
import { Story } from '@/components/home/Story';
import { Feast } from '@/components/home/Feast';
import { Reviews } from '@/components/home/Reviews';
import { Signatures } from '@/components/home/Signatures';
import { FaqSection } from '@/components/home/Faq';
import { Reserve } from '@/components/home/Reserve';
import type { FaqItem, MenuPayload, Settings, LocationItem } from '@/lib/cms';

export function HomePageClient({
  locale,
  menu,
  settings,
  faqs,
  locations: _locations,
}: {
  locale: 'en' | 'bn';
  menu: MenuPayload;
  settings: Settings;
  faqs: FaqItem[];
  locations: LocationItem[];
}) {
  return (
    <>
      <a href="#home" className="skip-link">
        Skip to content
      </a>
      <Nav locale={locale} orderNow={settings.order_now} />
      <main>
        <Hero locale={locale} settings={settings} menu={menu} />
        <Story locale={locale} settings={settings} />
        <Feast locale={locale} />
        <Signatures locale={locale} menu={menu} />
        <Reviews locale={locale} />
        <FaqSection locale={locale} items={faqs} />
        <Reserve locale={locale} settings={settings} />
      </main>
      <SiteFooter locale={locale} settings={settings} />
    </>
  );
}
