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
    title: 'Privacy Policy — Ghoroa',
    description: 'Privacy policy.',
  });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'en' && locale !== 'bn') return null;
  const { settings } = await loadHomeData(locale);
  return (
    <div>
      <Nav locale={locale} orderNow={settings.order_now} />
      <main className="pt-28 px-5 py-16 lg:px-10">
        <article className="mx-auto max-w-3xl">
          <h1 className="display text-4xl text-cream">{locale === 'bn' ? 'প্রাইভেসি পলিসি' : 'Privacy Policy'}</h1>
          <p className="mt-6 text-[0.95rem] leading-[1.8] text-cream/85">
            {locale === 'bn'
              ? 'Ghoroa CMS রিজার্ভেশন ফর্ম লিখলে আমরা লিখতে লিখতে লিখতে লিখতে লিখতে লিখতে লিখতে লিখতে লিখতে লিখতে'
              : 'We collect only the information you submit through the reservation form (name, contact, party size). We never sell customer data.'}
          </p>
        </article>
      </main>
      <SiteFooter locale={locale} settings={settings} />
    </div>
  );
}
