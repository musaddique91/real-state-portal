import { useRef, useState } from 'react'
import { Autoplay, EffectFade } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { featured } from '../data/projects'
import { site } from '../data/site'
import { useApp } from '../lib/app-context'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/motion'
import { Arrow, Img, Magnetic, SplitReveal, TLink } from '../components/primitives'

const slides = featured.slice(0, 4)

/**
 * Full-screen cross-fading slider with Ken Burns zoom, masked headline
 * reveal, per-slide caption animation and autoplay progress pager.
 */
export function Hero() {
  const { ready, openEnquiry } = useApp()
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [swiper, setSwiper] = useState<SwiperType>()

  // intro + scroll-out parallax
  useGSAP(
    () => {
      if (!ready || prefersReducedMotion) return
      gsap.from('.hero__slider', { scale: 1.25, duration: 2.4, ease: 'expo.out' })
      gsap.from('.hero__fade', { autoAlpha: 0, y: 40, stagger: 0.12, duration: 1.2, delay: 0.8, ease: 'power3.out' })
      gsap.from('.hero__pager', { autoAlpha: 0, x: 40, duration: 1.2, delay: 1.1, ease: 'power3.out' })

      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.hero__slider', { yPercent: 30, scale: 1.1, ease: 'none', scrollTrigger: st })
      gsap.to('.hero__content', { yPercent: -35, autoAlpha: 0, ease: 'none', scrollTrigger: { ...st, end: 'bottom 30%' } })
    },
    { scope: root, dependencies: [ready] },
  )

  // animate the per-slide caption each time the slide changes
  useGSAP(
    () => {
      if (prefersReducedMotion) return
      gsap.from('.hero__caption-line', { yPercent: 110, stagger: 0.08, duration: 1, ease: 'expo.out' })
    },
    { scope: root, dependencies: [active], revertOnUpdate: true },
  )

  const current = slides[active]

  return (
    <section ref={root} className="hero">
      <div className="hero__slider">
        <Swiper
          modules={[EffectFade, Autoplay]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1600}
          loop
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          onSwiper={setSwiper}
          onSlideChange={(s) => setActive(s.realIndex)}
          onAutoplayTimeLeft={(_, __, progress) => root.current?.style.setProperty('--progress', String(1 - progress))}
        >
          {slides.map((p, i) => (
            <SwiperSlide key={p.slug}>
              <div className="hero__media">
                <Img src={p.hero} alt={p.name} loading={i === 0 ? 'eager' : 'lazy'} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="hero__shade" />

      <div className="hero__content container">
        <p className="hero__fade eyebrow eyebrow--light">
          <span className="eyebrow__line" aria-hidden />
          Since {site.founded} · Pune · Mumbai · Bengaluru
        </p>
        <SplitReveal as="h1" className="hero__title" play={ready} scroll={false} delay={0.3}>
          Spaces that shape <em>the way</em> you live.
        </SplitReveal>
        <p className="hero__fade hero__lead">
          Premium residences and business addresses, crafted with care and delivered on time — for nearly four decades.
        </p>
        <div className="hero__fade hero__ctas">
          <Magnetic>
            <TLink to="/properties" className="btn btn--gold">
              Explore properties <Arrow />
            </TLink>
          </Magnetic>
          <Magnetic>
            <button className="btn btn--ghost" onClick={() => openEnquiry()}>
              Book a site visit
            </button>
          </Magnetic>
        </div>
      </div>

      <TLink to={`/properties/${current.slug}`} className="hero__caption" data-cursor="View">
        <span className="hero__caption-mask">
          <span className="hero__caption-line hero__caption-status">{current.status} · {current.type}</span>
        </span>
        <span className="hero__caption-mask">
          <span className="hero__caption-line hero__caption-name">{current.name}</span>
        </span>
        <span className="hero__caption-mask">
          <span className="hero__caption-line hero__caption-loc">
            {current.location}, {current.city} <Arrow />
          </span>
        </span>
      </TLink>

      <div className="hero__pager" role="tablist" aria-label="Featured projects">
        {slides.map((p, i) => (
          <button
            key={p.slug}
            role="tab"
            aria-selected={i === active}
            className={`hero__pager-item ${i === active ? 'is-active' : ''}`}
            onClick={() => swiper?.slideToLoop(i)}
          >
            <span className="hero__pager-num">0{i + 1}</span>
            <span className="hero__pager-bar">
              <i />
            </span>
            <span className="hero__pager-name">{p.name}</span>
          </button>
        ))}
      </div>

      <div className="scroll-hint hero__fade" aria-hidden>
        <span>Scroll</span>
        <i />
      </div>
    </section>
  )
}
