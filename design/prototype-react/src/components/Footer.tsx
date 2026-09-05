import { Ornament } from './primitives'

const COLUMNS = [
  { title: 'Explore', links: [['Home', '#home'], ['Our Story', '#story'], ['The Feast', '#feast'], ['Menu', '#menu']] },
  { title: 'Visit', links: [['Reservations', '#reservations'], ['Order on WhatsApp', 'https://wa.me/8801711223344'], ['Call us', 'tel:+8801711223344']] },
  { title: 'Legal', links: [['FAQ', '#faq'], ['Privacy', '#'], ['Terms', '#']] },
]

export default function Footer() {
  return (
    <footer className="border-t border-gold-deep/20 bg-dark pt-16 pb-8" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Site footer
      </h2>
      <div className="mx-auto max-w-[82rem] px-5 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <img src="/images/logo-with-wordmark-dark.svg" alt="Ghoroa" className="h-14 w-auto" width="200" height="56" />
            <p className="mt-5 max-w-xs text-[0.85rem] leading-[1.75] text-cream/75">
              Bangladeshi home cooking, served the way it was meant to be — unhurried, generous, and full of memory.
            </p>
            <Ornament className="mt-6" />
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">{col.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <a href={href} className="text-[0.85rem] text-cream/70 transition-colors hover:text-gold">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-6 sm:flex-row">
          <p className="text-[0.72rem] text-cream/60">© {new Date().getFullYear()} Ghoroa. All rights reserved.</p>
          <ul className="flex gap-5">
            {[['Instagram', 'https://instagram.com'], ['Facebook', 'https://facebook.com']].map(([label, href]) => (
              <li key={label}>
                <a href={href} className="text-[0.72rem] uppercase tracking-[0.14em] text-cream/70 transition-colors hover:text-gold">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
