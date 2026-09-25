import { useEffect, useRef, useState, type FormEvent } from 'react'
import { projects } from '../data/projects'
import { site } from '../data/site'
import { gsap, lockScroll, useGSAP } from '../lib/motion'
import { Arrow } from './primitives'

type Fields = { name: string; phone: string; email: string; project: string; message: string; consent: boolean }
type Errors = Partial<Record<keyof Fields, string>>

function validate(f: Fields): Errors {
  const e: Errors = {}
  if (f.name.trim().length < 2) e.name = 'Please enter your name'
  if (!/^[+\d][\d\s-]{7,}$/.test(f.phone.trim())) e.phone = 'Please enter a valid phone number'
  if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Please enter a valid email'
  if (!f.consent) e.consent = 'Please accept to continue'
  return e
}

export function EnquiryForm({ project = '', compact }: { project?: string; compact?: boolean }) {
  const [f, setF] = useState<Fields>({ name: '', phone: '', email: '', project, message: '', consent: false })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => setF((prev) => ({ ...prev, [k]: v }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(f)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setStatus('sending')
    // Replace this with a call to your CRM / email API (e.g. fetch('/api/enquiry', ...)).
    await new Promise((r) => setTimeout(r, 900))
    setStatus('sent')
  }

  if (status === 'sent') {
    return (
      <div className="form-success">
        <span className="form-success__icon">✓</span>
        <h3>Thank you, {f.name.split(' ')[0]}!</h3>
        <p>Our property advisor will call you within 24 hours. For anything urgent, call {site.phone}.</p>
      </div>
    )
  }

  return (
    <form className={`form ${compact ? 'form--compact' : ''}`} onSubmit={submit} noValidate>
      <div className="form__grid">
        <Field label="Full name*" error={errors.name}>
          <input value={f.name} onChange={(e) => set('name', e.target.value)} placeholder=" " autoComplete="name" />
        </Field>
        <Field label="Phone*" error={errors.phone}>
          <input value={f.phone} onChange={(e) => set('phone', e.target.value)} placeholder=" " type="tel" autoComplete="tel" />
        </Field>
        <Field label="Email" error={errors.email}>
          <input value={f.email} onChange={(e) => set('email', e.target.value)} placeholder=" " type="email" autoComplete="email" />
        </Field>
        <Field label="Interested in" filled>
          <select value={f.project} onChange={(e) => set('project', e.target.value)}>
            <option value="">Any project</option>
            {projects.map((p) => (
              <option key={p.slug} value={p.name}>
                {p.name} — {p.city}
              </option>
            ))}
          </select>
        </Field>
        {!compact && (
          <Field label="Message" wide>
            <textarea value={f.message} onChange={(e) => set('message', e.target.value)} placeholder=" " rows={3} />
          </Field>
        )}
      </div>
      <label className={`form__consent ${errors.consent ? 'has-error' : ''}`}>
        <input type="checkbox" checked={f.consent} onChange={(e) => set('consent', e.target.checked)} />
        <span>I authorise {site.name} to contact me via call, SMS, email or WhatsApp.</span>
      </label>
      <button className="btn btn--gold btn--block" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Submit enquiry'} <Arrow />
      </button>
    </form>
  )
}

function Field({ label, error, wide, filled, children }: { label: string; error?: string; wide?: boolean; filled?: boolean; children: React.ReactNode }) {
  return (
    <label className={`field ${wide ? 'field--wide' : ''} ${filled ? 'field--filled' : ''} ${error ? 'has-error' : ''}`}>
      {children}
      <span className="field__label">{label}</span>
      {error && <span className="field__error">{error}</span>}
    </label>
  )
}

export function EnquiryModal({ open, project, onClose }: { open: boolean; project: string; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline>(null)

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true, onReverseComplete: () => gsap.set(root.current, { visibility: 'hidden' }) })
        .set(root.current, { visibility: 'visible' })
        .fromTo('.modal__backdrop', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 })
        .fromTo('.modal__panel', { xPercent: 100 }, { xPercent: 0, duration: 0.9, ease: 'expo.out' }, 0)
        .from('.modal__panel > *', { autoAlpha: 0, x: 40, stagger: 0.06, duration: 0.6 }, 0.3)
    },
    { scope: root },
  )

  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    if (open) tl.current?.timeScale(1).play()
    else tl.current?.timeScale(1.8).reverse()
    lockScroll(open)
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div ref={root} className="modal" aria-hidden={!open} role="dialog" aria-modal="true" aria-label="Enquire now">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__panel" data-lenis-prevent>
        <button className="modal__close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <p className="eyebrow">Get in touch</p>
        <h2 className="modal__title">Book a site visit</h2>
        <p className="modal__text">Share your details and our advisor will get back with pricing, availability and offers.</p>
        {/* key resets the form every time the modal opens for a different project */}
        <EnquiryForm key={project + String(open)} project={project} compact />
      </div>
    </div>
  )
}
