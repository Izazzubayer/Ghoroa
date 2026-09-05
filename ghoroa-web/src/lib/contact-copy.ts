import type { Locale } from '@/lib/cms';

export function contactCopy(locale: Locale) {
  if (locale === 'bn') {
    return {
      eyebrow: 'যোগাযোগ',
      title: 'টেবিলে আসুন।',
      lead: 'রিজার্ভেশন বা প্রশ্ন — আমরা ২৪ ঘণ্টার মধ্যে উত্তর দিই।',
      channelsEyebrow: 'সরাসরি',
      channelsTitle: 'ফোন করুন, বা লিখুন।',
      call: 'ফোন',
      whatsapp: 'WhatsApp',
      email: 'ইমেইল',
      visitEyebrow: 'ভিজিট',
      visitTitle: 'ঘরোয়ায় আসুন।',
      hours: 'সময়',
      address: 'ঠিকানা',
      formEyebrow: 'রিজার্ভেশন',
      formTitle: 'একটি আসন রাখুন।',
      formLead:
        '৬ বা তার বেশি অতিথির জন্য আগে থেকে জানান। আমরা তারিখ নিশ্চিত করে লিখব।',
      locationsTitle: 'আমাদের শাখা।',
      locationsCta: 'সব লোকেশন',
      directions: 'দিকনির্দেশ',
      pickDate: 'তারিখ বাছুন',
      pickTime: 'সময় বাছুন',
      guestsDec: 'অতিথি কমান',
      guestsInc: 'অতিথি বাড়ান',
      faqLead: 'ঘণ্টা বা অর্ডার নিয়ে প্রশ্ন?',
      faqCta: 'FAQ দেখুন',
    };
  }

  return {
    eyebrow: 'Contact',
    title: 'Join us at the table.',
    lead: 'Reservations or a quick question — we reply within 24 hours.',
    channelsEyebrow: 'Reach us',
    channelsTitle: 'Call, message, or write.',
    call: 'Call',
    whatsapp: 'WhatsApp',
    email: 'Email',
    visitEyebrow: 'Visit',
    visitTitle: 'Find Ghoroa.',
    hours: 'Hours',
    address: 'Address',
    formEyebrow: 'Reservations',
    formTitle: 'Hold a seat.',
    formLead:
      'For parties of six or more, tell us ahead. We will confirm by reply.',
    locationsTitle: 'Our branches.',
    locationsCta: 'All locations',
    directions: 'Get directions',
    pickDate: 'Pick a date',
    pickTime: 'Pick a time',
    guestsDec: 'Fewer guests',
    guestsInc: 'More guests',
    faqLead: 'Questions about hours or ordering?',
    faqCta: 'Browse the FAQ',
  };
}
