import { useRef } from 'react'
import { site } from '../data/site'
import { gsap, lockScroll, prefersReducedMotion, useGSAP } from '../lib/motion'

/**
 * First-load intro: brand letters rise, counter runs to 100, then five
 * columns slide away to uncover the hero.
 */
export function Preloader({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        onReveal()
        onDone()
        return
      }
      lockScroll(true)
      const n = { v: 0 }
      const tl = gsap.timeline({
        onComplete: () => {
          lockScroll(false)
          onDone()
        },
      })
      tl.from('.preloader__brand .ch', { yPercent: 120, stagger: 0.05, duration: 1.1, ease: 'expo.out' })
        .from('.preloader__tag', { autoAlpha: 0, y: 10, duration: 0.8 }, 0.4)
        .to(
          n,
          {
            v: 100,
            duration: 2.2,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(n.v)).padStart(3, '0')
            },
          },
          0,
        )
        .to('.preloader__bar i', { scaleX: 1, duration: 2.2, ease: 'power2.inOut' }, 0)
        .to('.preloader__content', { yPercent: -30, autoAlpha: 0, duration: 0.7, ease: 'power3.in' })
        .to('.preloader__col', { yPercent: -100, stagger: 0.07, duration: 1.1, ease: 'expo.inOut' }, '-=0.25')
        .call(onReveal, [], '-=0.9')
    },
    { scope: root },
  )

  return (
    <div ref={root} className="preloader" aria-hidden>
      <div className="preloader__cols">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="preloader__col" />
        ))}
      </div>
      <div className="preloader__content">
        <div className="preloader__brand">
          {site.short.split('').map((c, i) => (
            <span key={i} className="ch">
              {c}
            </span>
          ))}
        </div>
        <p className="preloader__tag">{site.tagline}</p>
        <div className="preloader__meta">
          <div className="preloader__bar">
            <i />
          </div>
          <span ref={count} className="preloader__count">
            000
          </span>
        </div>
      </div>
    </div>
  )
}
