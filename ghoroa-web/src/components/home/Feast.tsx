import { Eyebrow, GoldButton, Reveal } from '@/components/primitives';

export function Feast({ locale }: { locale: 'en' | 'bn' }) {
  const bullets =
    locale === 'bn'
      ? [
          'পুরো-কাট মটন, ঐতিহ্যবাহী খাঁটি খাঁটি খাঁটি',
          'সকালের সকালে মশলা',
          'টেবিল ঐতিহ্যের ঐতিহ্য',
        ]
      : [
          'Whole-cut mutton, aged chinigura rice',
          'Spices ground the morning of service',
          'Sealed dough lid — opened at the table',
        ];

  return (
    <section id="feast" className="relative overflow-hidden bg-forest py-24 lg:py-32" aria-labelledby="feast-title">
      <div className="relative mx-auto grid max-w-[82rem] items-center gap-14 px-5 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <Reveal className="order-2 lg:order-1">
          <Eyebrow>{locale === 'bn' ? 'উপহার' : 'The feast'}</Eyebrow>
          <h2 id="feast-title" className="display mt-5 text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.08] text-cream">
            {locale === 'bn' ? 'এক জায়গায়, ঠিক ঐতিহ্যের খাঁটি খাবার।' : 'Cooked for a crowd,\nthe way Dhaka does it.'}
          </h2>
          <p className="mt-6 max-w-md text-[0.95rem] leading-[1.8] text-cream/85">
            {locale === 'bn'
              ? 'ক্যাশি বিরিয়ানি ঐতিহ্যের ঐতিহ্য ঐতিহ্য ঐতিহ্য ঐতিহ্য'
              : 'Kacchi biryani is sealed in the pot and baked until the rice takes the meat\'s perfume. Nothing about it is quick, and that is exactly the point.'}
          </p>
          <ul className="mt-8 space-y-3">
            {bullets.map((line) => (
              <li key={line} className="flex items-start gap-3 text-[0.88rem] text-cream/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-9">
            <GoldButton href="#menu">{locale === 'bn' ? 'মেনু' : 'Browse the menu'}</GoldButton>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="order-1 lg:order-2">
          <div className="relative">
            <figure className="relative overflow-hidden border border-gold-deep/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-accent.jpg"
                alt={locale === 'bn' ? 'ক্যাশি বিরিয়ানি' : 'Kacchi biryani plated'}
                loading="lazy"
                className="aspect-4/5 w-full object-cover"
              />
            </figure>
            <figure className="absolute -bottom-8 -left-8 hidden w-40 overflow-hidden border-4 border-forest shadow-2xl shadow-dark/60 sm:block lg:-left-16 lg:w-52">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/curry.jpg"
                alt={locale === 'bn' ? 'বিফ ক্যারি' : 'Beef curry'}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
            </figure>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
