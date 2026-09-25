import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { FloatingActions } from './components/blocks'
import { Cursor } from './components/Cursor'
import { EnquiryModal } from './components/EnquiryForm'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Preloader } from './components/Preloader'
import { site } from './data/site'
import { AppContext } from './lib/app-context'
import { gsap, initSmoothScroll, lockScroll, prefersReducedMotion, scrollToTop, ScrollTrigger } from './lib/motion'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Legacy from './pages/Legacy'
import NotFound from './pages/NotFound'
import ProjectDetail from './pages/ProjectDetail'
import Properties from './pages/Properties'

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [enquiry, setEnquiry] = useState({ open: false, project: '' })
  const curtain = useRef<HTMLDivElement>(null)
  const transitioning = useRef(false)

  useEffect(() => {
    initSmoothScroll()
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  /* Page transition: curtain rises over the page, route changes, curtain leaves. */
  const go = useCallback(
    (to: string) => {
      const here = location.pathname + location.search
      if (to === here) {
        scrollToTop(false)
        return
      }
      if (transitioning.current) return
      if (prefersReducedMotion || !curtain.current) {
        navigate(to)
        return
      }
      transitioning.current = true
      lockScroll(true)
      gsap
        .timeline()
        .set(curtain.current, { visibility: 'visible' })
        .fromTo(curtain.current, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.inOut' })
        .fromTo('.curtain__brand', { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' }, '-=0.35')
        .call(() => navigate(to))
    },
    [location.pathname, location.search, navigate],
  )

  // runs after the new route has rendered
  useLayoutEffect(() => {
    scrollToTop()
    document.title =
      location.pathname === '/' ? `${site.name} | ${site.tagline}` : `${site.name} | ${location.pathname.split('/').pop()?.replace(/-/g, ' ')}`
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    if (transitioning.current && curtain.current) {
      gsap
        .timeline({
          delay: 0.15,
          onComplete: () => {
            transitioning.current = false
            gsap.set(curtain.current, { visibility: 'hidden' })
          },
        })
        .to('.curtain__brand', { yPercent: -100, autoAlpha: 0, duration: 0.4, ease: 'power3.in' })
        .to(curtain.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'expo.inOut' }, '-=0.1')
        .call(() => lockScroll(false), [], '-=0.6')
    }
    return () => cancelAnimationFrame(id)
  }, [location.pathname, location.search])

  const openEnquiry = useCallback((project = '') => setEnquiry({ open: true, project }), [])
  const closeEnquiry = useCallback(() => setEnquiry((e) => (e.open ? { ...e, open: false } : e)), [])
  const ctx = useMemo(() => ({ ready, go, openEnquiry }), [ready, go, openEnquiry])

  return (
    <AppContext.Provider value={ctx}>
      {loading && <Preloader onReveal={() => setReady(true)} onDone={() => setLoading(false)} />}
      <Cursor />
      <Header />
      <main>
        {/* keyed by path so every page remounts and replays its entrance animations */}
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/legacy" element={<Legacy />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:slug" element={<ProjectDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <FloatingActions />
      <EnquiryModal open={enquiry.open} project={enquiry.project} onClose={closeEnquiry} />
      <div ref={curtain} className="curtain" aria-hidden>
        <div className="curtain__brand">{site.short}</div>
      </div>
    </AppContext.Provider>
  )
}
