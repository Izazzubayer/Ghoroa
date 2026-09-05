import { Eyebrow, GoldButton, Ornament, Reveal } from '@/components/primitives';
import { formatPrice, type MenuItem } from '@/lib/cms';

type Course = {
  heading: string;
  bn: string;
  items: Array<{ name: string; bn: string; note: string; price: string; id?: number }>;
};

const DEFAULT_COURSES: Course[] = [
  {
    heading: 'From the rice pot',
    bn: 'spo  &  বিরিয়ানি',
    items: [
      { name: 'Kacchi Biryani', bn: 'কাচ্চি বিরিয়ানি', note: 'Mutton and aged rice, sealed and slow-baked', price: '300' },
    ],
  },
];

function coursesFromMenu(
  menu: { groups: Record<string, MenuItem[]>; categories?: Record<string, { en: string; bn: string }> },
  locale: 'en' | 'bn'
): Course[] {
  const groups = menu.groups;
  const categories = menu.categories || {};
  const result: Course[] = [];

  // Prefer a simple grouping: each meal period becomes a course with items.
  Object.entries(groups).forEach(([slug, items]) => {
    const name = categories[slug] || { en: slug, bn: slug };
    const heading = locale === 'bn' ? name.bn : name.en;
    result.push({
      heading,
      bn: heading,
      items: (items as MenuItem[]).map((it) => ({
        id: it.id,
        name: it.name,
        bn: it.name_bn || it.name_en,
        note: locale === 'bn' ? it.desc_bn || it.desc_en : it.desc_en || it.desc_bn,
        price: String(formatPrice(it.price_eatin) ?? '—').replace('৳', ''),
      })),
    });
  });

  return result.length ? result : DEFAULT_COURSES;
}

export function Signatures({
  locale,
  menu,
}: {
  locale: 'en' | 'bn';
  menu: { groups: Record<string, MenuItem[]>; categories?: Record<string, { en: string; bn: string }> };
}) {
  const courses = coursesFromMenu(menu, locale);

  return (
    <section id="menu" className="relative bg-dark py-24 lg:py-32" aria-labelledby="sig-title">
      <div className="mx-auto max-w-[82rem] px-5 lg:px-10">
        <Reveal className="flex flex-col items-center text-center">
          <Eyebrow>{locale === 'bn' ? 'আমাদের সিগনেচার' : 'Our signatures'}</Eyebrow>
          <h2 id="sig-title" className="display mt-5 text-[clamp(1.9rem,3.6vw,3rem)] font-normal text-cream">
            {locale === 'bn' ? 'ঐতিহ্য, যত্নে পরিবেশিত।' : 'Tradition, thoughtfully served.'}
          </h2>
          <Ornament className="mt-5" />
          <p className="mt-6 max-w-md text-[0.9rem] leading-[1.75] text-cream/85">
            {locale === 'bn'
              ? 'আমরা লেখা খাঁটি খাবার।  দাম খাঁটি ৳  টেবিলে।'
              : 'A short list of the dishes we are known for. Prices shown are eat-in, in taka.'}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-x-14 gap-y-14 lg:grid-cols-3">
          {courses.map((course, ci) => (
            <Reveal key={course.heading} delay={ci * 0.1}>
              <section aria-labelledby={`course-${ci}`}>
                <header className="flex items-baseline justify-between gap-3 border-b border-gold-deep/35 pb-3">
                  <h3 id={`course-${ci}`} className="display text-[1.35rem] text-gold">
                    {course.heading}
                  </h3>
                  <span lang="bn" className="font-bn text-cream/90">
                    {course.bn}
                  </span>
                </header>

                <ul className="mt-6 space-y-6">
                  {course.items.map((item) => (
                    <li key={item.name}>
                      <div className="flex items-baseline gap-3">
                        <h4 className="display text-[1.05rem] leading-snug text-cream">{item.name}</h4>
                        <span aria-hidden className="h-px flex-1 translate-y-[-2px] bg-cream/15" />
                        <span className="text-[0.85rem] tabular-nums text-gold-deep">{item.price}</span>
                      </div>
                      <p lang="bn" className="font-bn mt-1 text-gold">
                        {item.bn}
                      </p>
                      <p className="mt-1.5 max-w-[26ch] text-[0.78rem] leading-[1.65] text-cream/85">{item.note}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-16 flex justify-center">
          <GoldButton href={`${locale === 'bn' ? '/bn' : '/en'}/contact`}>
            {locale === 'bn' ? 'রিজার্ভেশন' : 'See the full menu'}
          </GoldButton>
        </Reveal>
      </div>
    </section>
  );
}
