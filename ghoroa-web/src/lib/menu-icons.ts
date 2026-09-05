import type { LucideIcon } from 'lucide-react';
import {
  Bean,
  Beef,
  Croissant,
  CupSoda,
  Drumstick,
  EggFried,
  Fish,
  Flame,
  Milk,
  Salad,
  Shrimp,
  Utensils,
  UtensilsCrossed,
} from 'lucide-react';
import { IconBowl, IconMeat, type Icon } from '@tabler/icons-react';

export type DishKind =
  | 'chicken'
  | 'beef'
  | 'mutton'
  | 'shrimp'
  | 'fish'
  | 'egg'
  | 'rice'
  | 'bread'
  | 'dal'
  | 'veg'
  | 'drink'
  | 'dessert'
  | 'grill'
  | 'mixed'
  | 'other';

type DishIcon = LucideIcon | Icon;

const KIND_META: Record<
  DishKind,
  { Icon: DishIcon; labelEn: string; labelBn: string }
> = {
  chicken: { Icon: Drumstick, labelEn: 'Chicken', labelBn: 'মুরগি' },
  beef: { Icon: Beef, labelEn: 'Beef', labelBn: 'গরুর মাংস' },
  mutton: { Icon: IconMeat, labelEn: 'Mutton', labelBn: 'খাসি' },
  shrimp: { Icon: Shrimp, labelEn: 'Shrimp', labelBn: 'চিংড়ি' },
  fish: { Icon: Fish, labelEn: 'Fish', labelBn: 'মাছ' },
  egg: { Icon: EggFried, labelEn: 'Egg', labelBn: 'ডিম' },
  rice: { Icon: IconBowl, labelEn: 'Rice', labelBn: 'ভাত / বিরিয়ানি' },
  bread: { Icon: Croissant, labelEn: 'Bread', labelBn: 'রুটি / নান' },
  dal: { Icon: Bean, labelEn: 'Dal', labelBn: 'ডাল' },
  veg: { Icon: Salad, labelEn: 'Vegetable', labelBn: 'সবজি' },
  drink: { Icon: CupSoda, labelEn: 'Drink', labelBn: 'পানীয়' },
  dessert: { Icon: Milk, labelEn: 'Sweet', labelBn: 'মিষ্টি' },
  grill: { Icon: Flame, labelEn: 'Grill', labelBn: 'গ্রিল' },
  mixed: { Icon: UtensilsCrossed, labelEn: 'Mixed', labelBn: 'মিশ্র' },
  other: { Icon: Utensils, labelEn: 'Dish', labelBn: 'খাবার' },
};

/** Infer protein / dish kind from English (+ optional Bangla) name. */
export function dishKindFromName(nameEn: string, nameBn = ''): DishKind {
  const t = `${nameEn} ${nameBn}`.toLowerCase();

  if (/shrimp|prawn|চিংড়ি/.test(t)) return 'shrimp';
  if (/fish|মাছ/.test(t)) return 'fish';
  if (/mutton|goat|খাসি|hunter hangs|kacchi/.test(t)) return 'mutton';
  if (/beef|গরুর|গরু/.test(t)) return 'beef';
  if (/chicken|মুরগি|চিকেন/.test(t)) return 'chicken';
  if (/egg|ডিম/.test(t)) return 'egg';
  if (/dal|ডাল|lentil/.test(t)) return 'dal';
  if (
    /biryani|khichuri|tehari|plain rice|white rice|flower rice|ভাত|বিরিয়ানি|খিচুড়ি|তেহারি/.test(
      t,
    )
  ) {
    return 'rice';
  }
  if (/naan|parota|paratha|bread|নান|পরোটা/.test(t)) return 'bread';
  if (/tea|coffee|borhani|coke|7up|lassi|labang|beverage|চা|কফি|বোরহানি/.test(t)) {
    return 'drink';
  }
  if (/curd|sweet|pudding|firni|faluda|মিষ্টি|ফিরনি|ফালুদা|দই/.test(t)) {
    return 'dessert';
  }
  if (/vegetable|veg |সবজি|ভাজি|potato|আলু/.test(t)) return 'veg';
  if (/mixed kebab|মিক্স/.test(t)) return 'mixed';
  if (/grill|roast|kebab|tikka|গ্রিল|রোস্ট|কাবাব/.test(t)) return 'grill';

  return 'other';
}

export function dishKindMeta(kind: DishKind) {
  return KIND_META[kind];
}

/** Unique kinds present in a list — for a small legend. */
export function kindsInItems(
  items: Array<{ name_en: string; name_bn?: string }>,
): DishKind[] {
  const seen = new Set<DishKind>();
  for (const it of items) {
    seen.add(dishKindFromName(it.name_en, it.name_bn));
  }
  return Array.from(seen);
}
