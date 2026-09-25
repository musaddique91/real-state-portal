import { useRef } from 'react'
import { CtaBanner, PageHero } from '../components/blocks'
import { Eyebrow, Marquee, Reveal, RevealImage, SplitReveal } from '../components/primitives'
import { img, leaders, site, timeline } from '../data/site'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/motion'
import { Stats } from '../sections/HomeSections'

const values = [
  { title: 'Integrity', text: 'We say what we will do, and then we do it — in writing, on time.' },
  { title: 'Craft', text: 'Details matter. From the plinth to the paint, we sweat the small stuff.' },
  { title: 'Community', text: 'We build places where neighbours become friends and children grow up safe.' },
  { title: 'Responsibility', text: 'Green buildings, fair wages and zero-harm sites are non-negotiable.' },
]

function Timeline() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion) return
      gsap.from('.timeline__fill', {
        scaleY: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.timeline__list', start: 'top 60%', end: 'bottom 60%', scrub: true },
      })
      gsap.utils.toArray<HTMLElement>('.tl-item').forEach((item) => {
        gsap.from(item.querySelectorAll('.tl-item__year, .tl-item__body'), {
          autoAlpha: 0,
          x: item.classList.contains('is-right') ? 60 : -60,
          duration: 1.2,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 75%', once: true },
        })
        gsap.from(item.querySelector('.tl-item__dot'), {
          scale: 0,
          duration: 0.6,
          ease: 'back.out(3)',
          scrollTrigger: { trigger: item, start: 'top 62%', once: true },
        })
      })
    },
    { scope: ref },
  )
  return (
    <section ref={ref} className="timeline section">
      <div className="container">
        <div className="section-head">
          <Eyebrow index="02">Milestones</Eyebrow>
          <SplitReveal className="h-display">A journey measured in landmarks.</SplitReveal>
        </div>
        <div className="timeline__list">
          <div className="timeline__line">
            <i className="timeline__fill" />
          </div>
          {timeline.map((t, i) => (
            <div key={t.year} className={`tl-item ${i % 2 ? 'is-right' : ''}`}>
              <span className="tl-item__dot" />
              <span className="tl-item__year">{t.year}</span>
              <div className="tl-item__body">
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Legacy() {
  return (
    <>
      <PageHero eyebrow="Our legacy" title="Built on trust, since 1986." image={img('1486406146926-c627a92ad1ab', 2200)} />

      <section className="story section">
        <div className="container story__grid">
          <div>
            <Eyebrow index="01">Who we are</Eyebrow>
            <SplitReveal className="h-display">Four decades of turning land into legacy.</SplitReveal>
            <Reveal selector="p" className="story__text">
              <p className="lead">
                What began as one man’s promise to build honest homes in Pune has grown into {site.name} — a developer with
                more than 120 landmark projects across three cities.
              </p>
              <p>
                We design homes around the way families actually live, and offices around the way teams actually work. We
                deliver them on time, with clear paperwork and a maintenance team that stays with you for years after the
                keys are handed over.
              </p>
              <p>
                Today the second and third generations of the family lead the company — with the same obsession for quality
                and the same handshake-level trust our founder was known for.
              </p>
            </Reveal>
          </div>
          <div className="story__media">
            <RevealImage src={img('1600596542815-ffad4c1539a9', 1400)} alt="MaverickIgnite residence at dusk" />
            <RevealImage className="story__media-small" src={img('1497366811353-6870744d04b2', 900)} alt="MaverickIgnite office" from="right" />
          </div>
        </div>
      </section>

      <Stats />
      <Timeline />

      <Marquee items={['Integrity', 'Craft', 'Community', 'Responsibility', 'Transparency', 'On-time delivery']} />

      <section className="values section">
        <div className="container">
          <div className="section-head">
            <Eyebrow index="03">Our values</Eyebrow>
            <SplitReveal className="h-display">What guides every decision.</SplitReveal>
          </div>
          <Reveal className="values__grid" selector=".value">
            {values.map((v, i) => (
              <div key={v.title} className="value">
                <span className="value__num">0{i + 1}</span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="leaders section">
        <div className="container">
          <div className="section-head">
            <Eyebrow index="04">Leadership</Eyebrow>
            <SplitReveal className="h-display">The people behind the promise.</SplitReveal>
          </div>
          <div className="leaders__grid">
            {leaders.map((l, i) => (
              <div key={l.name} className="leader">
                <RevealImage src={l.photo} alt={l.name} from={i % 2 ? 'top' : 'bottom'} />
                <Reveal>
                  <h3>{l.name}</h3>
                  <p>{l.role}</p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
