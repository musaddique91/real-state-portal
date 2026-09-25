import { useRef, useState } from 'react'
import { gsap, isTouch, prefersReducedMotion, useGSAP } from '../lib/motion'

/**
 * Custom cursor: a small dot plus a lagging ring. Hover any element with
 * `data-cursor="View"` (or "Drag", "Open"...) and the ring grows into a label.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [hover, setHover] = useState(false)

  useGSAP(() => {
    if (isTouch || prefersReducedMotion) return
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.15, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.15, ease: 'power3' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.6, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.6, ease: 'power3' })

    const move = (e: MouseEvent) => {
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
      document.documentElement.classList.add('has-cursor')
    }
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      const labelled = t.closest<HTMLElement>('[data-cursor]')
      setLabel(labelled?.dataset.cursor ?? '')
      setHover(!!t.closest('a, button, [role="button"], input, select, textarea, label'))
    }
    const leave = () => document.documentElement.classList.remove('has-cursor')

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    document.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      document.removeEventListener('mouseleave', leave)
    }
  })

  if (isTouch || prefersReducedMotion) return null
  return (
    <>
      <div ref={dot} className={`cursor-dot ${label ? 'is-hidden' : ''}`} aria-hidden />
      <div ref={ring} className={`cursor-ring ${label ? 'is-label' : hover ? 'is-hover' : ''}`} aria-hidden>
        <span>{label}</span>
      </div>
    </>
  )
}
