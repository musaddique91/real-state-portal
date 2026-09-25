import { useEffect, useRef, useState, type PointerEvent as RPointerEvent, type ReactNode } from 'react'
import type { Project } from '../data/projects'
import { useApp } from '../lib/app-context'
import { gsap, lockScroll, prefersReducedMotion, useGSAP } from '../lib/motion'
import { Arrow, Eyebrow, Img, SplitReveal } from '../components/primitives'
import { MasterLayoutDrawing, TypicalFloorDrawing, UnitPlanDrawing } from '../components/plan-drawings'
import { FLOOR_UNITS, LAYOUT_VIEWBOX, layoutHotspots, type Hotspot } from '../data/plans'

/* "Draw" every stroked shape in a scope, then fade fills and labels in. */
function drawIn(scope: string, scrollTrigger?: ScrollTrigger.Vars) {
  if (prefersReducedMotion) return
  const tl = gsap.timeline({ scrollTrigger })
  tl.from(`${scope} .pd`, { drawSVG: '0%', duration: 1.6, stagger: 0.006, ease: 'power2.inOut' })
    .from(`${scope} .pd`, { fillOpacity: 0, duration: 0.9, stagger: 0.004 }, '-=1')
    .from(`${scope} text, ${scope} .p-roadline, ${scope} .p-track, ${scope} .p-stripe`, { opacity: 0, duration: 0.6 }, '-=0.6')
  return tl
}

