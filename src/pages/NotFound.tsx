import { Arrow, SplitReveal, TLink } from '../components/primitives'

export default function NotFound() {
  return (
    <section className="notfound">
      <div className="container">
        <SplitReveal as="h1" by="chars" className="notfound__code">
          404
        </SplitReveal>
        <p>This address doesn’t exist — yet.</p>
        <TLink to="/" className="btn btn--gold">
          Back to home <Arrow />
        </TLink>
      </div>
    </section>
  )
}
