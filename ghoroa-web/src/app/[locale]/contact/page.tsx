import { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';
import { Nav, SiteFooter } from '@/components/layout';
import { ContactPageClient } from '@/components/home/ContactPageClient';
import { loadHomeData } from '@/components/home/page-data';
import type { Locale } from '@/lib/cms';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'bn' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata(locale as Locale, {
    title: 'Contact — Ghoroa',
    description:
      'Reservations and contact for Ghoroa — call, WhatsApp, or send an enquiry. We reply within 24 hours.',
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (raw !== 'en' && raw !== 'bn') return null;
  const locale = raw as Locale;
  const { settings, locations } = await loadHomeData(locale);

  return (
    <div>
      <Nav locale={locale} orderNow={settings.order_now} />
      <ContactPageClient locale={locale} settings={settings} locations={locations} />
      <SiteFooter locale={locale} settings={settings} />
    </div>
  );
}