/* ---------------------------------------------------------------------------
   Full-screen zoom viewer (wheel / buttons to zoom, drag to pan)
--------------------------------------------------------------------------- */
export function ZoomViewer({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  if (!open) return null
  return (
    <ZoomInner title={title} onClose={onClose}>
      {children}
    </ZoomInner>
  )
}

function ZoomInner({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const [scale, setScale] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const drag = useRef<{ x: number; y: number } | null>(null)
  const clamp = (v: number) => Math.min(4, Math.max(1, v))

  // keep the latest onClose in a ref so the key listener is attached exactly once
  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = onClose
  })
  useEffect(() => {
    lockScroll(true)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current()
    window.addEventListener('keydown', onKey)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const zoomBy = (d: number) =>
    setScale((s) => {
      const next = clamp(s + d)
      if (next === 1) setPos({ x: 0, y: 0 })
      return next
    })

  const down = (e: RPointerEvent) => {
    drag.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const move = (e: RPointerEvent) => {
    if (drag.current && scale > 1) setPos({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y })
  }

  return (
    <div className="zoom" role="dialog" aria-modal="true" aria-label={title} data-lenis-prevent>
      <div className="zoom__bar">
        <span className="zoom__title">{title}</span>
        <div className="zoom__tools">
          <button onClick={() => zoomBy(-0.5)} aria-label="Zoom out">
            −
          </button>
          <span className="zoom__pct">{Math.round(scale * 100)}%</span>
          <button onClick={() => zoomBy(0.5)} aria-label="Zoom in">
            +
          </button>
          <button
            onClick={() => {
              setScale(1)
              setPos({ x: 0, y: 0 })
            }}
          >
            Reset
          </button>
          <button className="zoom__close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
      </div>
      <div
        className={`zoom__stage ${scale > 1 ? 'is-zoomed' : ''}`}
        onWheel={(e) => zoomBy(e.deltaY < 0 ? 0.25 : -0.25)}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={() => (drag.current = null)}
        onDoubleClick={() => zoomBy(scale > 1 ? -4 : 1)}
      >
        <div className="zoom__content" style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})` }}>
          {children}
        </div>
      </div>
      <p className="zoom__hint">Scroll or use +/− to zoom · drag to pan · double-click to toggle</p>
    </div>
  )
}

/* ---------------------------------------------------------------------------
   Master layout — site plan with numbered hotspots + legend
--------------------------------------------------------------------------- */
function LayoutCanvas({
  project,
  points,
  active,
  setActive,
}: {
  project: Project
  points: Hotspot[]
  active: number | null
  setActive?: (n: number | null) => void
}) {
  return (
    <div className="layout-canvas" style={{ aspectRatio: `${LAYOUT_VIEWBOX.w} / ${LAYOUT_VIEWBOX.h}` }}>
      {project.masterLayoutImage ? (
        <Img className="layout-canvas__img" src={project.masterLayoutImage} alt={`${project.name} master layout`} />
      ) : (
        <MasterLayoutDrawing kind={project.layout} towers={project.towers} />
      )}
      {points.map((p) => (
        <button
          key={p.n}
          type="button"
          className={`hotspot ${active === p.n ? 'is-active' : ''}`}
          style={{ left: `${(p.x / LAYOUT_VIEWBOX.w) * 100}%`, top: `${(p.y / LAYOUT_VIEWBOX.h) * 100}%` }}
          onMouseEnter={() => setActive?.(p.n)}
          onMouseLeave={() => setActive?.(null)}
          onFocus={() => setActive?.(p.n)}
          onBlur={() => setActive?.(null)}
          onClick={(e) => {
            e.stopPropagation()
            setActive?.(p.n)
          }}
          aria-label={p.label}
          data-cursor=""
        >
          <span className="hotspot__dot">{p.n}</span>
          <span className="hotspot__tip">{p.label}</span>
        </button>
      ))}
    </div>
  )
}

export function MasterLayoutSection({ project }: { project: Project }) {
  const { openEnquiry } = useApp()
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const [zoom, setZoom] = useState(false)
  const points = layoutHotspots(project.layout, project.towers)

  useGSAP(
    () => {
      if (prefersReducedMotion) return
      const st = { trigger: '.mlayout__stage', start: 'top 75%', once: true }
      const tl = project.masterLayoutImage
        ? gsap.timeline({ scrollTrigger: st }).from('.layout-canvas__img', { clipPath: 'inset(0 100% 0 0)', duration: 1.4, ease: 'expo.inOut' })
        : drawIn('.mlayout__stage', st)
      tl?.from('.mlayout__stage .hotspot', { scale: 0, autoAlpha: 0, stagger: 0.06, duration: 0.6, ease: 'back.out(3)' }, '-=0.3')
      gsap.from('.legend li', {
        x: -30,
        autoAlpha: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.legend', start: 'top 85%', once: true },
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="layout" className="mlayout section">
      <div className="container">
        <div className="section-head section-head--row">
          <div>
            <Eyebrow index="05">Master layout</Eyebrow>
            <SplitReveal className="h-display">The lay of the land.</SplitReveal>
            <p className="lead mlayout__intro">
              Explore how {project.name} is planned — hover a number to find each tower, amenity and open space.
            </p>
          </div>
          <div className="plan-actions">
            <button className="btn btn--outline" onClick={() => setZoom(true)}>
              View full screen
            </button>
            <button className="btn btn--gold" onClick={() => openEnquiry(project.name)}>
              Download master plan <Arrow />
            </button>
          </div>
        </div>

        <div className="mlayout__grid">
          <div className="mlayout__stage" data-cursor="Zoom" onClick={() => setZoom(true)}>
            <LayoutCanvas project={project} points={points} active={active} setActive={setActive} />
          </div>
          <ol className="legend" aria-label="Master layout legend">
            {points.map((p) => (
              <li
                key={p.n}
                className={active === p.n ? 'is-active' : ''}
                onMouseEnter={() => setActive(p.n)}
                onMouseLeave={() => setActive(null)}
              >
                <span>{String(p.n).padStart(2, '0')}</span>
                {p.label}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <ZoomViewer open={zoom} title={`${project.name} — Master layout`} onClose={() => setZoom(false)}>
        <LayoutCanvas project={project} points={points} active={null} />
      </ZoomViewer>
    </section>
  )
}

/* ---------------------------------------------------------------------------
   Floor plans — "Master floor plan" (typical floor) + "Unit plans"
--------------------------------------------------------------------------- */
const FACING = ['North-West', 'North-East', 'South-West', 'South-East']

export function FloorPlansSection({ project }: { project: Project }) {
  const { openEnquiry } = useApp()
  const root = useRef<HTMLElement>(null)
  const hasMaster = project.towers.length > 0
  const [tab, setTab] = useState<'master' | 'unit'>(hasMaster ? 'master' : 'unit')
  const [tower, setTower] = useState(0)
  const [plan, setPlan] = useState(0)
  const [hover, setHover] = useState<number | null>(null)
  const [zoom, setZoom] = useState(false)

  // every tower gets 4 flats per floor; odd towers mirror the mix
  const mix = tower % 2 ? [1, 0, 0, 1] : [0, 1, 1, 0]
  const prefix = project.towers[tower]?.split(' ').pop()?.charAt(0) ?? 'A'
  const units = FLOOR_UNITS.map((_, i) => ({
    no: `${prefix}-${String(i + 1).padStart(2, '0')}`,
    planIndex: mix[i] % project.floorPlans.length,
    plan: project.floorPlans[mix[i] % project.floorPlans.length],
  }))
  const current = project.floorPlans[plan]
  const hovered = hover !== null ? units[hover] : null

  useGSAP(
    () => {
      if (prefersReducedMotion) return
      if (tab === 'master' && project.masterFloorPlanImage) {
        gsap.from('.fplans__canvas img', { autoAlpha: 0, scale: 1.05, duration: 1 })
      } else if (tab === 'unit' && current.image) {
        gsap.from('.fplans__canvas img', { autoAlpha: 0, scale: 1.05, duration: 1 })
      } else {
        drawIn('.fplans__canvas', { trigger: '.fplans__canvas', start: 'top 80%', once: true })
      }
      gsap.from('.fplans__info > *', { y: 24, autoAlpha: 0, stagger: 0.06, duration: 0.8, ease: 'power3.out' })
    },
    { scope: root, dependencies: [tab, plan, tower], revertOnUpdate: true },
  )

  const pickUnit = (i: number) => {
    setPlan(units[i].planIndex)
    setTab('unit')
  }

  const canvas =
    tab === 'master' ? (
      project.masterFloorPlanImage ? (
        <Img src={project.masterFloorPlanImage} alt={`${project.towers[tower]} typical floor plan`} />
      ) : (
        <TypicalFloorDrawing units={units} active={hover} onHover={setHover} onPick={pickUnit} />
      )
    ) : current.image ? (
      <Img src={current.image} alt={`${current.name} floor plan`} />
    ) : (
      <UnitPlanDrawing plan={current} />
    )

  return (
    <section ref={root} id="plans" className="fplans section">
      <div className="container">
        <div className="section-head section-head--row">
          <div>
            <Eyebrow index="06">Floor plans</Eyebrow>
            <SplitReveal className="h-display">Layouts that just work.</SplitReveal>
          </div>
          <div className="seg" role="tablist" aria-label="Floor plan type">
            {hasMaster && (
              <button role="tab" aria-selected={tab === 'master'} className={tab === 'master' ? 'is-active' : ''} onClick={() => setTab('master')}>
                Master floor plan
              </button>
            )}
            <button role="tab" aria-selected={tab === 'unit'} className={tab === 'unit' ? 'is-active' : ''} onClick={() => setTab('unit')}>
              Unit plans
            </button>
          </div>
        </div>

        <div className="fplans__grid">
          <aside className="fplans__info">
            {tab === 'master' ? (
              <>
                <div className="chips" role="group" aria-label="Tower">
                  {project.towers.map((t, i) => (
                    <button key={t} className={`chip ${tower === i ? 'is-active' : ''}`} onClick={() => setTower(i)} aria-pressed={tower === i}>
                      {t}
                    </button>
                  ))}
                </div>
                <h3 className="fplans__title">{project.towers[tower]} — typical floor</h3>
                <p className="fplans__note">4 {project.type === 'Commercial' ? 'units' : 'homes'} per floor around a central lift core.</p>
                <div className="fplans__unit">
                  {hovered ? (
                    <>
                      <span className="fplans__unit-no">{hovered.no}</span>
                      <dl>
                        <div>
                          <dt>Type</dt>
                          <dd>{hovered.plan.name}</dd>
                        </div>
                        <div>
                          <dt>Carpet area</dt>
                          <dd>{hovered.plan.area}</dd>
                        </div>
                        <div>
                          <dt>Facing</dt>
                          <dd>{FACING[hover!]}</dd>
                        </div>
                      </dl>
                      <p className="fplans__hint">Click to open this unit plan</p>
                    </>
                  ) : (
                    <p className="fplans__hint">Hover a {project.type === 'Commercial' ? 'unit' : 'flat'} on the plan to see its details. Click it to open the unit plan.</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="chips" role="group" aria-label="Unit type">
                  {project.floorPlans.map((fp, i) => (
                    <button key={fp.name} className={`chip ${plan === i ? 'is-active' : ''}`} onClick={() => setPlan(i)} aria-pressed={plan === i}>
                      {fp.name}
                    </button>
                  ))}
                </div>
                <h3 className="fplans__title">{current.name}</h3>
                <p className="fplans__area">{current.area}</p>
                <p className="fplans__note">Carpet area as per RERA. Dimensions are indicative.</p>
              </>
            )}
            <div className="plan-actions plan-actions--stack">
              <button className="btn btn--gold" onClick={() => openEnquiry(project.name)}>
                Download floor plan <Arrow />
              </button>
              <button className="link-arrow" onClick={() => setZoom(true)}>
                View full screen <Arrow />
              </button>
            </div>
          </aside>

          <div className={`fplans__canvas ${tab === 'master' ? 'is-master' : ''}`} data-cursor={tab === 'unit' ? 'Zoom' : undefined} onClick={tab === 'unit' ? () => setZoom(true) : undefined}>
            {canvas}
          </div>
        </div>
      </div>

      <ZoomViewer
        open={zoom}
        title={tab === 'master' ? `${project.towers[tower]} — typical floor plan` : `${project.name} — ${current.name}`}
        onClose={() => setZoom(false)}
      >
        <div className="zoom__plan">
          {tab === 'master' ? (
            project.masterFloorPlanImage ? (
              <Img src={project.masterFloorPlanImage} alt="" />
            ) : (
              <TypicalFloorDrawing units={units} active={null} onHover={() => {}} onPick={() => {}} />
            )
          ) : current.image ? (
            <Img src={current.image} alt="" />
          ) : (
            <UnitPlanDrawing plan={current} />
          )}
        </div>
      </ZoomViewer>
    </section>
  )
}
