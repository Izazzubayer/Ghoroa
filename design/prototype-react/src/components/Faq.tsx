import { Eyebrow, Ornament, Reveal } from './primitives'
import { SplitAccordion, type AccordionItemData } from './watermelon/card-split-accordian'

const FAQS: AccordionItemData[] = [
  {
    id: 1,
    title: 'Is the kitchen halal?',
    content: 'Yes. All meat is halal-certified and sourced from suppliers we have used for years.',
  },
  {
    id: 2,
    title: 'Do I need to book a table?',
    content:
      'Walk-ins are welcome. For parties of six or more, or for kacchi biryani, please call ahead — the biryani is baked to order and needs notice.',
  },
  {
    id: 3,
    title: 'Can I order for delivery or takeaway?',
    content:
      'Yes. Message us on WhatsApp or call and we will confirm timing. Takeaway prices are lower than eat-in and are listed on the full menu.',
  },
  {
    id: 4,
    title: 'Do you cater for large gatherings?',
    content:
      'We cook for milad, aqiqa, birthdays, and office lunches. Beef leg roast and kacchi biryani are our most requested platters — give us 24 hours.',
  },
  {
    id: 5,
    title: 'Are there vegetarian options?',
    content:
      'Yes — daal, mixed vegetables, vegetable bhaji, vegetable parota, and egg curry. Tell us when you order and we will keep them separate.',
  },
]

export default function Faq() {
  return (
    <section id="faq" className="relative bg-dark pb-24 lg:pb-32" aria-labelledby="faq-title">
      <div className="mx-auto max-w-3xl px-5 lg:px-10">
        <Reveal className="flex flex-col items-center text-center">
          <Eyebrow>Good to know</Eyebrow>
          <h2 id="faq-title" className="display mt-5 text-[clamp(1.8rem,3.4vw,2.7rem)] font-normal text-cream">
            Questions, answered.
          </h2>
          <Ornament className="mt-5" />
        </Reveal>

        <Reveal delay={0.08} className="mt-12">
          <SplitAccordion items={FAQS} />
        </Reveal>
      </div>
    </section>
  )
}
