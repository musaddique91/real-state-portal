import { useRef, useState, type AnchorHTMLAttributes, type ImgHTMLAttributes, type ReactNode } from 'react'
import { useApp } from '../lib/app-context'
import { gsap, isTouch, prefersReducedMotion, ScrollTrigger, SplitText, useGSAP } from '../lib/motion'

/* ------------------------------------------------------------------ */
/* TLink – an <a> that plays the curtain page transition               */
/* ------------------------------------------------------------------ */
type TLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }

export function TLink({ to, onClick, children, ...rest }: TLinkProps) {
  const { go } = useApp()
  return (
    <a
      href={to}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        go(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}

/* ------------------------------------------------------------------ */
/* Img – lazy image with a graceful gradient fallback                  */
/* ------------------------------------------------------------------ */
export function Img({ className = '', alt = '', ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false)
  if (failed) return <div className={`img-fallback ${className}`} role="img" aria-label={alt} />
  return <img className={className} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} {...rest} />
}

/* ------------------------------------------------------------------ */
/* SplitReveal – masked line / word / char reveal (GSAP SplitText)     */
/* ------------------------------------------------------------------ */
type SplitProps = {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div' | 'span'
  children: ReactNode
  className?: string
  /** false keeps the text hidden (e.g. until the preloader finishes) */
  play?: boolean
  delay?: number
  /** trigger when scrolled into view (default) or immediately */
  scroll?: boolean
  by?: 'lines' | 'words' | 'chars'
}

export function SplitReveal({ as = 'h2', children, className, play = true, delay = 0, scroll = true, by = 'lines' }: SplitProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  const Tag = as as 'h2'

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      if (prefersReducedMotion) return gsap.set(el, { visibility: 'visible' })
      if (!play) return
      gsap.set(el, { visibility: 'visible' })
      SplitText.create(el, {
        type: by === 'lines' ? 'lines' : `lines,${by}`,
        mask: 'lines',
        autoSplit: true,
        onSplit(self) {
          const targets = by === 'lines' ? self.lines : by === 'words' ? self.words : self.chars
          return gsap.from(targets, {
            yPercent: 120,
            rotate: by === 'chars' ? 8 : 2,
            duration: 1.3,
            ease: 'expo.out',
            stagger: by === 'chars' ? 0.03 : by === 'words' ? 0.05 : 0.1,
            delay,
            scrollTrigger: scroll ? { trigger: el, start: 'top 90%', once: true } : undefined,
          })
        },
      })
    },
    { dependencies: [play], scope: ref },
  )

  return (
    <Tag ref={ref} className={`split ${className ?? ''}`}>
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* Reveal – fade/slide up children when they enter the viewport        */
/* ------------------------------------------------------------------ */
type RevealProps = {
  children: ReactNode
  className?: string
  /** animate matching descendants in a stagger instead of the wrapper */
  selector?: string
  y?: number
  delay?: number
  stagger?: number
}

export function Reveal({ children, className, selector, y = 60, delay = 0, stagger = 0.12 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion || !ref.current) return
      const targets = selector ? ref.current.querySelectorAll(selector) : ref.current
      gsap.from(targets, {
        y,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay,
        stagger,
        scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
      })
    },
    { scope: ref },
  )
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* RevealImage – clip-path wipe + zoom-out, with scroll parallax       */
/* ------------------------------------------------------------------ */
type RevealImageProps = {
  src: string
  alt: string
  className?: string
  parallax?: boolean
  from?: 'bottom' | 'left' | 'right' | 'top'
  eager?: boolean
}

const clipFrom = {
  bottom: 'inset(100% 0% 0% 0%)',
  top: 'inset(0% 0% 100% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
}

export function RevealImage({ src, alt, className = '', parallax = true, from = 'bottom', eager }: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion) return
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
      tl.fromTo(el, { clipPath: clipFrom[from] }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' })
      tl.from('.reveal-img__media', { scale: 1.4, duration: 1.8, ease: 'expo.out' }, 0.2)
      if (parallax) {
        gsap.fromTo(
          '.reveal-img__inner',
          { yPercent: -8 },
          { yPercent: 8, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      }
    },
    { scope: ref },
  )
  return (
    <div ref={ref} className={`reveal-img ${className}`}>
      <div className={`reveal-img__inner ${parallax ? 'is-parallax' : ''}`}>
        <Img className="reveal-img__media" src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Counter – numbers count up once in view                             */
/* ------------------------------------------------------------------ */
export function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const fmt = (n: number) => Math.round(n).toLocaleString('en-IN') + suffix
  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion) return
      const obj = { v: 0 }
      el.textContent = fmt(0)
      gsap.to(obj, {
        v: value,
        duration: 2.4,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        onUpdate: () => {
          el.textContent = fmt(obj.v)
        },
      })
    },
    { scope: ref },
  )
  return <span ref={ref}>{fmt(value)}</span>
}

/* ------------------------------------------------------------------ */
/* Magnetic – element gently follows the cursor                        */
/* ------------------------------------------------------------------ */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const el = ref.current
      if (!el || isTouch || prefersReducedMotion) return
      const xTo = gsap.quickTo(el, 'x', { duration: 1, ease: 'elastic.out(1, 0.35)' })
      const yTo = gsap.quickTo(el, 'y', { duration: 1, ease: 'elastic.out(1, 0.35)' })
      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - (r.left + r.width / 2)) * strength)
        yTo((e.clientY - (r.top + r.height / 2)) * strength)
      }
      const leave = () => {
        xTo(0)
        yTo(0)
      }
      el.addEventListener('mousemove', move)
      el.addEventListener('mouseleave', leave)
      return () => {
        el.removeEventListener('mousemove', move)
        el.removeEventListener('mouseleave', leave)
      }
    },
    { scope: ref },
  )
  return (
    <div ref={ref} className={`magnetic ${className ?? ''}`}>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Marquee – infinite ticker that speeds up with scroll velocity       */
/* ------------------------------------------------------------------ */
export function Marquee({ items, duration = 30, className = '' }: { items: string[]; duration?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion) return
      const loop = gsap.to('.marquee__track', { xPercent: -50, ease: 'none', duration, repeat: -1 })
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate(self) {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 5)
          gsap.to(loop, { timeScale: boost, duration: 0.15, overwrite: true })
          gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.15, ease: 'power2.out' })
        },
      })
    },
    { scope: ref },
  )
  const row = (
    <div className="marquee__group">
      {items.map((t, i) => (
        <span key={i} className="marquee__item">
          {t}
          <span className="marquee__star" aria-hidden>
            ✦
          </span>
        </span>
      ))}
    </div>
  )
  return (
    <div ref={ref} className={`marquee ${className}`} aria-label={items.join(', ')}>
      <div className="marquee__track" aria-hidden>
        {row}
        {row}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Arrow icon + section label helpers                                  */
/* ------------------------------------------------------------------ */
export const Arrow = ({ className = '' }: { className?: string }) => (
  <svg className={`arrow ${className}`} viewBox="0 0 24 24" width="18" height="18" aria-hidden>
    <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

export const Eyebrow = ({ index, children, light }: { index?: string; children: ReactNode; light?: boolean }) => (
  <p className={`eyebrow ${light ? 'eyebrow--light' : ''}`}>
    {index && <span className="eyebrow__index">({index})</span>}
    <span className="eyebrow__line" aria-hidden />
    {children}
  </p>
)
