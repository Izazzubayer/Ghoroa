import { useEffect } from 'react'
import Lenis from 'lenis'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Story from './components/Story'
import Signatures from './components/Signatures'
import Faq from './components/Faq'
import Feast from './components/Feast'
import Reserve from './components/Reserve'
import Footer from './components/Footer'

export default function App() {
  useEffect(() => {
    // Skip inertial scrolling entirely for users who ask for reduced motion.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // Keep in-page anchors working while Lenis owns the scroll position.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      const id = link?.getAttribute('href')
      if (!id || id === '#') return
      const target = document.querySelector(id)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: -72 })
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <a href="#home" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <Story />
        <Feast />
        <Signatures />
        <Faq />
        <Reserve />
      </main>
      <Footer />
    </>
  )
}
