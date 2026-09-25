import { useState } from 'react'
import { projects } from '../data/projects'
import { nav, site } from '../data/site'
import { Arrow, SplitReveal, TLink } from './primitives'
import { getLenis } from '../lib/motion'

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__intro">
            <h3 className="footer__heading">Let’s build your next chapter together.</h3>
            <form
              className="footer__news"
              onSubmit={(e) => {
                e.preventDefault()
                if (email) setSubscribed(true)
              }}
            >
              {subscribed ? (
                <p className="footer__thanks">Thank you — you’re on the list.</p>
              ) : (
                <>
                  <input
                    type="email"
                    required
                    placeholder="Your email for launch updates"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email address"
                  />
                  <button type="submit" aria-label="Subscribe">
                    <Arrow />
                  </button>
                </>
              )}
            </form>
          </div>

          <div className="footer__cols">
            <div>
              <h4>Explore</h4>
              <ul>
                {nav.map((n) => (
                  <li key={n.to}>
                    <TLink to={n.to}>{n.label}</TLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Projects</h4>
              <ul>
                {projects.slice(0, 6).map((p) => (
                  <li key={p.slug}>
                    <TLink to={`/properties/${p.slug}`}>{p.name}</TLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul>
                <li>{site.address}</li>
                <li>
                  <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </li>
              </ul>
              <div className="footer__socials">
                {site.socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <SplitReveal as="div" by="chars" className="footer__wordmark">
          {site.short}
        </SplitReveal>

        <div className="footer__bottom">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="footer__disclaimer">
            All projects are registered under RERA. Images are artistic impressions and indicative only.
          </p>
          <button className="footer__top-btn" 
            onClick={() => {
              const lenis = getLenis()
              if (lenis) lenis.scrollTo(0, { duration: 2 })
              else window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
