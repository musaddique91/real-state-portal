import { useLayoutEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CtaBanner, PageHero, ProjectCard } from '../components/blocks'
import { projects } from '../data/projects'
import { img } from '../data/site'
import { Flip, gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '../lib/motion'
import { Reveal } from '../components/primitives'

const TYPES = ['All', 'Residential', 'Commercial']
const STATUSES = ['All', 'Ongoing', 'Completed', 'Upcoming']
const CITIES = ['All', 'Pune', 'Mumbai', 'Bengaluru']

type ChipsProps = { name: string; options: string[]; value: string; onSelect: (name: string, value: string) => void }

function Chips({ name, options, value, onSelect }: ChipsProps) {
  return (
    <div className="chips" role="group" aria-label={name}>
      {options.map((o) => (
        <button key={o} className={`chip ${o === value ? 'is-active' : ''}`} onClick={() => onSelect(name, o)} aria-pressed={o === value}>
          {o}
        </button>
      ))}
    </div>
  )
}

export default function Properties() {
  const [params, setParams] = useSearchParams()
  const type = params.get('type') ?? 'All'
  const status = params.get('status') ?? 'All'
  const city = params.get('city') ?? 'All'
  const grid = useRef<HTMLDivElement>(null)
  const flipState = useRef<Flip.FlipState>(null)

  const matches = (p: (typeof projects)[number]) =>
    (type === 'All' || p.type === type) && (status === 'All' || p.status === status) && (city === 'All' || p.city === city)
  const count = projects.filter(matches).length

  const update = (key: string, value: string) => {
    // capture positions before React re-renders, then animate with Flip
    if (grid.current && !prefersReducedMotion) flipState.current = Flip.getState(grid.current.querySelectorAll('.grid-item'))
    const next = new URLSearchParams(params)
    if (value === 'All') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  useLayoutEffect(() => {
    const state = flipState.current
    if (!state) return
    flipState.current = null
    Flip.from(state, {
      duration: 0.8,
      ease: 'power3.inOut',
      scale: true,
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.7, delay: 0.2 }),
      onComplete: () => ScrollTrigger.refresh(),
    })
  }, [type, status, city])

  useGSAP(
    () => {
      if (prefersReducedMotion) return
      gsap.from('.grid-item:not(.is-hidden)', {
        y: 80,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: grid.current, start: 'top 85%', once: true },
      })
    },
    { scope: grid },
  )

  return (
    <>
      <PageHero eyebrow="Our properties" title="Find the address that fits your life." image={img('1545324418-cc1a3fa10c00', 2200)} />

      <section className="listing section">
        <div className="container">
          <Reveal className="filters">
            <div className="filters__row">
              <span className="filters__label">Type</span>
              <Chips name="type" options={TYPES} value={type} onSelect={update} />
            </div>
            <div className="filters__row">
              <span className="filters__label">Status</span>
              <Chips name="status" options={STATUSES} value={status} onSelect={update} />
            </div>
            <div className="filters__row">
              <span className="filters__label">City</span>
              <Chips name="city" options={CITIES} value={city} onSelect={update} />
            </div>
            <p className="filters__count">
              Showing <strong>{String(count).padStart(2, '0')}</strong> of {projects.length} projects
            </p>
          </Reveal>

          <div ref={grid} className="grid">
            {projects.map((p, i) => (
              <div key={p.slug} className={`grid-item ${matches(p) ? '' : 'is-hidden'}`} data-flip-id={p.slug}>
                <ProjectCard project={p} index={i} />
              </div>
            ))}
          </div>
          {count === 0 && <p className="empty">No projects match these filters yet — try another combination.</p>}
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
