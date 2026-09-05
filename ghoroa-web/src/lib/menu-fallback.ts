/* Foodpanda Mohakhali menu — https://www.foodpanda.com.bd/restaurant/s8au/ghoroa-hotel-and-restaurant-mohakhali
 * Categories and eat-in/takeaway prices aligned to that listing (delivery menu).
 * CMS wins when WordPress returns items.
 */
import type { MenuItem, MenuPayload, Locale } from '@/lib/cms';

const CATEGORIES: MenuPayload['categories'] = {
  "rice": {
    "en": "Rice",
    "bn": "ভাত ও বিরিয়ানি"
  },
  "bread": {
    "en": "Paratha & Naan",
    "bn": "পরোটা ও নান"
  },
  "curry": {
    "en": "Curry",
    "bn": "তরকারি"
  },
  "kebab-grill": {
    "en": "Kebab & Grill",
    "bn": "কাবাব ও গ্রিল"
  },
  "bhorta-bhaji": {
    "en": "Bhorta & Bhaji",
    "bn": "ভর্তা ও ভাজি"
  },
  "dal": {
    "en": "Dal",
    "bn": "ডাল"
  },
  "dessert": {
    "en": "Dessert",
    "bn": "মিষ্টি"
  },
  "beverage": {
    "en": "Beverage",
    "bn": "পানীয়"
  },
  "fish": {
    "en": "Fish",
    "bn": "মাছ"
  },
  "juice": {
    "en": "Juice",
    "bn": "জুস"
  }
};

