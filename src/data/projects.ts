import { img } from './site'

export type ProjectType = 'Residential' | 'Commercial'
export type ProjectStatus = 'Ongoing' | 'Completed' | 'Upcoming'

export type Project = {
  slug: string
  name: string
  type: ProjectType
  status: ProjectStatus
  location: string
  city: 'Pune' | 'Mumbai' | 'Bengaluru'
  config: string
  area: string
  price: string
  rera: string
  tagline: string
  description: string
  hero: string
  gallery: string[]
  highlights: string[]
  amenities: string[]
  floorPlans: { name: string; area: string; image: string }[]
}

const residentialAmenities = [
  'Clubhouse', 'Swimming Pool', 'Gymnasium', 'Kids Play Area', 'Jogging Track', 'Yoga Deck',
  'Landscaped Gardens', 'Indoor Games', 'Multipurpose Hall', '24x7 Security', 'EV Charging', 'Power Backup',
]
const commercialAmenities = [
  'Grand Lobby', 'High-speed Elevators', 'Food Court', 'Conference Rooms', 'Ample Parking', 'EV Charging',
  'Access Control', '24x7 Security', 'Power Backup', 'Fire Safety', 'Business Lounge', 'Café',
]

const plans = (a: string, b: string) => [
  { name: '2 BHK', area: a, image: img('1600607687939-ce8a6c25118c', 1200) },
  { name: '3 BHK', area: b, image: img('1600566753190-17f0baa2a6c3', 1200) },
]

