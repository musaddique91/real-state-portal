import { useRef } from 'react'
import { A11y, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { featured, projects } from '../data/projects'
import { img, pillars, site, testimonials } from '../data/site'
import { gsap, prefersReducedMotion, SplitText, useGSAP } from '../lib/motion'
import { Arrow, Counter, Eyebrow, Img, Reveal, RevealImage, SplitReveal, TLink } from '../components/primitives'

/* (01) Intro — statement text that "fills in" word by word as you scroll -- */
export function Intro() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion) return
      SplitText.create('.intro__statement', {
        type: 'words',
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.words,
            { opacity: 0.12 },
            {
              opacity: 1,
              stagger: 0.1,
              ease: 'none',
              scrollTrigger: { trigger: '.intro__statement', start: 'top 80%', end: 'bottom 40%', scrub: true },
            },
          )
        },
      })
      gsap.to('.intro__small', {
        yPercent: -35,
        ease: 'none',
        scrollTrigger: { trigger: '.intro__media', start: 'top bottom', end: 'bottom top', scrub: true },
      })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="intro section">
      <div className="container">
        <Eyebrow index="01">Our legacy</Eyebrow>
        <p className="intro__statement">
          For nearly four decades we have been building more than structures — we build neighbourhoods, livelihoods and the
          quiet confidence of knowing your home was made right.
        </p>
        <div className="intro__grid">
          <div className="intro__media">
            <RevealImage className="intro__big" src={img('1600585154340-be6161a56a0c', 1600)} alt="Aurum residence facade" />
            <div className="intro__small">
              <RevealImage src={img('1600210492486-724fe5c67fb0', 900)} alt="Living room interior" from="left" parallax={false} />
            </div>
          </div>
          <Reveal className="intro__text" selector=".r">
            <p className="r lead">
              Founded in {site.founded}, {site.name} has grown from a single residential building into one of the most
              trusted developers in the country.
            </p>
            <p className="r">
              Every project is guided by the same simple belief our founder started with: build it as if your own family were
              going to live there. That is why more than 35,000 families have chosen an Aurum address.
            </p>
            <TLink to="/legacy" className="r link-arrow">
              Discover our story <Arrow />
            </TLink>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* Stats ------------------------------------------------------------------- */
export function Stats() {
  return (
    <section className="stats">
      <Reveal className="container stats__grid" selector=".stat">
        {site.stats.map((s) => (
          <div key={s.label} className="stat">
            <span className="stat__value">
              <Counter value={s.value} suffix={s.suffix} />
            </span>
            <span className="stat__label">{s.label}</span>
          </div>
        ))}
      </Reveal>
    </section>
  )
}

/* (02) Featured — pinned horizontal scroll gallery ------------------------ */
export function FeaturedProjects() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion) return
      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px)', () => {
        const track = ref.current!.querySelector<HTMLElement>('.hscroll__track')!
        const distance = () => track.scrollWidth - window.innerWidth
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.hscroll',
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        gsap.to('.hscroll__progress i', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.hscroll', start: 'top top', end: () => `+=${distance()}`, scrub: true },
        })
        // images drift inside their frames while the track moves
        gsap.utils.toArray<HTMLElement>('.hcard__media img').forEach((el) => {
          gsap.fromTo(
            el,
            { xPercent: -12 },
            {
              xPercent: 12,
              ease: 'none',
              scrollTrigger: { trigger: el, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
            },
          )
        })
      })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="featured">
      <div className="hscroll">
        <div className="hscroll__track">
          <div className="hscroll__intro">
            <Eyebrow index="02">Signature projects</Eyebrow>
            <SplitReveal className="h-display">Landmarks in the making.</SplitReveal>
            <p>Swipe through a few of the addresses we are proudest of — from sea-facing towers to private villas.</p>
            <TLink to="/properties" className="link-arrow">
              View all {projects.length} projects <Arrow />
            </TLink>
          </div>
          {featured.map((p, i) => (
            <TLink key={p.slug} to={`/properties/${p.slug}`} className="hcard" data-cursor="View">
              <div className="hcard__media">
                <Img src={p.hero.replace('w=2000', 'w=1400')} alt={p.name} />
              </div>
              <div className="hcard__body">
                <span className="hcard__index">
                  {String(i + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}
                </span>
                <h3>{p.name}</h3>
                <p>
                  {p.location}, {p.city} · {p.config}
                </p>
              </div>
              <span className={`badge badge--${p.status.toLowerCase()}`}>{p.status}</span>
            </TLink>
          ))}
        </div>
        <div className="hscroll__progress" aria-hidden>
          <i />
        </div>
      </div>
    </section>
  )
}