const RAW: Record<string, Omit<MenuItem, 'name'>[]> = {
  "rice": [
    {
      "id": 1,
      "slug": "plain-rice",
      "name_en": "Plain Rice",
      "name_bn": "সাদা ভাত",
      "desc_en": "Plain rice steamed in water",
      "desc_bn": "",
      "price_takeaway": 60,
      "price_eatin": 60,
      "available": true,
      "featured": false,
      "sort_order": 0,
      "image": null
    },
    {
      "id": 2,
      "slug": "plain-polao",
      "name_en": "Plain Polao",
      "name_bn": "পোলাও",
      "desc_en": "Fragrant rice with aromatic spices & herbs",
      "desc_bn": "",
      "price_takeaway": 125,
      "price_eatin": 125,
      "available": true,
      "featured": false,
      "sort_order": 1,
      "image": null
    },
    {
      "id": 3,
      "slug": "mutton-bhuna-khichuri",
      "name_en": "Mutton Bhuna Khichuri",
      "name_bn": "খাসির ভুনা খিচুড়ি",
      "desc_en": "Chunks of mutton, rice, green chili paste & garam masala",
      "desc_bn": "",
      "price_takeaway": 330,
      "price_eatin": 330,
      "available": true,
      "featured": true,
      "sort_order": 2,
      "image": null
    },
    {
      "id": 4,
      "slug": "chicken-khichuri",
      "name_en": "Chicken Khichuri",
      "name_bn": "চিকেন খিচুড়ি",
      "desc_en": "Aromatic rice, chicken, lentil & secret spices",
      "desc_bn": "",
      "price_takeaway": 300,
      "price_eatin": 300,
      "available": true,
      "featured": true,
      "sort_order": 3,
      "image": null
    },
    {
      "id": 5,
      "slug": "chicken-biryani",
      "name_en": "Chicken Biryani",
      "name_bn": "চিকেন বিরিয়ানি",
      "desc_en": "Chinigura rice with tender chicken, spices & egg",
      "desc_bn": "",
      "price_takeaway": 260,
      "price_eatin": 260,
      "available": true,
      "featured": true,
      "sort_order": 4,
      "image": null
    },
    {
      "id": 6,
      "slug": "kacchi-biryani",
      "name_en": "Kacchi Biryani",
      "name_bn": "কাচ্চি বিরিয়ানি",
      "desc_en": "Basmati rice layered with marinated mutton, spices & egg",
      "desc_bn": "",
      "price_takeaway": 320,
      "price_eatin": 320,
      "available": true,
      "featured": false,
      "sort_order": 5,
      "image": null
    },
    {
      "id": 7,
      "slug": "mutton-special-leg-roast-khichuri",
      "name_en": "Mutton Special Leg Roast Khichuri",
      "name_bn": "খাসির লেগ রোস্ট খিচুড়ি",
      "desc_en": "Chinigura rice with mutton leg roast & secret masala",
      "desc_bn": "",
      "price_takeaway": 650,
      "price_eatin": 650,
      "available": true,
      "featured": false,
      "sort_order": 6,
      "image": null
    }
  ],
  "bread": [
    {
      "id": 8,
      "slug": "shahi-paratha",
      "name_en": "Shahi Paratha",
      "name_bn": "শাহী পরোটা",
      "desc_en": "Soft dough with spices, onions & green chilies",
      "desc_bn": "",
      "price_takeaway": 40,
      "price_eatin": 40,
      "available": true,
      "featured": false,
      "sort_order": 0,
      "image": null
    },
    {
      "id": 9,
      "slug": "butter-naan",
      "name_en": "Butter Naan",
      "name_bn": "বাটার নান",
      "desc_en": "Soft butter naan",
      "desc_bn": "",
      "price_takeaway": 50,
      "price_eatin": 50,
      "available": true,
      "featured": false,
      "sort_order": 1,
      "image": null
    },
    {
      "id": 10,
      "slug": "ghoroa-special-naan",
      "name_en": "Ghoroa Special Naan",
      "name_bn": "ঘরোয়া স্পেশাল নান",
      "desc_en": "Fluffy flatbread baked to perfection",
      "desc_bn": "",
      "price_takeaway": 80,
      "price_eatin": 80,
      "available": true,
      "featured": false,
      "sort_order": 2,
      "image": null
    },
    {
      "id": 11,
      "slug": "garlic-chili-naan",
      "name_en": "Garlic Chili Naan",
      "name_bn": "গার্লিক চিলি নান",
      "desc_en": "Warm flour with a kick of chili",
      "desc_bn": "",
      "price_takeaway": 100,
      "price_eatin": 100,
      "available": true,
      "featured": false,
      "sort_order": 3,
      "image": null
    },
    {
      "id": 12,
      "slug": "garlic-naan",
      "name_en": "Garlic Naan",
      "name_bn": "গার্লিক নান",
      "desc_en": "Chewy naan with minced garlic & green onion",
      "desc_bn": "",
      "price_takeaway": 100,
      "price_eatin": 100,
      "available": true,
      "featured": false,
      "sort_order": 4,
      "image": null
    },
    {
      "id": 13,
      "slug": "biscuit-naan",
      "name_en": "Biscuit Naan",
      "name_bn": "বিস্কুট নান",
      "desc_en": "Slightly sweet & crispy naan",
      "desc_bn": "",
      "price_takeaway": 125,
      "price_eatin": 125,
      "available": true,
      "featured": false,
      "sort_order": 5,
      "image": null
    }
  ],
  "curry": [
    {
      "id": 14,
      "slug": "chicken-jhal-fry",
      "name_en": "Chicken Jhal Fry",
      "name_bn": "চিকেন ঝাল ফ্রাই",
      "desc_en": "Tender chicken in a lightly spicy curry",
      "desc_bn": "",
      "price_takeaway": 200,
      "price_eatin": 200,
      "available": true,
      "featured": true,
      "sort_order": 0,
      "image": null
    },
    {
      "id": 15,
      "slug": "beef-bhuna",
      "name_en": "Beef Bhuna",
      "name_bn": "গরুর ভুনা",
      "desc_en": "Beef cubes with deshi spices & thick gravy",
      "desc_bn": "",
      "price_takeaway": 320,
      "price_eatin": 320,
      "available": true,
      "featured": false,
      "sort_order": 1,
      "image": null
    },
    {
      "id": 16,
      "slug": "chicken-roast",
      "name_en": "Chicken Roast",
      "name_bn": "চিকেন রোস্ট",
      "desc_en": "Whole chicken roast with black pepper",
      "desc_bn": "",
      "price_takeaway": 180,
      "price_eatin": 180,
      "available": true,
      "featured": false,
      "sort_order": 2,
      "image": null
    },
    {
      "id": 17,
      "slug": "chicken-musallam",
      "name_en": "Chicken Musallam",
      "name_bn": "চিকেন মুসল্লাম",
      "desc_en": "Garam masala, mustard oil & turmeric",
      "desc_bn": "",
      "price_takeaway": 320,
      "price_eatin": 320,
      "available": true,
      "featured": false,
      "sort_order": 3,
      "image": null
    },
    {
      "id": 18,
      "slug": "mutton-leg-roast",
      "name_en": "Mutton Leg Roast",
      "name_bn": "খাসির লেগ রোস্ট",
      "desc_en": "Mildly spicy Mughal-style gravy, tender meat",
      "desc_bn": "",
      "price_takeaway": 500,
      "price_eatin": 500,
      "available": true,
      "featured": false,
      "sort_order": 4,
      "image": null
    },
    {
      "id": 19,
      "slug": "mutton-dopaiza",
      "name_en": "Mutton Dopaiza",
      "name_bn": "খাসির দোপিয়াজা",
      "desc_en": "Mutton with dahi, garam masala & lemon",
      "desc_bn": "",
      "price_takeaway": 310,
      "price_eatin": 310,
      "available": true,
      "featured": false,
      "sort_order": 5,
      "image": null
    }
  ],
  "kebab-grill": [
    {
      "id": 20,
      "slug": "beef-sheek-kebab",
      "name_en": "Beef Sheek Kebab",
      "name_bn": "বিফ শিক কাবাব",
      "desc_en": "Onion, green chili, yogurt & garam masala",
      "desc_bn": "",
      "price_takeaway": 210,
      "price_eatin": 210,
      "available": true,
      "featured": false,
      "sort_order": 0,
      "image": null
    },
    {
      "id": 21,
      "slug": "mutton-boti-kebab",
      "name_en": "Mutton Boti Kebab",
      "name_bn": "খাসির বটি কাবাব",
      "desc_en": "Marinated mutton boti with yogurt & spices",
      "desc_bn": "",
      "price_takeaway": 210,
      "price_eatin": 210,
      "available": true,
      "featured": false,
      "sort_order": 1,
      "image": null
    },
    {
      "id": 22,
      "slug": "chicken-tikka",
      "name_en": "Chicken Tikka",
      "name_bn": "চিকেন টিক্কা",
      "desc_en": "Chicken breast over coals, served with chutney",
      "desc_bn": "",
      "price_takeaway": 260,
      "price_eatin": 260,
      "available": true,
      "featured": false,
      "sort_order": 2,
      "image": null
    },
    {
      "id": 23,
      "slug": "chicken-shawarma-kebab",
      "name_en": "Chicken Shawarma Kebab",
      "name_bn": "চিকেন শাওয়ারমা কাবাব",
      "desc_en": "Juicy chicken shawarma kebab",
      "desc_bn": "",
      "price_takeaway": 160,
      "price_eatin": 160,
      "available": true,
      "featured": true,
      "sort_order": 3,
      "image": null
    },
    {
      "id": 24,
      "slug": "grilled-chicken",
      "name_en": "Grilled Chicken",
      "name_bn": "গ্রিল চিকেন",
      "desc_en": "Grilled with special sauce",
      "desc_bn": "",
      "price_takeaway": 150,
      "price_eatin": 150,
      "available": true,
      "featured": true,
      "sort_order": 4,
      "image": null
    },
    {
      "id": 25,
      "slug": "chicken-tandoori",
      "name_en": "Chicken Tandoori",
      "name_bn": "চিকেন তন্দুরি",
      "desc_en": "Tandoor-smoked chicken",
      "desc_bn": "",
      "price_takeaway": 140,
      "price_eatin": 140,
      "available": true,
      "featured": false,
      "sort_order": 5,
      "image": null
    },
    {
      "id": 26,
      "slug": "chicken-boti-kebab",
      "name_en": "Chicken Boti Kebab",
      "name_bn": "চিকেন বটি কাবাব",
      "desc_en": "Marinated chicken chunks with yogurt & spices",
      "desc_bn": "",
      "price_takeaway": 160,
      "price_eatin": 160,
      "available": true,
      "featured": false,
      "sort_order": 6,
      "image": null
    }
  ],
  "bhorta-bhaji": [
    {
      "id": 27,
      "slug": "taki-fish-bhorta",
      "name_en": "Taki Fish Bhorta",
      "name_bn": "টাকি মাছ ভর্তা",
      "desc_en": "Taki fish with secret spices & chili",
      "desc_bn": "",
      "price_takeaway": 50,
      "price_eatin": 50,
      "available": true,
      "featured": false,
      "sort_order": 0,
      "image": null
    },
    {
      "id": 28,
      "slug": "kacha-kola-bhorta",
      "name_en": "Kacha Kola Bhorta",
      "name_bn": "কাঁচা কলা ভর্তা",
      "desc_en": "Mashed raw banana with chili & spices",
      "desc_bn": "",
      "price_takeaway": 50,
      "price_eatin": 50,
      "available": true,
      "featured": false,
      "sort_order": 1,
      "image": null
    },
    {
      "id": 29,
      "slug": "chingri-bhorta",
      "name_en": "Chingri Bhorta",
      "name_bn": "চিংড়ি ভর্তা",
      "desc_en": "Prawn with fried onion & spices",
      "desc_bn": "",
      "price_takeaway": 50,
      "price_eatin": 50,
      "available": true,
      "featured": false,
      "sort_order": 2,
      "image": null
    },
    {
      "id": 30,
      "slug": "vegetable",
      "name_en": "Vegetable",
      "name_bn": "সবজি",
      "desc_en": "Seasonal garden vegetables, light spice",
      "desc_bn": "",
      "price_takeaway": 45,
      "price_eatin": 45,
      "available": true,
      "featured": false,
      "sort_order": 3,
      "image": null
    },
    {
      "id": 31,
      "slug": "pui-shak-bhorta",
      "name_en": "Pui Shak Bhorta",
      "name_bn": "পুঁই শাক ভর্তা",
      "desc_en": "Mashed pui shak",
      "desc_bn": "",
      "price_takeaway": 50,
      "price_eatin": 50,
      "available": true,
      "featured": false,
      "sort_order": 4,
      "image": null
    }
  ],
  "dal": [
    {
      "id": 32,
      "slug": "plain-dal",
      "name_en": "Plain Dal",
      "name_bn": "ডাল",
      "desc_en": "Red lentils with authentic spices",
      "desc_bn": "",
      "price_takeaway": 30,
      "price_eatin": 30,
      "available": true,
      "featured": false,
      "sort_order": 0,
      "image": null
    },
    {
      "id": 33,
      "slug": "mutton-dal",
      "name_en": "Mutton Dal",
      "name_bn": "খাসির ডাল",
      "desc_en": "Red lentils with mutton",
      "desc_bn": "",
      "price_takeaway": 310,
      "price_eatin": 310,
      "available": true,
      "featured": false,
      "sort_order": 1,
      "image": null
    }
  ],
  "dessert": [
    {
      "id": 34,
      "slug": "firni",
      "name_en": "Firni",
      "name_bn": "ফিরনি",
      "desc_en": "Basmati rice, saffron, almonds & milk",
      "desc_bn": "",
      "price_takeaway": 50,
      "price_eatin": 50,
      "available": true,
      "featured": false,
      "sort_order": 0,
      "image": null
    },
    {
      "id": 35,
      "slug": "doi-1kg",
      "name_en": "Doi (1kg)",
      "name_bn": "দই (১ কেজি)",
      "desc_en": "Prepared with milk & sugar",
      "desc_bn": "",
      "price_takeaway": 450,
      "price_eatin": 450,
      "available": true,
      "featured": false,
      "sort_order": 1,
      "image": null
    },
    {
      "id": 36,
      "slug": "cup-doi",
      "name_en": "Cup Doi",
      "name_bn": "কাপ দই",
      "desc_en": "Sugar, curd & milk",
      "desc_bn": "",
      "price_takeaway": 60,
      "price_eatin": 60,
      "available": true,
      "featured": false,
      "sort_order": 2,
      "image": null
    },
    {
      "id": 37,
      "slug": "faluda",
      "name_en": "Faluda",
      "name_bn": "ফালুদা",
      "desc_en": "Fruits, custard, ice cream & jelly",
      "desc_bn": "",
      "price_takeaway": 180,
      "price_eatin": 180,
      "available": true,
      "featured": false,
      "sort_order": 3,
      "image": null
    }
  ],
  "beverage": [
    {
      "id": 38,
      "slug": "borhani",
      "name_en": "Borhani",
      "name_bn": "বরহানি",
      "desc_en": "Yogurt drink to aid digestion",
      "desc_bn": "",
      "price_takeaway": 130,
      "price_eatin": 130,
      "available": true,
      "featured": false,
      "sort_order": 0,
      "image": null
    },
    {
      "id": 39,
      "slug": "lassi",
      "name_en": "Lassi",
      "name_bn": "লস্যি",
      "desc_en": "Classic lassi",
      "desc_bn": "",
      "price_takeaway": 90,
      "price_eatin": 90,
      "available": true,
      "featured": false,
      "sort_order": 1,
      "image": null
    }
  ],
  "fish": [
    {
      "id": 40,
      "slug": "pabda-fish",
      "name_en": "Pabda Fish",
      "name_bn": "পাবদা মাছ",
      "desc_en": "Garlic, ginger, onion, turmeric & chili",
      "desc_bn": "",
      "price_takeaway": 250,
      "price_eatin": 250,
      "available": true,
      "featured": false,
      "sort_order": 0,
      "image": null
    },
    {
      "id": 41,
      "slug": "rui-fish",
      "name_en": "Rui Fish",
      "name_bn": "রুই মাছ",
      "desc_en": "Garlic, ginger, onion, turmeric & chili",
      "desc_bn": "",
      "price_takeaway": 300,
      "price_eatin": 300,
      "available": true,
      "featured": false,
      "sort_order": 1,
      "image": null
    },
    {
      "id": 42,
      "slug": "tengra-fish",
      "name_en": "Tengra Fish",
      "name_bn": "টেংরা মাছ",
      "desc_en": "Aromatic tengra curry with rich spices",
      "desc_bn": "",
      "price_takeaway": 250,
      "price_eatin": 250,
      "available": true,
      "featured": false,
      "sort_order": 2,
      "image": null
    }
  ],
  "juice": [
    {
      "id": 43,
      "slug": "orange-juice",
      "name_en": "Orange Juice",
      "name_bn": "কমলার জুস",
      "desc_en": "Fresh orange pulp",
      "desc_bn": "",
      "price_takeaway": 200,
      "price_eatin": 200,
      "available": true,
      "featured": false,
      "sort_order": 0,
      "image": null
    },
    {
      "id": 44,
      "slug": "mixed-fruit-juice",
      "name_en": "Mixed Fruit Juice",
      "name_bn": "মিক্সড ফ্রুট জুস",
      "desc_en": "Seasonal fruits, sugar & ice",
      "desc_bn": "",
      "price_takeaway": 200,
      "price_eatin": 200,
      "available": true,
      "featured": false,
      "sort_order": 1,
      "image": null
    },
    {
      "id": 45,
      "slug": "apple-juice",
      "name_en": "Apple Juice",
      "name_bn": "আপেল জুস",
      "desc_en": "Fresh apple juice",
      "desc_bn": "",
      "price_takeaway": 200,
      "price_eatin": 200,
      "available": true,
      "featured": false,
      "sort_order": 2,
      "image": null
    },
    {
      "id": 46,
      "slug": "malta-juice",
      "name_en": "Malta Juice",
      "name_bn": "মাল্টা জুস",
      "desc_en": "Malta with sugar",
      "desc_bn": "",
      "price_takeaway": 200,
      "price_eatin": 200,
      "available": true,
      "featured": false,
      "sort_order": 3,
      "image": null
    },
    {
      "id": 47,
      "slug": "mango-juice",
      "name_en": "Mango Juice",
      "name_bn": "আমের জুস",
      "desc_en": "Pulpy mango",
      "desc_bn": "",
      "price_takeaway": 200,
      "price_eatin": 200,
      "available": true,
      "featured": false,
      "sort_order": 4,
      "image": null
    }
  ]
};

export function fallbackMenu(locale: Locale): MenuPayload {
  const groups: MenuPayload['groups'] = {};
  for (const [slug, items] of Object.entries(RAW)) {
    groups[slug] = items.map((it) => ({
      ...it,
      name: locale === 'bn' ? it.name_bn || it.name_en : it.name_en,
    }));
  }
  return { locale, categories: CATEGORIES, groups };
}

export function menuHasItems(menu: MenuPayload): boolean {
  return Object.values(menu.groups).some((g) => g.length > 0);
}
