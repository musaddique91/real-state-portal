import { CtaBanner } from '../components/blocks'
import { Marquee } from '../components/primitives'
import { Hero } from '../sections/Hero'
import { Categories, FeaturedProjects, Intro, ParallaxQuote, Pillars, Stats, Testimonials } from '../sections/HomeSections'

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Stats />
      <FeaturedProjects />
      <Marquee items={['Residential', 'Commercial', 'Pune', 'Mumbai', 'Bengaluru', 'Villas', 'Townships', 'Offices']} />
      <Categories />
      <ParallaxQuote />
      <Pillars />
      <Testimonials />
      <CtaBanner />
    </>
  )
}
