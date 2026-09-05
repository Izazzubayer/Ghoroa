'use client';

import { useMemo, useState, type ComponentType } from 'react';
import {
  BookOpen,
  CupSoda,
  Drumstick,
  Fish,
  Flame,
  GlassWater,
  IceCream2,
  Salad,
  Soup,
  UtensilsCrossed,
  Wheat,
} from 'lucide-react';
import { DiscreteTabs } from '@/components/watermelon/discrete-tabs';
import { MenuPhotosToggle } from '@/components/watermelon/menu-photos-toggle';
import { DisplayText } from '@/components/primitives';
import { menuDishImage } from '@/lib/menu-images';
import {
  formatPrice,
  pickDesc,
  pickLocaleLabel,
  type Locale,
  type MenuItem,
  type MenuPayload,
} from '@/lib/cms';

const CATEGORY_ICONS: Record<
  string,
  ComponentType<{ className?: string; strokeWidth?: number; 'aria-hidden'?: boolean }>
> = {
  rice: UtensilsCrossed,
  bread: Wheat,
  curry: Flame,
  'kebab-grill': Drumstick,
  'bhorta-bhaji': Salad,
  dal: Soup,
  dessert: IceCream2,
  beverage: GlassWater,
  fish: Fish,
  juice: CupSoda,
};

const ALL = 'all';

function iconFor(slug: string) {
  return CATEGORY_ICONS[slug] || BookOpen;
}

function MenuSection({
  slug,
  locale,
  menu,
  showImages,
}: {
  slug: string;
  locale: Locale;
  menu: MenuPayload;
  showImages: boolean;
}) {
  const items = (menu.groups[slug] || []) as MenuItem[];
  const cat = menu.categories[slug] || { en: slug, bn: slug };
  const heading = locale === 'bn' ? cat.bn || cat.en : cat.en;
  const alt = locale === 'bn' ? cat.en : cat.bn;
  const HeadingIcon = iconFor(slug);

  return (
    <section id={slug} aria-labelledby={`menu-${slug}`}>
      <header className="mb-6 flex items-baseline justify-between gap-4 border-b border-gold-deep/35 pb-3">
        <h2
          id={`menu-${slug}`}
          className="flex items-center gap-3 text-2xl text-gold md:text-3xl"
        >
          <HeadingIcon
            aria-hidden
            className="h-6 w-6 shrink-0 text-gold md:h-7 md:w-7"
            strokeWidth={1.5}
          />
          <DisplayText text={heading} />
        </h2>
        {alt ? (
          <span
            lang={locale === 'bn' ? 'en' : 'bn'}
            className="font-bn text-[0.85rem] text-cream/70"
          >
            {alt}
          </span>
        ) : null}
      </header>

      <ul
        className={
          showImages
            ? 'grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid gap-x-12 gap-y-5 sm:grid-cols-2'
        }
      >
        {items.map((it, i) => {
          const name = pickLocaleLabel(it, locale);
          const secondary = locale === 'bn' ? it.name_en : it.name_bn;
          const note = pickDesc(it, locale);
          const price = formatPrice(it.price_eatin ?? it.price_takeaway);
          const src = menuDishImage(slug, i, it.image);

          return (
            <li key={`${slug}-${it.id}`}>
              {showImages ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="mb-4 aspect-4/3 w-full object-cover"
                />
              ) : null}
              <div className="flex items-baseline gap-3">
                <h3 className="font-body text-[1.05rem] font-medium leading-snug text-cream">{name}</h3>
                <span aria-hidden className="h-px flex-1 translate-y-[-2px] bg-cream/15" />
                <span className="shrink-0 text-[0.9rem] tabular-nums text-gold-deep">{price}</span>
              </div>
              {secondary ? (
                <p
                  lang={locale === 'bn' ? 'en' : 'bn'}
                  className="font-bn mt-1 text-[0.85rem] text-gold"
                >
                  {secondary}
                </p>
              ) : null}
              {note ? (
                <p className="mt-1 max-w-[36ch] text-[0.8rem] leading-[1.6] text-cream/70">{note}</p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function MenuCatalog({
  locale,
  menu,
  slugs,
}: {
  locale: Locale;
  menu: MenuPayload;
  slugs: string[];
}) {
  const [active, setActive] = useState(ALL);
  const [showImages, setShowImages] = useState(false);

  const tabs = useMemo(
    () => [
      {
        id: ALL,
        label: locale === 'bn' ? 'সব দেখুন' : 'View all',
        icon: <BookOpen aria-hidden strokeWidth={1.6} />,
      },
      ...slugs.map((slug) => {
        const cat = menu.categories[slug] || { en: slug, bn: slug };
        const label = locale === 'bn' ? cat.bn || cat.en : cat.en;
        const Icon = iconFor(slug);
        return {
          id: slug,
          label,
          icon: <Icon aria-hidden strokeWidth={1.6} />,
        };
      }),
    ],
    [locale, menu.categories, slugs],
  );

  const activeSlug =
    active === ALL || slugs.includes(active) ? active : ALL;
  const visibleSlugs = activeSlug === ALL ? slugs : [activeSlug];

  return (
    <>
      <div className="sticky top-[72px] z-40 -mx-5 mt-10 border-b border-gold-deep/20 bg-dark px-5 py-4 lg:-mx-10 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <DiscreteTabs
            tabs={tabs}
            value={activeSlug}
            defaultTab={ALL}
            onTabChange={setActive}
            dividerAfter={ALL}
            ariaLabel={locale === 'bn' ? 'মেনু বিভাগ' : 'Menu sections'}
            className="min-w-0 flex-1 gap-x-2 gap-y-3"
          />

          <MenuPhotosToggle
            checked={showImages}
            onCheckedChange={setShowImages}
            listLabel={locale === 'bn' ? 'তালিকা' : 'List'}
            photosLabel={locale === 'bn' ? 'ছবি' : 'Photos'}
            ariaLabel={locale === 'bn' ? 'মেনু দেখার ধরন' : 'Menu view'}
          />
        </div>
      </div>

      <div className="mt-10 space-y-16">
        {visibleSlugs.map((slug) => (
          <MenuSection
            key={slug}
            slug={slug}
            locale={locale}
            menu={menu}
            showImages={showImages}
          />
        ))}
      </div>
    </>
  );
}
