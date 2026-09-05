import type { Locale } from '@/lib/cms';

export function contactCopy(locale: Locale) {
  if (locale === 'bn') {
    return {
      eyebrow: 'যোগাযোগ',
      title: 'টেবিলে আসুন।',
      lead: 'রিজার্ভেশন, অনুষ্ঠান, বা শুধু একটি প্রশ্ন — আমরা ২৪ ঘণ্টার মধ্যে উত্তর দিই।',
      channelsEyebrow: 'সরাসরি',
      channelsTitle: 'যেভাবে খুশি যোগাযোগ করুন।',
      call: 'ফোন',
      whatsapp: 'WhatsApp',
      email: 'ইমেইল',
      order: 'অর্ডার করুন',
      visitEyebrow: 'ভিজিট',
      visitTitle: 'ঘরোয়ায় আসুন।',
      hours: 'সময়',
      address: 'ঠিকানা',
      formEyebrow: 'রিজার্ভেশন',
      formTitle: 'একটি আসন রাখুন।',
      formLead:
        '৬ বা তার বেশি অতিথির জন্য আগে থেকে জানান। আমরা আপনার তারিখ ও পছন্দ নিশ্চিত করে লিখব।',
      locationsEyebrow: 'লোকেশন',
      locationsTitle: 'আমাদের শাখা।',
      locationsCta: 'সব লোকেশন',
      locationsEmpty: 'ঠিকানা ও সময় নিচে দেখুন — শাখার তালিকা শীঘ্রই আপডেট হবে।',
      directions: 'দিকনির্দেশ',
      lunch: 'দুপুর',
      dinner: 'রাত',
      pickDate: 'তারিখ বাছুন',
      guestsDec: 'অতিথি কমান',
      guestsInc: 'অতিথি বাড়ান',
      faqLead: 'ঘণ্টা, পার্কিং, বা অর্ডার নিয়ে প্রশ্ন?',
      faqCta: 'FAQ দেখুন',
    };
  }

  return {
    eyebrow: 'Contact',
    title: 'Join us at the table.',
    lead: 'Reservations, celebrations, or a quick question — we reply within 24 hours.',
    channelsEyebrow: 'Reach us',
    channelsTitle: 'Call, message, or write.',
    call: 'Call',
    whatsapp: 'WhatsApp',
    email: 'Email',
    order: 'Order now',
    visitEyebrow: 'Visit',
    visitTitle: 'Find Ghoroa.',
    hours: 'Hours',
    address: 'Address',
    formEyebrow: 'Reservations',
    formTitle: 'Hold a seat.',
    formLead:
      'For parties of six or more, tell us ahead. We will confirm your date and preferences by reply.',
    locationsEyebrow: 'Locations',
    locationsTitle: 'Our branches.',
    locationsCta: 'All locations',
    locationsEmpty: 'See address and hours below — the full branch list updates from the kitchen soon.',
    directions: 'Get directions',
    lunch: 'Lunch',
    dinner: 'Dinner',
    pickDate: 'Pick a date',
    guestsDec: 'Fewer guests',
    guestsInc: 'More guests',
    faqLead: 'Questions about hours, parking, or ordering?',
    faqCta: 'Browse the FAQ',
  };
}
