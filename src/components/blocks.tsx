import { useRef, type ReactNode } from 'react'
import type { Project } from '../data/projects'
import { img, site } from '../data/site'
import { useApp } from '../lib/app-context'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/motion'
import { Arrow, Eyebrow, Img, Magnetic, SplitReveal, TLink } from './primitives'

/* Project card used in grids ------------------------------------------------ */
export function ProjectCard({ project, index }: { project: Project; index?: number }) {
  return (
    <TLink to={`/properties/${project.slug}`} className="pcard" data-cursor="View">
      <div className="pcard__media">
        <Img src={project.hero.replace('w=2000', 'w=1000')} alt={project.name} />
        <span className={`badge badge--${project.status.toLowerCase()}`}>{project.status}</span>
      </div>
      <div className="pcard__body">
        <div>
          {index !== undefined && <span className="pcard__index">{String(index + 1).padStart(2, '0')}</span>}
          <h3 className="pcard__title">{project.name}</h3>
          <p className="pcard__meta">
            {project.location}, {project.city}
          </p>
        </div>
        <div className="pcard__info">
          <span>{project.config}</span>
          <span>{project.price}</span>
        </div>
        <span className="pcard__cta">
          Explore <Arrow />
        </span>
      </div>
    </TLink>
  )
}

/* Inner-page hero ----------------------------------------------------------- */
type PageHeroProps = {
  eyebrow: string
  title: ReactNode
  image: string
  children?: ReactNode
  tall?: boolean
}

export function PageHero({ eyebrow, title, image, children, tall }: PageHeroProps) {
  const { ready } = useApp()
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!ready || prefersReducedMotion) return
      gsap.from('.phero__media', { scale: 1.35, duration: 2.2, ease: 'expo.out', delay: 0.2 })
      gsap.from('.phero__fade', { autoAlpha: 0, y: 30, duration: 1.1, stagger: 0.12, delay: 0.7, ease: 'power3.out' })
      gsap.to('.phero__parallax', {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.phero__content', {
        yPercent: -40,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom 20%', scrub: true },
      })
    },
    { scope: ref, dependencies: [ready] },
  )

  return (
    <section ref={ref} className={`phero ${tall ? 'phero--tall' : ''}`}>
      <div className="phero__parallax">
        <Img className="phero__media" src={image} alt="" loading="eager" />
      </div>
      <div className="phero__shade" />
      <div className="phero__content container">
        <div className="phero__fade">
          <Eyebrow light>{eyebrow}</Eyebrow>
        </div>
        <SplitReveal as="h1" className="phero__title" play={ready} scroll={false} delay={0.35}>
          {title}
        </SplitReveal>
        {children && <div className="phero__fade phero__extra">{children}</div>}
      </div>
      <div className="scroll-hint phero__fade" aria-hidden>
        <span>Scroll</span>
        <i />
      </div>
    </section>
  )
}

/* Closing call-to-action ---------------------------------------------------- */
export function CtaBanner() {
  const { openEnquiry } = useApp()
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion) return
      gsap.fromTo(
        '.cta__media',
        { scale: 1.35 },
        { scale: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom bottom', scrub: true } },
      )
      gsap.fromTo(
        '.cta__frame',
        { clipPath: 'inset(12% 10% 12% 10% round 24px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top 90%', end: 'top 10%', scrub: true },
        },
      )
    },
    { scope: ref },
  )
  return (
    <section ref={ref} className="cta">
      <div className="cta__frame">
        <Img className="cta__media" src={img('1613490493576-7fde63acd811', 2000)} alt="" />
        <div className="cta__shade" />
        <div className="cta__content container">
          <Eyebrow light>Your next address</Eyebrow>
          <SplitReveal as="h2" className="cta__title">
            Find a home that feels like it was always yours.
          </SplitReveal>
          <Magnetic strength={0.4}>
            <button className="circle-btn" onClick={() => openEnquiry()} data-cursor="Enquire">
              <span>Book a visit</span>
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}

/* Floating WhatsApp + enquire side tab ------------------------------------- */
export function FloatingActions() {
  const { openEnquiry } = useApp()
  return (
    <>
      <button className="side-tab" onClick={() => openEnquiry()}>
        Enquire now
      </button>
      <a
        className="whatsapp"
        href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hi ${site.name}, I would like to know more about your projects.`)}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden>
          <path
            fill="currentColor"
            d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.6c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.2-.4A10.6 10.6 0 1 1 16 26.6Zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.8 5 2.1.9 3 1 4 .8.7-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4Z"
          />
        </svg>
      </a>
    </>
  )
}
