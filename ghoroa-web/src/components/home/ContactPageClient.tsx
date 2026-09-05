'use client';

import Link from 'next/link';
import {
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  Mail,
  UtensilsCrossed,
} from 'lucide-react';
import {
  Eyebrow,
  GoldButton,
  Ornament,
  Reveal,
} from '@/components/primitives';
import { Contact1 } from '@/components/watermelon/contact-1';
import { Contact4 } from '@/components/watermelon/contact-4';
import { ViewOnMap } from '@/components/watermelon/view-on-map';
import { contactCopy } from '@/lib/contact-copy';
import { localePrefix, type Locale, type LocationItem, type Settings } from '@/lib/cms';

function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, '')}`;
}

function waHref(settings: Settings) {
  if (settings.order_now?.includes('wa.me')) return settings.order_now;
  const digits = (settings.whatsapp || settings.phone).replace(/\D/g, '');
  return `https://wa.me/${digits}`;
}

export function ContactPageClient({
  locale,
  settings,
  locations,
}: {
  locale: Locale;
  settings: Settings;
  locations: LocationItem[];
}) {
  const copy = contactCopy(locale);
  const prefix = localePrefix(locale);

  const methods = [
    {
      id: 'call',
      icon: <Phone className="h-5 w-5" strokeWidth={1.5} aria-hidden />,
      title: copy.call,
      description:
        locale === 'bn'
          ? 'রিজার্ভেশন ও প্রশ্নের জন্য সরাসরি ফোন করুন।'
          : 'Call for reservations and same-day questions.',
      actionLabel: settings.phone,
      actionUrl: telHref(settings.phone),
    },
    {
      id: 'whatsapp',
      icon: <MessageCircle className="h-5 w-5" strokeWidth={1.5} aria-hidden />,
      title: copy.whatsapp,
      description:
        locale === 'bn'
          ? 'দ্রুত বার্তা — অর্ডার বা টেবিলের জন্য।'
          : 'Message us for orders or a quick table note.',
      actionLabel: copy.whatsapp,
      actionUrl: waHref(settings),
      external: true,
    },
    {
      id: 'email',
      icon: <Mail className="h-5 w-5" strokeWidth={1.5} aria-hidden />,
      title: copy.email,
      description:
        locale === 'bn'
          ? 'অনুষ্ঠান ও বিস্তারিত অনুসন্ধানের জন্য লিখুন।'
          : 'Write for celebrations and detailed enquiries.',
      actionLabel: settings.email,
      actionUrl: `mailto:${settings.email}`,
    },
    {
      id: 'order',
      icon: <UtensilsCrossed className="h-5 w-5" strokeWidth={1.5} aria-hidden />,
      title: copy.order,
      description:
        locale === 'bn'
          ? 'Phase 1 — WhatsApp-এ অর্ডার করুন।'
          : 'Phase 1 — order via WhatsApp for now.',
      actionLabel: copy.order,
      actionUrl: settings.order_now,
      external: true,
    },
  ];

  const occasions =
    locale === 'bn'
      ? [
          { value: 'dinner', label: 'ডিনার' },
          { value: 'family', label: 'পারিবারিক আয়োজন' },
          { value: 'celebration', label: 'উৎসব / উদযাপন' },
          { value: 'business', label: 'ব্যবসায়িক মিটিং' },
          { value: 'other', label: 'অন্যান্য' },
        ]
      : [
          { value: 'dinner', label: 'Dinner' },
          { value: 'family', label: 'Family gathering' },
          { value: 'celebration', label: 'Celebration' },
          { value: 'business', label: 'Business meal' },
          { value: 'other', label: 'Something else' },
        ];

  return (
    <main>
      <section className="relative min-h-[62vh] overflow-hidden bg-dark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/dining.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-b from-dark/75 via-dark/60 to-dark" />
        <div className="relative mx-auto flex min-h-[62vh] max-w-[82rem] flex-col justify-end px-5 pb-16 pt-32 lg:px-10 lg:pb-20">
          <Reveal>
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <h1 className="display mt-5 max-w-3xl text-[clamp(2.6rem,6vw,4.8rem)] font-normal leading-[1.05] text-cream">
              {copy.title}
            </h1>
            <Ornament className="mt-6" />
            <p className="mt-6 max-w-xl text-[1.05rem] leading-[1.8] text-cream/90">{copy.lead}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <GoldButton href={telHref(settings.phone)}>{copy.call}</GoldButton>
              <a
                href="#reservations"
                className="inline-flex items-center gap-2 border border-cream/30 px-6 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-cream/90 transition-colors hover:border-cream hover:text-cream"
              >
                {copy.formEyebrow}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <Contact1
        eyebrow={copy.channelsEyebrow}
        title={copy.channelsTitle}
        description={copy.lead}
        contactMethods={methods}
      />

      <Contact4
        locale={locale}
        eyebrow={copy.formEyebrow}
        headline={locale === 'bn' ? 'একটি আসন' : 'Hold a'}
        headlineAccent={locale === 'bn' ? 'রাখুন।' : 'seat.'}
        subheadline={copy.formLead}
        email={settings.email}
        phone={settings.phone}
        ctaLabel={locale === 'bn' ? 'অনুসন্ধান পাঠান' : 'Send enquiry'}
        occasionOptions={occasions}
        mapAddress={
          settings.address?.toLowerCase().includes('mohakhali')
            ? settings.address
            : 'Ghoroa Hotel and Restaurant, 73 Mohakhali Wireless Gate, Dhaka 1206'
        }
        mapLabel={locale === 'bn' ? 'মহাখালী শাখা — গুগল ম্যাপ' : 'Mohakhali on Google Maps'}
      />

      <section className="border-t border-gold-deep/20 bg-dark py-20 lg:py-24" aria-labelledby="visit-map-title">
        <div className="mx-auto grid max-w-[82rem] items-center gap-12 px-5 lg:grid-cols-2 lg:px-10">
          <Reveal>
            <Eyebrow>{copy.visitEyebrow}</Eyebrow>
            <h2
              id="visit-map-title"
              className="display mt-4 text-[clamp(1.8rem,3.2vw,2.6rem)] text-cream"
            >
              {copy.visitTitle}
            </h2>
            <dl className="mt-8 space-y-6">
              <div className="flex gap-4">
                <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden />
                <div>
                  <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">
                    {copy.hours}
                  </dt>
                  <dd className="mt-2 text-[0.95rem] text-cream/90">{settings.hours}</dd>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden />
                <div>
                  <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">
                    {copy.address}
                  </dt>
                  <dd className="mt-2 text-[0.95rem] text-cream/90">
                    {settings.address?.toLowerCase().includes('mohakhali')
                      ? settings.address
                      : '73, Mohakhali Wireless Gate, Dhaka 1206'}
                  </dd>
                </div>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.08}>
            <ViewOnMap
              address="Ghoroa Hotel and Restaurant, 73 Mohakhali Wireless Gate, Dhaka 1206"
              mapImageUrl="/images/cta-dining.jpg"
              label={locale === 'bn' ? 'ম্যাপে দেখুন' : 'View on Map'}
            />
          </Reveal>
        </div>
      </section>

      <section
        data-nav-contrast="light"
        className="grain relative border-y border-ink/10 bg-parchment py-20 text-ink lg:py-24"
        aria-labelledby="locations-title"
      >
        <div className="mx-auto max-w-[82rem] px-5 lg:px-10">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow tone="terracotta">{copy.locationsEyebrow}</Eyebrow>
              <h2
                id="locations-title"
                className="display mt-4 text-[clamp(1.8rem,3.2vw,2.6rem)] text-forest"
              >
                {copy.locationsTitle}
              </h2>
            </div>
            <Link
              href={`${prefix}/locations`}
              className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-terracotta transition-colors hover:text-forest"
            >
              {copy.locationsCta} →
            </Link>
          </Reveal>

          {locations.length > 0 ? (
            <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {locations.map((loc, i) => (
                <Reveal key={loc.id} delay={i * 0.06}>
                  <li>
                    <h3 className="display text-[1.35rem] text-forest">{loc.name}</h3>
                    <p className="mt-3 text-[0.9rem] leading-[1.7] text-muted">{loc.address}</p>
                    {loc.phone ? (
                      <a
                        href={telHref(loc.phone)}
                        className="mt-3 inline-block text-[0.85rem] text-terracotta hover:underline"
                      >
                        {loc.phone}
                      </a>
                    ) : null}
                  </li>
                </Reveal>
              ))}
            </ul>
          ) : (
            <p className="mt-8 max-w-xl text-[0.95rem] leading-[1.75] text-muted">
              {copy.locationsEmpty}
            </p>
          )}
        </div>
      </section>

      <section className="bg-dark py-16 lg:py-20" aria-label={copy.faqCta}>
        <div className="mx-auto flex max-w-[82rem] flex-col items-start gap-6 px-5 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p className="max-w-md text-[1.05rem] leading-[1.7] text-cream/90">{copy.faqLead}</p>
          <GoldButton href={`${prefix}/faq`}>{copy.faqCta}</GoldButton>
        </div>
      </section>
    </main>
  );
}
