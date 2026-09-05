import { Eyebrow, GoldButton, Ornament, Reveal } from './primitives'

/** Real dishes from the transcribed Ghoroa menu. Prices are eat-in, in BDT. */
const COURSES = [
  {
    heading: 'From the rice pot',
    bn: 'ভাত ও বিরিয়ানি',
    items: [
      { name: 'Kacchi Biryani', bn: 'কাচ্চি বিরিয়ানি', note: 'Mutton and aged rice, sealed and slow-baked', price: '300' },
      { name: 'Beef Bhuna Khichuri', bn: 'বিফ ভুনা খিচুড়ি', note: 'Monsoon comfort — lentils, rice, dark bhuna', price: '300' },
      { name: 'Tehari', bn: 'তেহারি', note: 'Old Dhaka style, mustard oil and green chilli', price: '125' },
    ],
  },
  {
    heading: 'From the karahi',
    bn: 'মাংসের পদ',
    items: [
      { name: 'Beef Kala Bhuna', bn: 'বিফ কালা ভুনা', note: 'Chattogram classic, cooked down to near black', price: '160' },
      { name: 'Beef Rezala', bn: 'বিফ রেজালা', note: 'Pale, fragrant, finished with kewra', price: '330' },
      { name: 'Beef Leg Roast', bn: 'বিফ লেগ রোস্ট', note: 'For the table — carved to order', price: '500' },
    ],
  },
  {
    heading: 'To finish',
    bn: 'মিষ্টি ও পানীয়',
    items: [
      { name: 'Mishti Doi', bn: 'মিষ্টি দই', note: 'Set overnight in earthenware', price: '50' },
      { name: 'Borhani', bn: 'বোরহানি', note: 'Spiced yoghurt cooler, by the glass or litre', price: '130' },
      { name: 'Ghoroa Special Naan', bn: 'ঘরোয়া স্পেশাল নান', note: 'Straight off the tandoor', price: '80' },
    ],
  },
]

export default function Signatures() {
  return (
    <section id="menu" className="relative bg-dark py-24 lg:py-32" aria-labelledby="sig-title">
      <div className="mx-auto max-w-[82rem] px-5 lg:px-10">
        <Reveal className="flex flex-col items-center text-center">
          <Eyebrow>Our signatures</Eyebrow>
          <h2 id="sig-title" className="display mt-5 text-[clamp(1.9rem,3.6vw,3rem)] font-normal text-cream">
            Tradition, thoughtfully served.
          </h2>
          <Ornament className="mt-5" />
          <p className="mt-6 max-w-md text-[0.9rem] leading-[1.75] text-cream/75">
            A short list of the dishes we are known for. Prices shown are eat-in, in taka.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-x-14 gap-y-14 lg:grid-cols-3">
          {COURSES.map((course, ci) => (
            <Reveal key={course.heading} delay={ci * 0.1}>
              <section aria-labelledby={`course-${ci}`}>
                <header className="flex items-baseline justify-between gap-3 border-b border-gold-deep/35 pb-3">
                  <h3 id={`course-${ci}`} className="display text-[1.35rem] text-gold">
                    {course.heading}
                  </h3>
                  <span lang="bn" className="font-bn text-[0.8rem] text-cream/60">
                    {course.bn}
                  </span>
                </header>

                <ul className="mt-6 space-y-6">
                  {course.items.map((item) => (
                    <li key={item.name}>
                      <div className="flex items-baseline gap-3">
                        <h4 className="display text-[1.05rem] leading-snug text-cream">{item.name}</h4>
                        <span aria-hidden className="h-px flex-1 translate-y-[-2px] bg-cream/15" />
                        {/* Numerals stay on the body face — Rottering has no digit glyphs. */}
                        <span className="text-[0.85rem] tabular-nums text-gold-deep">{item.price}</span>
                      </div>
                      <p lang="bn" className="font-bn mt-1 text-[0.8rem] text-gold/70">
                        {item.bn}
                      </p>
                      <p className="mt-1.5 max-w-[26ch] text-[0.78rem] leading-[1.65] text-cream/70">{item.note}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-16 flex justify-center">
          <GoldButton href="#reservations">See the full menu</GoldButton>
        </Reveal>
      </div>
    </section>
  )
}
