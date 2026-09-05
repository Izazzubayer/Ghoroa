import type { Locale } from '@/lib/cms';

/** Public story synthesized from press (esp. The Business Standard, Dec 2020 feature on Hotel Ghorowa). */
export type AboutBlock = {
  title: string;
  lead: string;
  sections: Array<{ heading: string; body: string }>;
};

export function aboutCopy(locale: Locale): AboutBlock {
  if (locale === 'bn') {
    return {
      title: 'আমাদের গল্প',
      lead:
        'ঘরোয়া মতিঝিলের মাটি থেকে উঠেছে — ১৯৭৯ সালে নজরুল ইসলাম (নুরু বয়াতি) যে টেবিল খুলেছিলেন, সেখান থেকেই ঢাকার অফিসগামী ও খাবারপ্রেমীদের ঘরের স্বাদ ছড়িয়ে পড়ে।',
      sections: [
        {
          heading: 'মতিঝিল, ১৯৭৯',
          body:
            'হোটেল ঘরোয়া শুরু হয়েছিল মতিঝিলের ব্যস্ত হৃদয়ে। আশির দশক থেকে ভুনা খিচুড়ি ও কাচ্চি-কাবাবের স্বাদে নাম ছড়িয়ে পড়ে — ছাত্র, কর্মী ও পরিবার একই টেবিলে আসত, কারণ এখানকার রান্না ঘরের মতোই স্পষ্ট ও উদার।',
        },
        {
          heading: 'খিচুড়ির কিংবদন্তি',
          body:
            'শেফ আব্দুল মজিদ বেপারী দীর্ঘকাল ধরে এই রান্নাঘরের স্বাক্ষর বহন করেছেন। তাঁর ভুনা খিচুড়ি — নরম মাংস, মসলাদার ভাত — ঢাকার খাবারের স্মৃতিতে জায়গা করে নিয়েছে; ব্যস্ত দিনেও হাজার হাজার কেজি রান্না হয়েছে বলে প্রেসে লেখা আছে।',
        },
        {
          heading: 'বন্ধ, ফিরে আসা, আজ',
          body:
            '২০১৫-এ ঘরোয়া কিছুকাল বন্ধ ছিল। পাঁচ বছর পর — ১৫ ডিসেম্বর — মতিঝিলে ওয়াপদা ভবনের কাছে নতুন ঠিকানায় দরজা আবার খোলে। আজও মূল শিকড় মতিঝিল; মহাখালীসহ শহরের অন্যান্য টেবিলেও ঘরোয়ার নাম পাওয়া যায়। স্বাদ একই ধরনের: অস্থির নয়, ঘরোয়া।',
        },
      ],
    };
  }

  return {
    title: 'About Ghoroa',
    lead:
      'Ghoroa began in Motijheel. In 1979 Nazrul Islam — known as Nuru Boyati — opened a dining room that fed Dhaka’s office crowds and students the way a home kitchen does: generous plates, clear spices, no hurry.',
    sections: [
      {
        heading: 'Motijheel, 1979',
        body:
          'Hotel Ghorowa took root in the commercial heart of Motijheel. Through the 1980s its name travelled on bhuna khichuri, biryani, and kebab — the kind of food Notre Dame students and bank clerks queued for, then carried home in packets for the family table.',
      },
      {
        heading: 'The khichuri that made the name',
        body:
          'Chef Abdul Mazid Bepari shaped the kitchen’s signature over decades. Press has long called Ghorowa’s bhuna khichuri among Dhaka’s best: tender meat, spicy rice, cooked at a scale that once meant thousands of kilos on a single busy day — still tasting like someone’s house, not a factory line.',
      },
      {
        heading: 'Closed, returned, still home',
        body:
          'In 2015 the Motijheel house went quiet for five years. On 15 December it reopened nearby — opposite the WAPDA Building — and the queues came back for the same plate. The root remains Motijheel; tables under the Ghoroa name also appear elsewhere in the city, including Mohakhali. Wherever you sit, the promise is the same: home cooking, served without shortcuts.',
      },
    ],
  };
}

/** Short lead for the home Story band / CMS settings fallback. */
export function aboutLead(locale: Locale): string {
  return locale === 'bn'
    ? 'ঘরোয়া ১৯৭৯-এ মতিঝিলে শুরু। ভুনা খিচুড়ি ও ঘরের রান্না দিয়ে ঢাকার টেবিল জয় করেছে — আজও সেই একই স্বাদ।'
    : 'Ghoroa began in Motijheel in 1979. Famous for bhuna khichuri and home-style plates, it still cooks the way Dhaka first fell in love with it.';
}
