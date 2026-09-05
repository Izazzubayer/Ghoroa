import { useEffect, useRef, useState } from 'react'

const LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#story', label: 'Our Story' },
  { href: '#feast', label: 'The Feast' },
  { href: '#menu', label: 'Menu' },
  { href: '#reservations', label: 'Reservations' },
]

export default function Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#home')
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the section currently in view for the nav underline.
  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean) as Element[]
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(`#${visible.target.id}`)
      },
      { threshold: [0.35, 0.6] },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  // Close the mobile sheet on Escape and restore focus to the trigger.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid || open ? 'bg-dark/95 shadow-[0_1px_0_rgba(236,177,116,0.18)] backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[82rem] items-center justify-between gap-6 px-5 py-4 lg:px-10">
        <a href="#home" aria-label="Ghoroa — home" className="shrink-0">
          <img src="/images/logo-with-wordmark-dark.svg" alt="Ghoroa" className="h-12 w-auto" width="180" height="48" />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={active === l.href ? 'page' : undefined}
                  className={`relative py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
                    active === l.href ? 'text-gold' : 'text-cream/75 hover:text-gold'
                  }`}
                >
                  {l.label}
                  <span
                    aria-hidden
                    className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-300 ${
                      active === l.href ? 'w-full' : 'w-0'
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:+8801711223344"
            className="hidden border border-gold-deep/70 px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold transition-colors duration-300 hover:bg-gold hover:text-forest sm:inline-flex"
          >
            Book a table
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex h-10 w-10 items-center justify-center border border-gold-deep/50 text-gold lg:hidden"
          >
            <span aria-hidden className="text-base leading-none">{open ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        ref={panelRef}
        hidden={!open}
        className="border-t border-gold-deep/20 bg-dark/98 px-5 pb-8 pt-4 backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Mobile">
          <ul className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="display block border-b border-cream/10 py-3 text-xl text-cream hover:text-gold"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href="tel:+8801711223344"
          onClick={() => setOpen(false)}
          className="mt-5 inline-flex border border-gold-deep/70 px-5 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gold"
        >
          Book a table
        </a>
      </div>
    </header>
  )
}
