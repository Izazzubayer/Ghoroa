import { motion, useReducedMotion } from 'motion/react'
import { GoldButton } from './primitives'

const WORDS = ['Authentic flavours.', 'Timeless tradition.']

export default function Hero() {
  const reduced = useReducedMotion()

  return (
    <section id="home" className="relative isolate min-h-[100svh] overflow-hidden" aria-labelledby="hero-title">
      {/* Backdrop with slow Ken Burns drift */}
      <motion.img
        src="/images/biryani.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        initial={reduced ? undefined : { scale: 1.12 }}
        animate={reduced ? undefined : { scale: 1 }}
        transition={{ duration: 14, ease: 'linear' }}
        fetchPriority="high"
      />
      {/* Layered scrim: keeps headline + body copy above 4.5:1 over any part of the photo. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(96deg,rgba(6,15,10,0.97)_0%,rgba(6,15,10,0.93)_30%,rgba(6,15,10,0.7)_55%,rgba(6,15,10,0.45)_100%)]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-forest/25 mix-blend-multiply" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-52 bg-gradient-to-t from-dark to-transparent" />

      <div className="mx-auto flex min-h-[100svh] max-w-[82rem] flex-col justify-center px-5 pb-24 pt-32 lg:px-10">
        <div className="max-w-2xl">
          <motion.p
            initial={reduced ? undefined : { opacity: 0, y: 14 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-gold-deep"
          >
            <span aria-hidden className="h-px w-10 bg-gold-deep/60" />
            Bangladeshi heritage restaurant
          </motion.p>

          <h1 id="hero-title" className="display mt-6 text-[clamp(2.6rem,7vw,5.2rem)] font-normal leading-[0.98] text-cream">
            {WORDS.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={reduced ? undefined : { y: '110%' }}
                  animate={reduced ? undefined : { y: 0 }}
                  transition={{ duration: 1, delay: 0.25 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            initial={reduced ? undefined : { opacity: 0 }}
            animate={reduced ? undefined : { opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.7 }}
          >
            {/* Arched rule echoing the brand mark */}
            <svg aria-hidden width="150" height="12" viewBox="0 0 150 12" fill="none" className="mt-8 text-gold-deep">
              <path d="M0 11h56" stroke="currentColor" strokeWidth="1" opacity=".5" />
              <path d="M94 11h56" stroke="currentColor" strokeWidth="1" opacity=".5" />
              <path d="M63 11a12 12 0 0 1 24 0" stroke="currentColor" strokeWidth="1" />
              <path d="M75 1.5l2.6 3.4-2.6 3.4-2.6-3.4z" fill="currentColor" />
            </svg>

            <p className="mt-6 max-w-md text-[0.95rem] leading-[1.75] text-cream/90">
              Rooted in heritage. Made for today. Experience the true taste of Bangladesh in every bite.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <GoldButton href="#menu">Explore our menu</GoldButton>
              <a
                href="#story"
                className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-cream/70 underline-offset-8 transition-colors hover:text-gold hover:underline"
              >
                Our story
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* scroll cue */}
      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-gold-deep lg:flex"
        initial={reduced ? undefined : { opacity: 0 }}
        animate={reduced ? undefined : { opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <span className="text-[0.6rem] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          className="block h-10 w-px bg-gradient-to-b from-gold-deep to-transparent"
          animate={reduced ? undefined : { scaleY: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top' }}
        />
      </motion.div>
    </section>
  )
}
