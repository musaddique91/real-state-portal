// Central place for brand + contact details. Change these to make the site yours.

export const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const site = {
  name: 'MaverickIgnite',
  short: 'MaverickIgnite',
  founded: 1986,
  tagline: 'Crafting landmarks, building trust',
  description:
    'MaverickIgnite is a real estate developer crafting premium residential and commercial spaces across Pune, Mumbai and Bengaluru.',
  phone: '+91 98765 43210',
  email: 'sales@maverickignite.in',
  whatsapp: '919876543210',
  address: '12, Signature Tower, Koregaon Park, Pune 411001',
  mapQuery: 'Koregaon Park, Pune',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
  ],
  stats: [
    { value: 38, suffix: '+', label: 'Years of legacy' },
    { value: 120, suffix: '+', label: 'Projects delivered' },
    { value: 35000, suffix: '+', label: 'Happy families' },
    { value: 28, suffix: 'Mn', label: 'Sq. ft. developed' },
  ],
}

export type NavItem = { label: string; to: string; image: string }

export const nav: NavItem[] = [
  { label: 'Home', to: '/', image: img('1600596542815-ffad4c1539a9', 1000) },
  { label: 'Our Legacy', to: '/legacy', image: img('1486406146926-c627a92ad1ab', 1000) },
  { label: 'Residential', to: '/properties?type=Residential', image: img('1600607687939-ce8a6c25118c', 1000) },
  { label: 'Commercial', to: '/properties?type=Commercial', image: img('1497366216548-37526070297c', 1000) },
  { label: 'All Properties', to: '/properties', image: img('1545324418-cc1a3fa10c00', 1000) },
  { label: 'Contact', to: '/contact', image: img('1560448204-e02f11c3d0e2', 1000) },
]

export const testimonials = [
  {
    quote:
      'From the first site visit to the day we got our keys, everything was transparent. The quality of construction speaks for itself.',
    name: 'Ananya & Rohit Mehta',
    role: 'Residents, Maverick Parkview',
    photo: img('1494790108377-be9c29b29330', 300),
  },
  {
    quote:
      'Our office at Maverick Business Bay has become a real asset for the company. Great location, great people, great maintenance.',
    name: 'Vikram Desai',
    role: 'Founder, Northwind Labs',
    photo: img('1507003211169-0a1dd7228f2d', 300),
  },
  {
    quote:
      'We bought our second home with MaverickIgnite because the first one was such a good experience. That says everything.',
    name: 'Farah Sheikh',
    role: 'Resident, Maverick Riverside',
    photo: img('1438761681033-6461ffad8d80', 300),
  },
  {
    quote:
      'Possession on time, every promise kept. The clubhouse and landscaping are even better than the brochure.',
    name: 'Sanjay Kulkarni',
    role: 'Resident, Maverick Skyline',
    photo: img('1500648767791-00dcc994a43e', 300),
  },
]

export const pillars = [
  {
    title: 'Thoughtful Design',
    text: 'Every plan is drawn around light, air and the way families actually live — no wasted corners, no compromises.',
    image: img('1600566753190-17f0baa2a6c3', 1400),
  },
  {
    title: 'Uncompromising Quality',
    text: 'Branded materials, third-party audits and a dedicated quality cell on every site, from foundation to finish.',
    image: img('1600585154340-be6161a56a0c', 1400),
  },
  {
    title: 'Complete Transparency',
    text: 'RERA-registered projects, clear documentation and a single point of contact from booking to possession.',
    image: img('1497366811353-6870744d04b2', 1400),
  },
  {
    title: 'Lifetime Care',
    text: 'Our facility management team stays with you long after handover, so your home keeps its value for decades.',
    image: img('1512917774080-9991f1c4c750', 1400),
  },
]

export const timeline = [
  { year: '1986', title: 'The beginning', text: 'MaverickIgnite is founded in Pune with a single residential building and a promise: build it as if it were our own home.' },
  { year: '1995', title: 'First commercial landmark', text: 'Maverick Business Bay opens, redefining office spaces in the heart of the city.' },
  { year: '2004', title: '50 projects', text: 'Half a century of projects delivered — and every one of them handed over on time.' },
  { year: '2012', title: 'Beyond Pune', text: 'Expansion into Mumbai and Bengaluru with large-format integrated townships.' },
  { year: '2019', title: 'Sustainable by default', text: 'All new projects designed to IGBC green-building standards with rainwater harvesting and solar.' },
  { year: 'Today', title: '120+ landmarks', text: 'More than 35,000 families and hundreds of businesses call a MaverickIgnite address home.' },
]

export const leaders = [
  { name: 'R. K. Sharma', role: 'Founder & Chairman', photo: img('1560250097-0b93528c311a', 600) },
  { name: 'Meera Sharma', role: 'Managing Director', photo: img('1573496359142-b8d87734a5a2', 600) },
  { name: 'Arjun Sharma', role: 'Director, Projects', photo: img('1472099645785-5658abf4ff4e', 600) },
]
