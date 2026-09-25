import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { nav, site } from '../data/site'
import { useApp } from '../lib/app-context'
import { gsap, lockScroll, ScrollTrigger, useGSAP } from '../lib/motion'
import { Img, Magnetic, TLink } from './primitives'

export function Logo() {
  return (
    <TLink to="/" className="logo" aria-label={`${site.name} home`}>
      <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden>
        <path d="M20 3 37 36H3Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M20 14 29 32H11Z" fill="currentColor" />
      </svg>
      <span className="logo__text">
        {site.short}
        <small>ESTATES</small>
      </span>
    </TLink>
  )
}

export function Header() {
  const { openEnquiry } = useApp()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [preview, setPreview] = useState(0)
  const overlay = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline>(null)

  // solid background once scrolled, hide on scroll-down / show on scroll-up
  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate(self) {
        const y = self.scroll()
        setScrolled(y > 60)
        setHidden(self.direction === 1 && y > 400)
      },
    })
  })

  // full-screen menu timeline
  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true, onReverseComplete: () => gsap.set(overlay.current, { visibility: 'hidden' }) })
        .set(overlay.current, { visibility: 'visible' })
        .fromTo(
          overlay.current,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' },
        )
        .from('.menu__link-text', { yPercent: 115, stagger: 0.06, duration: 0.9, ease: 'expo.out' }, '-=0.35')
        .from('.menu__preview', { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, '<')
        .from('.menu__aside > *', { autoAlpha: 0, y: 24, stagger: 0.08, duration: 0.7 }, '<0.2')
    },
    { scope: overlay },
  )

  const mounted = useRef(false)
  useEffect(() => {
    if (!tl.current) return
    if (!mounted.current) {
      mounted.current = true
      return
    }
    if (open) {
      tl.current.timeScale(1).play()
    } else {
      tl.current.timeScale(1.6).reverse()
    }
    lockScroll(open)
  }, [open])

  // close menu on route change (adjusting state during render, per React docs)
  const routeKey = location.pathname + location.search
  const [lastRoute, setLastRoute] = useState(routeKey)
  if (routeKey !== lastRoute) {
    setLastRoute(routeKey)
    setOpen(false)
  }

  const inline = nav.filter((n) => ['Our Legacy', 'All Properties', 'Contact'].includes(n.label))

  return (
    <>
      <header className={`header ${scrolled ? 'is-scrolled' : ''} ${hidden && !open ? 'is-hidden' : ''} ${open ? 'is-open' : ''}`}>
        <div className="header__inner container">
          <Logo />
          <nav className="header__nav" aria-label="Primary">
            {inline.map((n) => (
              <TLink key={n.to} to={n.to} className="header__link">
                <span data-text={n.label === 'All Properties' ? 'Properties' : n.label}>
                  {n.label === 'All Properties' ? 'Properties' : n.label}
                </span>
              </TLink>
            ))}
          </nav>
          <div className="header__actions">
            <a className="header__phone" href={`tel:${site.phone.replace(/\s/g, '')}`}>
              {site.phone}
            </a>
            <Magnetic strength={0.25}>
              <button className="btn btn--gold btn--sm" onClick={() => openEnquiry()}>
                Enquire now
              </button>
            </Magnetic>
            <button
              className={`burger ${open ? 'is-active' : ''}`}
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              <span className="burger__label">{open ? 'Close' : 'Menu'}</span>
              <span className="burger__lines">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div ref={overlay} className="menu" aria-hidden={!open}>
        <div className="menu__inner container">
          <ul className="menu__links">
            {nav.map((n, i) => (
              <li key={n.to} onMouseEnter={() => setPreview(i)}>
                <TLink to={n.to} className="menu__link" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
                  <span className="menu__link-mask">
                    <span className="menu__link-text">
                      <sup>0{i + 1}</sup>
                      {n.label}
                    </span>
                  </span>
                </TLink>
              </li>
            ))}
          </ul>
          <div className="menu__preview">
            {nav.map((n, i) => (
              <Img key={n.to} src={n.image} alt="" className={i === preview ? 'is-active' : ''} />
            ))}
          </div>
          <div className="menu__aside">
            <div>
              <h4>Visit us</h4>
              <p>{site.address}</p>
            </div>
            <div>
              <h4>Talk to us</h4>
              <p>
                <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>
                <br />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </p>
            </div>
            <div className="menu__socials">
              {site.socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
