import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { A11y, Keyboard, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { PageHero, ProjectCard } from '../components/blocks'
import { EnquiryForm } from '../components/EnquiryForm'
import { Arrow, Eyebrow, Img, Reveal, RevealImage, SplitReveal, TLink } from '../components/primitives'
import { getProject, projects } from '../data/projects'
import { useApp } from '../lib/app-context'
import { getLenis, gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '../lib/motion'
import { FloorPlansSection, MasterLayoutSection } from '../sections/ProjectPlans'
import NotFound from './NotFound'

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'layout', label: 'Master layout' },
  { id: 'plans', label: 'Floor plans' },
  { id: 'location', label: 'Location' },
  { id: 'enquire', label: 'Enquire' },
]

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = getProject(slug)
  const { openEnquiry } = useApp()
  const root = useRef<HTMLDivElement>(null)
  const [section, setSection] = useState('overview')

  useGSAP(
    () => {
      if (!project) return
      SECTIONS.forEach((s) => {
        ScrollTrigger.create({
          trigger: `#${s.id}`,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => self.isActive && setSection(s.id),
        })
      })
      if (prefersReducedMotion) return
      gsap.from('.amenity', {
        y: 40,
        autoAlpha: 0,
        stagger: { each: 0.05, grid: 'auto', from: 'start' },
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.amenities__grid', start: 'top 85%', once: true },
      })
      gsap.from('.highlight', {
        x: -40,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.highlights__list', start: 'top 85%', once: true },
      })
    },
    { scope: root, dependencies: [slug] },
  )

  if (!project) return <NotFound />

  const jump = (id: string) => {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(`#${id}`, { offset: -120, duration: 1.4 })
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const facts = [
    ['Configuration', project.config],
    ['Carpet area', project.area],
    ['Starting price', project.price],
    ['Status', project.status],
    ['Location', `${project.location}, ${project.city}`],
    ['RERA No.', project.rera],
  ]
  const similar = projects.filter((p) => p.slug !== project.slug && p.type === project.type).slice(0, 3)

  return (
    <div ref={root}>
      <PageHero eyebrow={`${project.type} · ${project.status}`} title={project.name} image={project.hero} tall>
        <p className="phero__sub">
          {project.tagline} — {project.location}, {project.city}
        </p>
        <div className="phero__actions">
          <button className="btn btn--gold" onClick={() => openEnquiry(project.name)}>
            Enquire now <Arrow />
          </button>
          <button className="btn btn--ghost" onClick={() => openEnquiry(project.name)}>
            Download brochure
          </button>
        </div>
      </PageHero>

      <nav className="subnav" aria-label="Project sections">
        <div className="container subnav__inner">
          {SECTIONS.map((s) => (
            <button key={s.id} className={section === s.id ? 'is-active' : ''} onClick={() => jump(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      <section id="overview" className="overview section">
        <div className="container overview__grid">
          <div>
            <Eyebrow index="01">Overview</Eyebrow>
            <SplitReveal className="h-display">{project.tagline}.</SplitReveal>
            <Reveal>
              <p className="lead">{project.description}</p>
            </Reveal>
          </div>
          <Reveal className="facts" selector=".fact">
            {facts.map(([k, v]) => (
              <div key={k} className="fact">
                <span>{k}</span>
                <strong>{v}</strong>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="highlights" className="highlights section">
        <div className="container highlights__grid">
          <RevealImage className="highlights__media" src={project.gallery[1] ?? project.hero} alt={`${project.name} interior`} />
          <div>
            <Eyebrow index="02">Highlights</Eyebrow>
            <SplitReveal className="h-display">Why you’ll love it here.</SplitReveal>
            <ul className="highlights__list">
              {project.highlights.map((h, i) => (
                <li key={h} className="highlight">
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="gallery" className="gallery section">
        <div className="container">
          <div className="section-head section-head--row">
            <div>
              <Eyebrow index="03">Gallery</Eyebrow>
              <SplitReveal className="h-display">A closer look.</SplitReveal>
            </div>
            <div className="slider-nav">
              <button className="slider-nav__btn g-prev" aria-label="Previous image">
                <Arrow className="arrow--flip" />
              </button>
              <button className="slider-nav__btn g-next" aria-label="Next image">
                <Arrow />
              </button>
            </div>
          </div>
        </div>
        <Reveal>
          <Swiper
            modules={[Navigation, Keyboard, A11y]}
            centeredSlides
            loop={project.gallery.length > 3}
            slidesPerView={1.15}
            spaceBetween={16}
            speed={1000}
            keyboard
            grabCursor
            navigation={{ prevEl: '.g-prev', nextEl: '.g-next' }}
            breakpoints={{ 800: { slidesPerView: 1.6, spaceBetween: 32 } }}
            className="gallery__swiper"
            data-cursor="Drag"
          >
            {project.gallery.map((src, i) => (
              <SwiperSlide key={src + i}>
                <div className="gallery__slide">
                  <Img src={src} alt={`${project.name} image ${i + 1}`} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Reveal>
      </section>

      <section id="amenities" className="amenities section">
        <div className="container">
          <div className="section-head">
            <Eyebrow index="04">Amenities</Eyebrow>
            <SplitReveal className="h-display">Everything, within reach.</SplitReveal>
          </div>
          <div className="amenities__grid">
            {project.amenities.map((a, i) => (
              <div key={a} className="amenity">
                <span className="amenity__icon" aria-hidden>
                  <svg viewBox="0 0 24 24" width="26" height="26">
                    <path d="M12 2 22 12 12 22 2 12Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>
                </span>
                <span className="amenity__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="amenity__name">{a}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MasterLayoutSection project={project} />
      <FloorPlansSection project={project} />

      <section id="location" className="location section">
        <div className="container">
          <div className="section-head">
            <Eyebrow index="07">Location</Eyebrow>
            <SplitReveal className="h-display">
              {project.location}, {project.city}.
            </SplitReveal>
          </div>
          <Reveal className="map">
            <iframe
              title={`${project.name} location map`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(`${project.location}, ${project.city}`)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>

      <section id="enquire" className="enquire section">
        <div className="container enquire__grid">
          <div>
            <Eyebrow index="08">Enquire</Eyebrow>
            <SplitReveal className="h-display">Visit {project.name}.</SplitReveal>
            <p className="lead">Tell us a little about what you’re looking for and we’ll set up a private site visit.</p>
          </div>
          <Reveal>
            <EnquiryForm project={project.name} />
          </Reveal>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="similar section">
          <div className="container">
            <div className="section-head section-head--row">
              <div>
                <Eyebrow>You may also like</Eyebrow>
                <SplitReveal className="h-display">More {project.type.toLowerCase()} projects.</SplitReveal>
              </div>
              <TLink to={`/properties?type=${project.type}`} className="link-arrow">
                View all <Arrow />
              </TLink>
            </div>
            <Reveal className="grid" selector=".pcard">
              {similar.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </Reveal>
          </div>
        </section>
      )}
    </div>
  )
}
