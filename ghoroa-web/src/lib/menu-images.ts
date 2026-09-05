/** Recycled site food photography — CMS `image` wins when set. */

const POOL = [
  '/images/biryani.jpg',
  '/images/curry.jpg',
  '/images/fish.jpg',
  '/images/prawn.jpg',
  '/images/thali.jpg',
  '/images/khichuri.jpg',
  '/images/juice.jpg',
  '/images/dining.jpg',
  '/images/kitchen.jpg',
  '/images/hero-accent.jpg',
  '/images/cta-dining.jpg',
] as const;

const CATEGORY_LEAD: Record<string, string> = {
  rice: '/images/biryani.jpg',
  bread: '/images/thali.jpg',
  curry: '/images/curry.jpg',
  'kebab-grill': '/images/hero-accent.jpg',
  'bhorta-bhaji': '/images/kitchen.jpg',
  dal: '/images/khichuri.jpg',
  fish: '/images/fish.jpg',
  dessert: '/images/dining.jpg',
  beverage: '/images/juice.jpg',
  juice: '/images/juice.jpg',
};

function poolFor(slug: string): string[] {
  const lead = CATEGORY_LEAD[slug] || '/images/thali.jpg';
  return [lead, ...POOL.filter((src) => src !== lead)];
}

/** Prefer CMS image; otherwise cycle recycled photos per category. */
export function menuDishImage(
  slug: string,
  index: number,
  cmsImage: string | null | undefined,
): string {
  if (cmsImage) return cmsImage;
  const pool = poolFor(slug);
  return pool[index % pool.length];
}
