'use client';

import { Eyebrow, Ornament, Reveal } from '@/components/primitives';
import {
  FaqAccordion,
  type FaqAccordionItem,
} from '@/components/watermelon/accordion-1';
import type { FaqItem, Locale } from '@/lib/cms';

const FALLBACK_EN: FaqAccordionItem[] = [
  {
    value: 'hours',
    title: 'What are your opening hours?',
    content:
      'We are open daily for lunch and dinner. Check the footer or call ahead on busy evenings — kitchen hours can shift for private feasts.',
  },
  {
    value: 'reserve',
    title: 'How do I reserve a table?',
    content:
      'Use the contact form, call us, or message on WhatsApp. We confirm most requests within 24 hours.',
  },
  {
    value: 'order',
    title: 'Do you offer takeaway or delivery?',
    content:
      'Yes — tap Order Now for WhatsApp ordering in Phase 1. Full online ordering arrives later with Rosuii.',
  },
  {
    value: 'halal',
    title: 'Is the food halal?',
    content:
      'Yes. Our kitchen follows halal practice. Ask your server about spice levels and any allergies before you order.',
  },
  {
    value: 'groups',
    title: 'Can you host larger groups?',
    content:
      'We welcome family tables and small gatherings. For larger parties, reserve early so we can set the room and the rice pot accordingly.',
  },
];

const FALLBACK_BN: FaqAccordionItem[] = [
  {
    value: 'hours',
    title: 'খোলার সময় কী?',
    content:
      'আমরা প্রতিদিন দুপুর ও রাতের খাবারের জন্য খোলা। ব্যস্ত সন্ধ্যায় আগে ফোন করুন — ব্যক্তিগত ভোজের জন্য সময় বদলাতে পারে।',
  },
  {
    value: 'reserve',
    title: 'টেবিল কীভাবে বুক করব?',
    content:
      'যোগাযোগ ফর্ম, ফোন, বা WhatsApp ব্যবহার করুন। বেশিরভাগ অনুরোধ ২৪ ঘণ্টার মধ্যে নিশ্চিত করি।',
  },
  {
    value: 'order',
    title: 'পার্সেল বা ডেলিভারি আছে?',
    content:
      'হ্যাঁ — Order Now চাপলে WhatsApp অর্ডার। পূর্ণ অনলাইন অর্ডার পরে Rosuii দিয়ে আসবে।',
  },
  {
    value: 'halal',
    title: 'খাবার কি হালাল?',
    content:
      'হ্যাঁ। রান্নাঘর হালাল অনুসরণ করে। অর্ডারের আগে মশলার মাত্রা ও অ্যালার্জি জানিয়ে দিন।',
  },
  {
    value: 'groups',
    title: 'বড় দল আনতে পারি?',
    content:
      'পারিবারিক টেবিল ও ছোট জমায়েত স্বাগতম। বড় দলের জন্য আগে রিজার্ভ করুন যাতে রুম ও হাঁড়ি সাজাতে পারি।',
  },
];

function toAccordionItems(
  locale: Locale,
  items: FaqItem[],
): FaqAccordionItem[] {
  if (items.length > 0) {
    return items.map((item) => ({
      value: `faq-${item.id}`,
      title: item.question,
      content: item.answer,
    }));
  }
  return locale === 'bn' ? FALLBACK_BN : FALLBACK_EN;
}

export function FaqSection({
  locale,
  items,
}: {
  locale: Locale;
  items: FaqItem[];
}) {
  const accordion = toAccordionItems(locale, items);

  return (
    <section
      id="faq"
      className="relative bg-dark py-24 lg:py-32"
      aria-labelledby="faq-title"
    >
      <div className="mx-auto max-w-3xl px-5 lg:px-10">
        <Reveal className="flex flex-col items-center text-center">
          <Eyebrow>{locale === 'bn' ? 'জানুন' : 'Good to know'}</Eyebrow>
          <h2
            id="faq-title"
            className="display mt-5 text-[clamp(1.9rem,3.6vw,2.8rem)] font-normal text-cream"
          >
            {locale === 'bn' ? 'প্রশ্ন, উত্তর।' : 'Questions, answered.'}
          </h2>
          <Ornament className="mt-5" />
          <p className="mt-6 max-w-md text-[0.95rem] leading-[1.75] text-cream/85">
            {locale === 'bn'
              ? 'রিজার্ভেশন, অর্ডার, এবং টেবিল নিয়ে সাধারণ প্রশ্ন।'
              : 'Common questions about reservations, ordering, and the table.'}
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-12">
          <FaqAccordion items={accordion} />
        </Reveal>
      </div>
    </section>
  );
}