export const projects: Project[] = [
  {
    slug: 'aurum-skyline',
    name: 'Aurum Skyline',
    type: 'Residential',
    status: 'Ongoing',
    location: 'Baner',
    city: 'Pune',
    config: '2 & 3 BHK Residences',
    area: '850 – 1,450 sq.ft.',
    price: '₹ 1.2 Cr onwards',
    rera: 'P52100012345',
    tagline: 'Live above the ordinary',
    description:
      'Twin 32-storey towers with panoramic views of the Baner hills, a 40,000 sq.ft. clubhouse and three acres of landscaped greens. Designed for families who want the city at their doorstep and calm at home.',
    hero: img('1545324418-cc1a3fa10c00', 2000),
    gallery: [
      img('1545324418-cc1a3fa10c00', 1600),
      img('1600607687939-ce8a6c25118c', 1600),
      img('1560448204-e02f11c3d0e2', 1600),
      img('1571896349842-33c89424de2d', 1600),
      img('1534438327276-14e5300c3a48', 1600),
    ],
    highlights: [
      '3 acres of landscaped open spaces',
      '40,000 sq.ft. multi-level clubhouse',
      'Only 4 apartments per floor',
      '10 min from Hinjewadi IT Park',
      'Vastu-compliant layouts',
      'IGBC pre-certified green building',
    ],
    amenities: residentialAmenities,
    floorPlans: plans('850 sq.ft.', '1,450 sq.ft.'),
  },
  {
    slug: 'aurum-riverside',
    name: 'Aurum Riverside',
    type: 'Residential',
    status: 'Completed',
    location: 'Kalyani Nagar',
    city: 'Pune',
    config: '3 & 4 BHK Residences',
    area: '1,600 – 2,400 sq.ft.',
    price: '₹ 2.4 Cr onwards',
    rera: 'P52100023456',
    tagline: 'Where the river meets refinement',
    description:
      'A boutique riverfront address with only 96 residences, private decks and a 1 km riverside promenade. Quiet luxury, minutes from the airport and business districts.',
    hero: img('1600596542815-ffad4c1539a9', 2000),
    gallery: [
      img('1600596542815-ffad4c1539a9', 1600),
      img('1600210492486-724fe5c67fb0', 1600),
      img('1502672260266-1c1ef2d93688', 1600),
      img('1540541338287-41700207dee6', 1600),
    ],
    highlights: [
      'Only 96 residences',
      'Private sundecks in every home',
      '1 km riverfront promenade',
      '12 min to Pune Airport',
      'Double-height lobby',
      'Smart-home automation',
    ],
    amenities: residentialAmenities,
    floorPlans: [
      { name: '3 BHK', area: '1,600 sq.ft.', image: img('1600210492486-724fe5c67fb0', 1200) },
      { name: '4 BHK', area: '2,400 sq.ft.', image: img('1502672260266-1c1ef2d93688', 1200) },
    ],
  },
  {
    slug: 'aurum-business-bay',
    name: 'Aurum Business Bay',
    type: 'Commercial',
    status: 'Completed',
    location: 'Bund Garden Road',
    city: 'Pune',
    config: 'Offices & Showrooms',
    area: '500 – 20,000 sq.ft.',
    price: 'On request',
    rera: 'P52100034567',
    tagline: 'An address that means business',
    description:
      'A LEED Gold certified business address with flexible floor plates, a triple-height lobby and street-facing showrooms on the city’s most prestigious commercial corridor.',
    hero: img('1486406146926-c627a92ad1ab', 2000),
    gallery: [
      img('1486406146926-c627a92ad1ab', 1600),
      img('1497366216548-37526070297c', 1600),
      img('1497366811353-6870744d04b2', 1600),
      img('1554435493-93422e8220c8', 1600),
    ],
    highlights: [
      'LEED Gold certified',
      'Triple-height entrance lobby',
      'Flexible floor plates up to 20,000 sq.ft.',
      'High-street showroom frontage',
      '3-level basement parking',
      'Metro station within 300 m',
    ],
    amenities: commercialAmenities,
    floorPlans: [
      { name: 'Office Suite', area: '1,200 sq.ft.', image: img('1497366811353-6870744d04b2', 1200) },
      { name: 'Full Floor', area: '20,000 sq.ft.', image: img('1497366216548-37526070297c', 1200) },
    ],
  },
  {
    slug: 'aurum-greenfields',
    name: 'Aurum Greenfields',
    type: 'Residential',
    status: 'Upcoming',
    location: 'Hinjewadi',
    city: 'Pune',
    config: '1, 2 & 3 BHK Homes',
    area: '520 – 1,180 sq.ft.',
    price: '₹ 65 L onwards',
    rera: 'Applied',
    tagline: 'A township that breathes',
    description:
      'A 25-acre integrated township with a school, retail high-street and 60% open spaces. Everything your family needs, within a five-minute walk.',
    hero: img('1580587771525-78b9dba3b914', 2000),
    gallery: [
      img('1580587771525-78b9dba3b914', 1600),
      img('1522708323590-d24dbb6b0267', 1600),
      img('1576013551627-0cc20b96c2a7', 1600),
      img('1493809842364-78817add7ffb', 1600),
    ],
    highlights: [
      '25-acre integrated township',
      '60% open spaces',
      'School & retail within the campus',
      'Walk-to-work from IT Park',
      'Cycling & jogging loops',
      'Pet park',
    ],
    amenities: residentialAmenities,
    floorPlans: plans('780 sq.ft.', '1,180 sq.ft.'),
  },
  {
    slug: 'aurum-marina',
    name: 'Aurum Marina',
    type: 'Residential',
    status: 'Ongoing',
    location: 'Worli',
    city: 'Mumbai',
    config: '3 & 4 BHK Sea-view Residences',
    area: '1,850 – 3,200 sq.ft.',
    price: '₹ 7.5 Cr onwards',
    rera: 'P51900045678',
    tagline: 'The sea, from every room',
    description:
      'Uninterrupted views of the Arabian Sea from a 48-storey tower with a sky-lounge, infinity pool and private elevator lobbies.',
    hero: img('1613490493576-7fde63acd811', 2000),
    gallery: [
      img('1613490493576-7fde63acd811', 1600),
      img('1605276374104-dee2a0ed3cd6', 1600),
      img('1600210492486-724fe5c67fb0', 1600),
      img('1571896349842-33c89424de2d', 1600),
    ],
    highlights: [
      'Full sea views from every residence',
      'Sky lounge on level 46',
      'Private lift lobbies',
      'Infinity-edge pool',
      'Concierge services',
      'Italian marble finishes',
    ],
    amenities: residentialAmenities,
    floorPlans: [
      { name: '3 BHK', area: '1,850 sq.ft.', image: img('1600210492486-724fe5c67fb0', 1200) },
      { name: '4 BHK', area: '3,200 sq.ft.', image: img('1600566753190-17f0baa2a6c3', 1200) },
    ],
  },
  {
    slug: 'aurum-tech-park',
    name: 'Aurum Tech Park',
    type: 'Commercial',
    status: 'Ongoing',
    location: 'Whitefield',
    city: 'Bengaluru',
    config: 'Grade-A IT Offices',
    area: '1,000 – 50,000 sq.ft.',
    price: 'On request',
    rera: 'PRM/KA/RERA/1251/446/PR/0001',
    tagline: 'Built for the way teams work',
    description:
      'A 1.2 million sq.ft. Grade-A campus with large efficient floor plates, a central green, food court and wellness amenities for the modern workforce.',
    hero: img('1554435493-93422e8220c8', 2000),
    gallery: [
      img('1554435493-93422e8220c8', 1600),
      img('1497366811353-6870744d04b2', 1600),
      img('1497366216548-37526070297c', 1600),
      img('1519501025264-65ba15a82390', 1600),
    ],
    highlights: [
      '1.2 million sq.ft. campus',
      'Large efficient floor plates',
      'Central landscaped plaza',
      'Food court & wellness centre',
      '100% power backup',
      'Close to ITPL & metro',
    ],
    amenities: commercialAmenities,
    floorPlans: [
      { name: 'Office Suite', area: '5,000 sq.ft.', image: img('1497366811353-6870744d04b2', 1200) },
      { name: 'Full Floor', area: '50,000 sq.ft.', image: img('1497366216548-37526070297c', 1200) },
    ],
  },
  {
    slug: 'aurum-villas',
    name: 'Aurum Villas',
    type: 'Residential',
    status: 'Completed',
    location: 'Sarjapur Road',
    city: 'Bengaluru',
    config: '4 BHK Private Villas',
    area: '3,600 – 4,800 sq.ft.',
    price: '₹ 4.8 Cr onwards',
    rera: 'PRM/KA/RERA/1251/308/PR/0002',
    tagline: 'Your own piece of the earth',
    description:
      'Forty-two private villas with gardens, a private pool option and a residents-only country club, set amidst mature trees.',
    hero: img('1564013799919-ab600027ffc6', 2000),
    gallery: [
      img('1564013799919-ab600027ffc6', 1600),
      img('1570129477492-45c003edd2be', 1600),
      img('1568605114967-8130f3a36994', 1600),
      img('1605276374104-dee2a0ed3cd6', 1600),
    ],
    highlights: [
      'Only 42 private villas',
      'Private garden with every villa',
      'Optional private pool',
      'Residents-only country club',
      'Gated community with 3-tier security',
      'Mature tree cover preserved',
    ],
    amenities: residentialAmenities,
    floorPlans: [
      { name: 'Villa Type A', area: '3,600 sq.ft.', image: img('1570129477492-45c003edd2be', 1200) },
      { name: 'Villa Type B', area: '4,800 sq.ft.', image: img('1568605114967-8130f3a36994', 1200) },
    ],
  },
  {
    slug: 'aurum-central',
    name: 'Aurum Central',
    type: 'Commercial',
    status: 'Upcoming',
    location: 'Lower Parel',
    city: 'Mumbai',
    config: 'Retail & Boutique Offices',
    area: '400 – 8,000 sq.ft.',
    price: 'On request',
    rera: 'Applied',
    tagline: 'Where the city comes together',
    description:
      'A mixed-use destination with high-street retail, boutique offices and a rooftop dining terrace in Mumbai’s most vibrant business district.',
    hero: img('1477959858617-67f85cf4f1df', 2000),
    gallery: [
      img('1477959858617-67f85cf4f1df', 1600),
      img('1519501025264-65ba15a82390', 1600),
      img('1497366216548-37526070297c', 1600),
    ],
    highlights: [
      'High-street retail frontage',
      'Rooftop dining terrace',
      'Boutique office floors',
      'Walking distance to railway',
      'Valet & smart parking',
      'Green building design',
    ],
    amenities: commercialAmenities,
    floorPlans: [
      { name: 'Retail Unit', area: '800 sq.ft.', image: img('1497366216548-37526070297c', 1200) },
      { name: 'Office Floor', area: '8,000 sq.ft.', image: img('1497366811353-6870744d04b2', 1200) },
    ],
  },
]

export const featured = projects.filter((p) =>
  ['aurum-skyline', 'aurum-marina', 'aurum-business-bay', 'aurum-greenfields', 'aurum-villas'].includes(p.slug),
)

export const getProject = (slug?: string) => projects.find((p) => p.slug === slug)