/* Residential / Commercial split panels ----------------------------------- */
export function Categories() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion) return
      gsap.from('.cat', {
        clipPath: (i: number) => (i === 0 ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)'),
        duration: 1.6,
        ease: 'expo.inOut',
        stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
      })
    },
    { scope: ref },
  )
  const count = (t: string) => projects.filter((p) => p.type === t).length
  const cats = [
    { type: 'Residential', text: 'Homes crafted for generations', image: img('1600607687939-ce8a6c25118c', 1600) },
    { type: 'Commercial', text: 'Addresses that mean business', image: img('1486406146926-c627a92ad1ab', 1600) },
  ]
  return (
    <section ref={ref} className="categories section">
      <div className="container">
        <Eyebrow index="03">What we build</Eyebrow>
        <div className="categories__grid">
          {cats.map((c) => (
            <TLink key={c.type} to={`/properties?type=${c.type}`} className="cat" data-cursor="Explore">
              <Img src={c.image} alt={c.type} />
              <div className="cat__shade" />
              <div className="cat__body">
                <span className="cat__count">{String(count(c.type)).padStart(2, '0')} projects</span>
                <h3>{c.type}</h3>
                <p>{c.text}</p>
                <span className="cat__cta">
                  Explore <Arrow />
                </span>
              </div>
            </TLink>
          ))}
        </div>
      </div>
    </section>
  )
}

/* Full-bleed parallax quote ----------------------------------------------- */
export function ParallaxQuote() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion) return
      gsap.fromTo(
        '.pquote__media',
        { yPercent: -15 },
        { yPercent: 15, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
    },
    { scope: ref },
  )
  return (
    <section ref={ref} className="pquote">
      <div className="pquote__media">
        <Img src={img('1512917774080-9991f1c4c750', 2200)} alt="" />
      </div>
      <div className="pquote__shade" />
      <div className="container pquote__content">
        <SplitReveal as="p" by="words" className="pquote__text">
          “We don’t just hand over keys. We hand over a promise that lasts a lifetime.”
        </SplitReveal>
        <Reveal>
          <p className="pquote__by">— Founder, {site.name}</p>
        </Reveal>
      </div>
    </section>
  )
}

/* (04) Pillars — sticky stacking cards ------------------------------------ */
export function Pillars() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion) return
      const cards = gsap.utils.toArray<HTMLElement>('.pillar')
      cards.forEach((card, i) => {
        const next = cards[i + 1]
        if (!next) return
        gsap.to(card, {
          scale: 0.88,
          filter: 'brightness(0.55)',
          ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 18%', scrub: true },
        })
      })
    },
    { scope: ref },
  )
  return (
    <section ref={ref} className="pillars section">
      <div className="container">
        <div className="pillars__head">
          <Eyebrow index="04">The Aurum promise</Eyebrow>
          <SplitReveal className="h-display">Four things we never compromise on.</SplitReveal>
        </div>
        <div className="pillars__stack">
          {pillars.map((p, i) => (
            <article key={p.title} className="pillar" style={{ top: `calc(12vh + ${i * 24}px)` }}>
              <div className="pillar__media">
                <Img src={p.image} alt={p.title} />
              </div>
              <div className="pillar__body">
                <span className="pillar__num">0{i + 1}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* (05) Testimonials slider ------------------------------------------------ */
export function Testimonials() {
  return (
    <section className="testimonials section">
      <div className="container">
        <div className="testimonials__head">
          <div>
            <Eyebrow index="05">Stories from home</Eyebrow>
            <SplitReveal className="h-display">Trusted by 35,000+ families.</SplitReveal>
          </div>
          <div className="slider-nav">
            <button className="slider-nav__btn t-prev" aria-label="Previous">
              <Arrow className="arrow--flip" />
            </button>
            <button className="slider-nav__btn t-next" aria-label="Next">
              <Arrow />
            </button>
          </div>
        </div>
        <Reveal>
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={24}
            slidesPerView={1.1}
            grabCursor
            speed={900}
            navigation={{ prevEl: '.t-prev', nextEl: '.t-next' }}
            pagination={{ type: 'progressbar' }}
            breakpoints={{ 700: { slidesPerView: 1.6 }, 1100: { slidesPerView: 2.3 } }}
            className="testimonials__swiper"
            data-cursor="Drag"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.name}>
                <figure className="quote-card">
                  <span className="quote-card__mark" aria-hidden>
                    “
                  </span>
                  <blockquote>{t.quote}</blockquote>
                  <figcaption>
                    <Img src={t.photo} alt="" />
                    <span>
                      <strong>{t.name}</strong>
                      {t.role}
                    </span>
                  </figcaption>
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>
        </Reveal>
      </div>
    </section>
  )
}
