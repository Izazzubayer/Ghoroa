'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Circle } from 'lucide-react';
import { IconBrandInstagram, IconBrandFacebook } from '@tabler/icons-react';
import { localePrefix, swapLocalePath, type Locale } from '@/lib/cms';
import { SplitAccordion, type AccordionItemData } from '@/components/watermelon/card-split-accordian';
import { LocaleBillingToggle } from '@/components/watermelon/locale-billing-toggle';
import { Reveal } from '@/components/primitives';
import { buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export type NavLink = { href: string; label: string; external?: boolean };

const DEFAULT_ORDER_NOW = 'https://wa.me/8801711223344';

function LocaleToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <LocaleBillingToggle
      value={locale}
      ariaLabel={locale === 'bn' ? 'ভাষা' : 'Language'}
      onChange={(next) => {
        if (next !== locale) router.push(swapLocalePath(pathname, next));
      }}
    />
  );
}

function NavAnchor({
  link,
  className,
  onClick,
}: {
  link: NavLink;
  className: string;
  onClick?: () => void;
}) {
  if (link.external) {
    return (
      <a href={link.href} className={className} onClick={onClick} target="_blank" rel="noopener noreferrer">
        {link.label}
      </a>
    );
  }
  return (
    <Link href={link.href} className={className} onClick={onClick}>
      {link.label}
    </Link>
  );
}

