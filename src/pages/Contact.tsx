import { PageHero } from '../components/blocks'
import { EnquiryForm } from '../components/EnquiryForm'
import { Eyebrow, Reveal, SplitReveal } from '../components/primitives'
import { img, site } from '../data/site'

const offices = [
  { city: 'Pune (HQ)', address: site.address, phone: site.phone },
  { city: 'Mumbai', address: '7th Floor, Marina Tower, Worli, Mumbai 400018', phone: '+91 98765 43211' },
  { city: 'Bengaluru', address: '3rd Floor, Tech Park Plaza, Whitefield, Bengaluru 560066', phone: '+91 98765 43212' },
]

export default function Contact() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Let’s talk about your next address." image={img('1560448204-e02f11c3d0e2', 2200)} />

      <section className="contact section">
        <div className="container contact__grid">
          <div>
            <Eyebrow index="01">Get in touch</Eyebrow>
            <SplitReveal className="h-display">We’d love to hear from you.</SplitReveal>
            <Reveal className="contact__list" selector=".contact__item">
              <div className="contact__item">
                <span>Sales enquiries</span>
                <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </div>
              <div className="contact__item">
                <span>Office hours</span>
                <p>Mon – Sat, 10:00 am – 7:00 pm</p>
                <p>Sample flats open all 7 days</p>
              </div>
              <div className="contact__item">
                <span>Follow us</span>
                <p className="contact__socials">
                  {site.socials.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                      {s.label}
                    </a>
                  ))}
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal className="contact__form">
            <h3>Send us a message</h3>
            <EnquiryForm />
          </Reveal>
        </div>
      </section>

      <section className="offices section">
        <div className="container">
          <div className="section-head">
            <Eyebrow index="02">Our offices</Eyebrow>
            <SplitReveal className="h-display">Come say hello.</SplitReveal>
          </div>
          <Reveal className="offices__grid" selector=".office">
            {offices.map((o) => (
              <div key={o.city} className="office">
                <h3>{o.city}</h3>
                <p>{o.address}</p>
                <a href={`tel:${o.phone.replace(/\s/g, '')}`}>{o.phone}</a>
              </div>
            ))}
          </Reveal>
          <Reveal className="map">
            <iframe
              title="Head office map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>
    </>
  )
}
