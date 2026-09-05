import { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';
import { SiteFooter } from '@/components/layout';
import { Nav } from '@/components/layout';
import { loadHomeData } from '@/components/home/page-data';
import type { Locale } from '@/lib/cms';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'bn' }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata(locale as Locale, {
    title: 'Contact — Ghoroa',
    description: 'Reservations and contact.',
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'en' && locale !== 'bn') return null;
  const { settings } = await loadHomeData(locale);
  return (
    <div>
      <Nav locale={locale} />
      <main className="pt-28 px-5 py-16 lg:px-10">
        <article className="mx-auto max-w-3xl">
          <h1 className="display text-4xl text-cream">
            {locale === 'bn' ? 'যোগাযোগ' : 'Contact'}
          </h1>
          <p className="mt-4 text-cream/85">
            {locale === 'bn' ? 'রিজার্ভেশন ফর্ম — ২৪ ঘণ্টা লিখুন।' : 'Reservation enquiry form. We reply within 24 hours.'}
          </p>
          <ContactForm locale={locale} settings={settings} />
        </article>
      </main>
      <SiteFooter locale={locale} settings={settings} />
    </div>
  );
}

import { ContactForm } from '@/components/home/ContactForm';
