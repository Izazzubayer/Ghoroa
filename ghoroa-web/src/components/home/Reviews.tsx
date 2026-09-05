'use client';

import { CardSwipe, type ReviewCard } from '@/components/watermelon/card-swipe';
import { PatternEdge, PatternMotif } from '@/components/patterns';
import { Eyebrow, Ornament, Reveal } from '@/components/primitives';

const REVIEWS_EN: ReviewCard[] = [
  {
    id: 1,
    quote:
      'The kacchi tastes like Dhaka — sealed pot, slow rice, meat that falls apart. We drive across town for it.',
    name: 'Nusrat A.',
    meta: 'Regular guest · Google',
    rating: 5,
  },
  {
    id: 2,
    quote:
      'Warm room, careful service, and the bhuna is exactly as sharp as I remember from home. No shortcuts.',
    name: 'Rafi H.',
    meta: 'Family dinner · Google',
    rating: 5,
  },
  {
    id: 3,
    quote:
      'Brought visitors who had never tried Bangladeshi food. They ordered a second round of naan and asked for the recipe.',
    name: 'Maya S.',
    meta: 'First visit · Google',
    rating: 5,
  },
  {
    id: 4,
    quote:
      'Reservation was easy, table felt like a home kitchen, and the tea at the end was the quiet perfect close.',
    name: 'Imran K.',
    meta: 'Evening table · Google',
    rating: 5,
  },
];

const REVIEWS_BN: ReviewCard[] = [
  {
    id: 1,
    quote:
      'কাচ্চি ঢাকার মতো — সিল করা হাঁড়ি, ধীর চাল, গলানো মাংস। শহর পার হয়ে আসি শুধু এর জন্য।',
    name: 'নুসরাত এ.',
    meta: 'নিয়মিত অতিথি · Google',
    rating: 5,
  },
  {
    id: 2,
    quote:
      'উষ্ণ পরিবেশ, যত্নশীল সেবা, আর ভুনা বাড়ির মতোই তীব্র। কোনো শর্টকাট নেই।',
    name: 'রাফি হ.',
    meta: 'পারিবারিক ডিনার · Google',
    rating: 5,
  },
  {
    id: 3,
    quote:
      'বাংলাদেশি খাবার না-চেখা বন্ধুদের নিয়ে এসেছিলাম। তারা আরও নান চাইল এবং রেসিপি জিজ্ঞেস করল।',
    name: 'মায়া এস.',
    meta: 'প্রথম সফর · Google',
    rating: 5,
  },
  {
    id: 4,
    quote:
      'রিজার্ভেশন সহজ, টেবিল বাড়ির মতো, আর শেষের চা ছিল নিখুঁত সমাপ্তি।',
    name: 'ইমরান কে.',
    meta: 'সন্ধ্যার টেবিল · Google',
    rating: 5,
  },
];

export function Reviews({ locale }: { locale: 'en' | 'bn' }) {
  const items = locale === 'bn' ? REVIEWS_BN : REVIEWS_EN;

  return (
    <section
      id="reviews"
      data-nav-contrast="light"
      className="grain relative overflow-hidden bg-parchment py-24 text-ink lg:py-28"
      aria-labelledby="reviews-title"
    >
      <div className="absolute inset-x-0 top-0">
        <PatternEdge name="flower" surface="light" height={36} opacity={0.95} />
      </div>
      <PatternMotif
        name="rosette-3"
        size={64}
        blend="normal"
        className="pointer-events-none absolute bottom-10 left-4 opacity-[0.14] lg:left-10"
      />

      <div className="relative mx-auto grid max-w-[82rem] items-center gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-10">
        <Reveal>
          <Eyebrow tone="terracotta">{locale === 'bn' ? 'অতিথির কথা' : 'Guest words'}</Eyebrow>
          <h2
            id="reviews-title"
            className="display mt-5 text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.08]"
          >
            {locale === 'bn' ? 'যারা এসেছেন, তারা যা বলেন।' : 'What our tables say.'}
          </h2>
          <Ornament tone="terracotta" surface="light" className="mt-5" />
          <p className="mt-6 max-w-md text-[0.95rem] leading-[1.8] text-muted">
            {locale === 'bn'
              ? 'স্লাইড করে পড়ুন — অতিথিদের সাম্প্রতিক মন্তব্য।'
              : 'Swipe through recent notes from guests who sat with us.'}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <CardSwipe items={items} />
        </Reveal>
      </div>
    </section>
  );
}
