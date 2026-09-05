/**
 * CMS fetch layer. All routes stay against public WordPress REST.
 * Cache tags: menu | faq | locations | pages | settings.
 */

import { fallbackMenu, menuHasItems } from '@/lib/menu-fallback';

export type Locale = 'en' | 'bn';

export type MenuItem = {
  id: number;
  slug: string;
  name: string;
  name_en: string;
  name_bn: string;
  desc_en: string;
  desc_bn: string;
  price_takeaway: number | null;
  price_eatin: number | null;
  available: boolean;
  featured: boolean;
  sort_order: number;
  image: string | null;
};

export type MenuPayload = {
  locale: Locale;
  categories: Record<string, { en: string; bn: string }>;
  groups: Record<string, MenuItem[]>;
};

export type LocationItem = {
  id: number;
  name: string;
  address: string;
  address_en: string;
  address_bn: string;
  phone: string;
  hours: string;
  map_embed: string;
  image: string | null;
};

export type FaqItem = {
  id: number;
  question: string;
  answer: string;
};

export type Settings = {
  phone: string;
  whatsapp: string;
  hours: string;
  address: string;
  email: string;
  social: { instagram: string; facebook: string };
  order_now: string;
  about: string;
  tagline: string;
};

export type PageItem = {
  id: number;
  slug: string;
  path: string;
  title: string;
  content: string;
  excerpt: string;
  image: string | null;
};

function wpBase(): string {
  return process.env.NEXT_PUBLIC_WP_URL || 'https://ghoroa.com';
}

function tag(name: string, locale: Locale): string {
  return `ghoroa-${locale}-${name}`;
}

async function wpGet<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${wpBase()}${path}`, {
      next: { revalidate: 60, tags: [tag('settings', 'en')] },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export async function fetchMenu(locale: Locale = 'en'): Promise<MenuPayload> {
  try {
    const res = await fetch(`${wpBase()}/wp-json/ghoroa/v1/menu?locale=${locale}`, {
      next: { revalidate: 60, tags: [tag('menu', locale)] },
    });
    if (res.ok) {
      const data = (await res.json()) as MenuPayload;
      if (data.groups && menuHasItems(data)) return data;
    }
  } catch {
    /* CMS down — use transcription fallback */
  }
  return fallbackMenu(locale);
}

export async function fetchLocations(locale: Locale = 'en'): Promise<{ locale: Locale; locations: LocationItem[] }> {
  const fallback = { locale, locations: [] as LocationItem[] };
  try {
    const res = await fetch(`${wpBase()}/wp-json/ghoroa/v1/locations?locale=${locale}`, {
      next: { revalidate: 60, tags: [tag('locations', locale)] },
    });
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

export async function fetchFaqs(locale: Locale = 'en'): Promise<{ locale: Locale; items: FaqItem[] }> {
  const fallback = { locale, items: [] as FaqItem[] };
  try {
    const res = await fetch(`${wpBase()}/wp-json/ghoroa/v1/faqs?locale=${locale}`, {
      next: { revalidate: 60, tags: [tag('faq', locale)] },
    });
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

export async function fetchSettings(): Promise<Settings> {
  const fallback: Settings = {
    phone: '+8801711223344',
    whatsapp: '8801711223344',
    hours: 'Daily · 12:00 – 23:00',
    address: '73, Mohakhali Wireless Gate, Dhaka 1206',
    email: 'hello@ghoroa.com',
    social: { instagram: 'https://instagram.com', facebook: 'https://facebook.com' },
    order_now: 'https://wa.me/8801711223344',
    about:
      'Ghoroa began in Motijheel in 1979. Famous for bhuna khichuri and home-style plates, it still cooks the way Dhaka first fell in love with it.',
    tagline: 'Bangladeshi home cooking, served the way it was meant to be — unhurried, generous, and full of memory.',
  };
  try {
    const res = await fetch(`${wpBase()}/wp-json/ghoroa/v1/settings`, {
      next: { revalidate: 60, tags: ['ghoroa-settings'] },
    });
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

export async function fetchPages(locale: Locale = 'en', path?: string): Promise<{ locale: Locale; pages: PageItem[] }> {
  const fallback = { locale, pages: [] as PageItem[] };
  try {
    const params = new URLSearchParams({ locale });
    if (path) params.set('path', path);
    const res = await fetch(`${wpBase()}/wp-json/ghoroa/v1/pages?${params.toString()}`, {
      next: { revalidate: 60, tags: [tag('pages', locale)] },
    });
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

export function formatPrice(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return `৳${n.toLocaleString('en-BD')}`;
}

export function pickLocaleLabel(item: { name: string; name_en: string; name_bn: string }, locale: Locale): string {
  if (locale === 'bn') return item.name_bn || item.name_en;
  return item.name_en || item.name;
}

export function pickDesc(item: { desc_en: string; desc_bn: string }, locale: Locale): string {
  if (locale === 'bn') return item.desc_bn || item.desc_en;
  return item.desc_en || item.desc_bn;
}

export function pickAddress(item: LocationItem, locale: Locale): string {
  if (locale === 'bn') return item.address_bn || item.address;
  return item.address || item.address_en;
}

export function localePrefix(locale: Locale): string {
  return locale === 'bn' ? '/bn' : '/en';
}

/** Same page, other locale — e.g. /en/menu → /bn/menu */
export function swapLocalePath(pathname: string, locale: Locale): string {
  const rest = pathname.replace(/^\/(en|bn)/, '') || '';
  return `${localePrefix(locale)}${rest}`;
}
