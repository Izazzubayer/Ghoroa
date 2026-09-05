'use client';

import { BookOpen, ChefHat, Home, MapPin } from 'lucide-react';
import { PatternEdge, PatternMotif, PatternWash } from '@/components/patterns';
import {
  ArchFrame,
  Eyebrow,
  GoldButton,
  Ornament,
  Reveal,
} from '@/components/primitives';
import { StoryPosterTour, type StoryPoster } from '@/components/watermelon/feature-tour';
import { aboutCopy } from '@/lib/about-copy';
import type { Locale } from '@/lib/cms';

export function AboutPageClient({
  locale,
  orderNow,
}: {
  locale: Locale;
  orderNow: string;
}) {
  const copy = aboutCopy(locale);
  const prefix = locale === 'bn' ? '/bn' : '/en';

  const posters: StoryPoster[] = [
    {
      id: 'origin',
      year: '1979',
      title: copy.sections[0].heading,
      body: copy.sections[0].body,
      image: '/images/kitchen.jpg',
      imageAlt: locale === 'bn' ? 'ঘরোয়া রান্নাঘর' : 'Ghoroa kitchen',
      icon: <Home className="h-5 w-5" strokeWidth={1.5} aria-hidden />,
    },
    {
      id: 'khichuri',
      year: locale === 'bn' ? '৮০’র দশক' : '1980s',
      title: copy.sections[1].heading,
      body: copy.sections[1].body,
      image: '/images/khichuri.jpg',
      imageAlt: locale === 'bn' ? 'ভুনা খিচুড়ি' : 'Bhuna khichuri',
      icon: <ChefHat className="h-5 w-5" strokeWidth={1.5} aria-hidden />,
    },
    {
      id: 'return',
      year: '2020',
      title: copy.sections[2].heading,
      body: copy.sections[2].body,
      image: '/images/biryani.jpg',
      imageAlt: locale === 'bn' ? 'বিরিয়ানি' : 'Biryani',
      icon: <MapPin className="h-5 w-5" strokeWidth={1.5} aria-hidden />,
    },
  ];

  const milestones =
    locale === 'bn'
      ? [
          { year: '১৯৭৯', label: 'মতিঝিলে প্রতিষ্ঠা' },
          { year: '৮০’র', label: 'খিচুড়ির খ্যাতি' },
          { year: '২০১৫', label: 'বন্ধের সময়' },
          { year: '২০২০', label: 'ফিরে আসা' },
        ]
      : [
          { year: '1979', label: 'Motijheel opens' },
          { year: '1980s', label: 'Khichuri fame' },
          { year: '2015', label: 'Doors pause' },
          { year: '2020', label: 'Return home' },
        ];

  return (
    <main>
      {/* Full-bleed poster hero */}
      <section className="relative min-h-[70vh] overflow-hidden bg-dark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-accent.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-linear-to-b from-dark/70 via-dark/55 to-dark" />
        <PatternMotif
          name="lotus"
          size={72}
          className="pointer-events-none absolute right-[10%] top-[28%] hidden opacity-45 lg:block"
        />
        <div className="relative mx-auto flex min-h-[70vh] max-w-[82rem] flex-col justify-end px-5 pb-16 pt-32 lg:px-10 lg:pb-24">
          <Reveal>
            <Eyebrow tone="gold">{locale === 'bn' ? 'ঐতিহ্য' : 'Heritage'}</Eyebrow>
            <h1 className="display mt-5 max-w-3xl text-[clamp(2.6rem,6vw,4.8rem)] font-normal leading-[1.05] text-cream">
              {copy.title}
            </h1>
            <Ornament tone="gold" className="mt-6" />
            <p className="mt-6 max-w-xl text-[1.05rem] leading-[1.8] text-cream/90">{copy.lead}</p>
          </Reveal>
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <PatternEdge name="scallop" height={36} opacity={0.7} />
        </div>
      </section>

      {/* Milestone poster strip */}
      <section
        data-nav-contrast="light"
        className="grain relative overflow-hidden border-y border-ink/10 bg-parchment py-12 text-ink lg:py-14"
        aria-label={locale === 'bn' ? 'সময়রেখা' : 'Timeline'}
      >
        <div className="absolute inset-x-0 top-0">
          <PatternEdge name="diamond" surface="light" height={22} opacity={0.9} />
        </div>
        <div className="relative mx-auto grid max-w-[82rem] grid-cols-2 gap-8 px-5 pt-4 sm:grid-cols-4 lg:px-10">
          {milestones.map((m, i) => (
            <Reveal key={m.year} delay={i * 0.06}>
              <p className="font-numeral text-3xl text-forest md:text-4xl">{m.year}</p>
              <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-terracotta">
                {m.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Watermelon feature-tour adapted as story posters */}
      <section className="relative overflow-hidden bg-dark py-20 lg:py-28" aria-labelledby="chapters-title">
        <PatternWash opacity={0.06} size={280} />
        <div className="relative mx-auto max-w-[82rem] px-5 lg:px-10">
          <Reveal className="mb-12 max-w-2xl">
            <Eyebrow tone="gold">{locale === 'bn' ? 'অধ্যায়' : 'Chapters'}</Eyebrow>
            <h2 id="chapters-title" className="display mt-5 text-[clamp(1.9rem,3.5vw,2.8rem)] text-cream">
              {locale === 'bn' ? 'যে পথে ঘরোয়া এসেছে।' : 'The road from Motijheel.'}
            </h2>
            <Ornament tone="gold" className="mt-5" />
          </Reveal>
          <Reveal delay={0.08}>
            <StoryPosterTour steps={posters} />
          </Reveal>
        </div>
      </section>

      {/* Arch poster + pull quote */}
      <section
        data-nav-contrast="light"
        className="grain relative overflow-hidden bg-parchment py-24 text-ink lg:py-32"
      >
        <div className="absolute inset-x-0 top-0">
          <PatternEdge name="vine" surface="light" height={28} opacity={0.95} />
        </div>
        <div className="relative mx-auto grid max-w-[82rem] items-center gap-14 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-10">
          <Reveal>
            <ArchFrame
              src="/images/kitchen.jpg"
              alt={locale === 'bn' ? 'ঘরোয়ার রান্নাঘর' : 'Inside the Ghoroa kitchen'}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Eyebrow tone="terracotta">{locale === 'bn' ? 'প্রতিজ্ঞা' : 'The promise'}</Eyebrow>
            <blockquote className="display mt-6 text-[clamp(1.8rem,3.4vw,2.8rem)] leading-[1.15] text-forest">
              {locale === 'bn' ? (
                <>ঘরের মতো রান্না। শর্টকাট নেই।</>
              ) : (
                <>
                  Home cooking.
                  <br />
                  No shortcuts.
                </>
              )}
            </blockquote>
            <Ornament tone="terracotta" surface="light" className="mt-6" />
            <p className="mt-6 max-w-md text-[0.95rem] leading-[1.8] text-muted">
              {locale === 'bn'
                ? 'মতিঝিল থেকে শুরু — ভুনা খিচুড়ি, কাচ্চি, কাবাব। আজও একই ধরনের টেবিল।'
                : 'From Motijheel outward — bhuna khichuri, kacchi, kebab. The same kind of table, still.'}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <GoldButton href={`${prefix}/locations`} variant="primary">
                {locale === 'bn' ? 'লোকেশন' : 'Find a table'}
              </GoldButton>
              <GoldButton href={`${prefix}/menu`} variant="secondary">
                {locale === 'bn' ? 'মেনু' : 'See the menu'}
              </GoldButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Closing CTA band */}
      <section className="relative overflow-hidden bg-forest py-20 lg:py-24">
        <PatternWash opacity={0.08} size={280} />
        <div className="relative mx-auto flex max-w-[82rem] flex-col items-start gap-8 px-5 lg:flex-row lg:items-end lg:justify-between lg:px-10">
          <Reveal>
            <p className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">
              <BookOpen className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              {locale === 'bn' ? 'আজকের টেবিল' : 'Tonight’s table'}
            </p>
            <h2 className="display mt-4 max-w-xl text-[clamp(1.8rem,3.2vw,2.6rem)] text-cream">
              {locale === 'bn' ? 'মতিঝিলের ঘর এখনো খোলা।' : 'The Motijheel house is still open.'}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <GoldButton href={orderNow || `${prefix}/contact`} variant="primary">
              {locale === 'bn' ? 'অর্ডার / রিজার্ভ' : 'Order / Reserve'}
            </GoldButton>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