export function Nav({
  locale,
  solid: solidProp,
  links,
  orderNow = DEFAULT_ORDER_NOW,
}: {
  locale: Locale;
  solid?: boolean;
  links?: NavLink[];
  orderNow?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [overLight, setOverLight] = useState(false);
  const prefix = localePrefix(locale);
  const isHome = pathname === prefix || pathname === `${prefix}/`;
  const defaultLinks: NavLink[] = [
    { href: prefix, label: locale === 'bn' ? 'হোম' : 'Home' },
    { href: `${prefix}/menu`, label: locale === 'bn' ? 'মেনু' : 'Menu' },
    { href: orderNow, label: locale === 'bn' ? 'অনলাইন অর্ডার' : 'Order Online', external: true },
    { href: `${prefix}/about`, label: locale === 'bn' ? 'আমাদের গল্প' : 'Our Story' },
  ];
  const LINKS = links ?? defaultLinks;

  // Solid bar on inner pages, after scroll, or over light bands (parchment).
  const onDark = !isHome || scrolled || overLight || !!solidProp;
  const solid = open || onDark;

  const navLinkClass =
    'relative py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 text-cream hover:text-gold';

  const menuBtnClass = onDark
    ? 'flex h-10 w-10 items-center justify-center border border-gold-deep/70 text-gold lg:hidden'
    : 'flex h-10 w-10 items-center justify-center border border-gold text-gold lg:hidden';

  useEffect(() => {
    const NAV_H = 72;

    const update = (scrollY = window.scrollY) => {
      setScrolled(scrollY > 48);
      let light = false;
      document.querySelectorAll('[data-nav-contrast="light"]').forEach((section) => {
        const { top, bottom } = section.getBoundingClientRect();
        if (top <= NAV_H && bottom > 0) light = true;
      });
      setOverLight(light);
    };

    update();
    const onNativeScroll = () => update();
    const onLenisScroll = (e: Event) => update((e as CustomEvent<{ scroll: number }>).detail.scroll);
    window.addEventListener('scroll', onNativeScroll, { passive: true });
    window.addEventListener('ghoroa:scroll', onLenisScroll);
    window.addEventListener('resize', onNativeScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onNativeScroll);
      window.removeEventListener('ghoroa:scroll', onLenisScroll);
      window.removeEventListener('resize', onNativeScroll);
    };
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid ? 'bg-dark/95 shadow-[0_1px_0_rgba(236,177,116,0.18)] backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[82rem] items-center justify-between gap-6 px-5 py-4 lg:px-10">
        <Link href={prefix} aria-label="Ghoroa — home" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/ghoroa-logo-with-wordmark-on-dark.svg" alt="Ghoroa" className="h-12 w-auto" width="180" height="48" />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {LINKS.map((l) => (
              <li key={l.href + l.label}>
                <NavAnchor link={l} className={navLinkClass} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LocaleToggle locale={locale} />
          <Link href="tel:+8801711223344" className={cn(buttonVariants({ variant: 'primary', size: 'cta' }), 'hidden sm:inline-flex')}>
            {locale === 'bn' ? 'বুক করুন' : 'Book a table'}
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={menuBtnClass}
              render={<button type="button" aria-label={locale === 'bn' ? 'মেনু খুলুন' : 'Open menu'} />}
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-full flex-col border-gold-deep/20 bg-dark/98 sm:max-w-xs"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>{locale === 'bn' ? 'নেভিগেশন' : 'Navigation'}</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="mt-2">
                <ul className="flex flex-col gap-1">
                  {LINKS.map((l) => (
                    <li key={l.href + l.label}>
                      <NavAnchor
                        link={l}
                        onClick={() => setOpen(false)}
                        className="display block border-b border-cream/10 py-3 text-xl text-cream hover:text-gold"
                      />
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-auto flex flex-wrap items-center gap-4 pt-8">
                <LocaleToggle locale={locale} />
                <Link
                  href="tel:+8801711223344"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: 'primary', size: 'cta' }))}
                >
                  {locale === 'bn' ? 'বুক করুন' : 'Book a table'}
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function FaqSection({
  locale,
  items,
}: {
  locale: Locale;
  items: Array<{ id: number; question: string; answer: string }>;
}) {
  const accordion: AccordionItemData[] = items.map((item, i) => ({
    id: i + 1,
    title: item.question,
    content: item.answer,
  }));

  return (
    <section id="faq" className="relative bg-dark pb-24 lg:pb-32" aria-labelledby="faq-title">
      <div className="mx-auto max-w-3xl px-5 lg:px-10">
        <Reveal className="flex flex-col items-center text-center">
          <p className="flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold-deep">
            <Circle className="h-1.5 w-1.5" strokeWidth={2.5} />
            {locale === 'bn' ? 'জানুন' : 'Good to know'}
            <Circle className="h-1.5 w-1.5" strokeWidth={2.5} />
          </p>
          <h2 id="faq-title" className="display mt-5 text-[clamp(1.8rem,3.4vw,2.7rem)] font-normal text-cream">
            {locale === 'bn' ? 'প্রশ্ন, উত্তর।' : 'Questions, answered.'}
          </h2>
          <span aria-hidden className="mt-5 inline-flex items-center gap-2 text-gold-deep">
            <span className="h-px w-8 bg-current opacity-50" />
            <Circle className="h-1.5 w-1.5" strokeWidth={2.5} />
            <span className="h-px w-8 bg-current opacity-50" />
          </span>
        </Reveal>

        <Reveal delay={0.08} className="mt-12">
          <SplitAccordion items={accordion} />
        </Reveal>
      </div>
    </section>
  );
}

export function SiteFooter({
  locale,
  settings,
}: {
  locale: Locale;
  settings: {
    order_now: string;
    phone: string;
    address: string;
    social: { instagram: string; facebook: string };
    tagline: string;
  };
}) {
  const prefix = localePrefix(locale);
  const columns = [
    {
      title: locale === 'bn' ? 'এক্সপ্লোর' : 'Explore',
      links: [
        [locale === 'bn' ? 'হোম' : 'Home', prefix],
        [locale === 'bn' ? 'মেনু' : 'Menu', `${prefix}/menu`],
        [locale === 'bn' ? 'আমাদের গল্প' : 'Our Story', `${prefix}/about`],
      ],
    },
    {
      title: locale === 'bn' ? 'ভিজিট' : 'Visit',
      links: [
        [locale === 'bn' ? 'রিজার্ভেশন' : 'Reservations', `${prefix}/contact`],
        [locale === 'bn' ? 'অনলাইন অর্ডার' : 'Order Online', settings.order_now || DEFAULT_ORDER_NOW],
        [locale === 'bn' ? 'ফোন' : 'Call us', `tel:${settings.phone.replace(/\s/g, '')}`],
      ],
    },
    {
      title: locale === 'bn' ? 'আইন' : 'Legal',
      links: [
        [locale === 'bn' ? 'FAQ' : 'FAQ', `${prefix}/faq`],
        [locale === 'bn' ? 'প্রাইভেসি' : 'Privacy', `${prefix}/privacy-policy`],
        [locale === 'bn' ? 'শর্ত' : 'Terms', `${prefix}/terms`],
      ],
    },
  ];

  return (
    <footer className="border-t border-gold-deep/20 bg-dark pt-16 pb-8" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Site footer
      </h2>
      <div className="mx-auto max-w-[82rem] px-5 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/ghoroa-logo-with-wordmark-on-dark.svg" alt="Ghoroa" className="h-14 w-auto" width="200" height="56" />
            <p className="mt-5 max-w-xs text-[0.85rem] leading-[1.75] text-cream/85">{settings.tagline}</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">{col.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      {href.startsWith('http') || href.startsWith('tel:') ? (
                        <a href={href} className="text-[0.85rem] text-cream/85 transition-colors hover:text-gold">
                          {label}
                        </a>
                      ) : (
                        <Link href={href} className="text-[0.85rem] text-cream/85 transition-colors hover:text-gold">
                          {label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-6 sm:flex-row">
          <p className="text-[0.72rem] text-cream/80">
            © {process.env.NEXT_PUBLIC_YEAR || '2026'} Ghoroa. All rights reserved.
          </p>
          <ul className="flex gap-5">
            <li>
              <a
                href={settings.social.instagram}
                aria-label="Instagram"
                className="inline-flex text-cream/85 transition-colors hover:text-gold"
              >
                <IconBrandInstagram className="h-4 w-4" strokeWidth={1.75} />
              </a>
            </li>
            <li>
              <a
                href={settings.social.facebook}
                aria-label="Facebook"
                className="inline-flex text-cream/85 transition-colors hover:text-gold"
              >
                <IconBrandFacebook className="h-4 w-4" strokeWidth={1.75} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
