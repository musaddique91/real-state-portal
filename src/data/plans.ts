import type { LayoutKind } from './projects'

/** Coordinate space of the drawn master layout; hotspot x/y use these units. */
export const LAYOUT_VIEWBOX = { w: 1000, h: 620 }

export type Hotspot = { n: number; label: string; x: number; y: number }

export function layoutHotspots(kind: LayoutKind, towers: string[]): Hotspot[] {
  const t = (i: number, fallback: string) => towers[i] ?? fallback
  if (kind === 'villas')
    return [
      { n: 1, label: 'Entrance gate & security', x: 500, y: 582 },
      { n: 2, label: 'Country club', x: 250, y: 315 },
      { n: 3, label: 'Swimming pool', x: 445, y: 315 },
      { n: 4, label: 'Central park', x: 660, y: 315 },
      { n: 5, label: 'Villas — North row', x: 320, y: 165 },
      { n: 6, label: 'Villas — South row', x: 680, y: 455 },
      { n: 7, label: 'Internal loop road', x: 90, y: 310 },
      { n: 8, label: 'Tree-lined boundary', x: 910, y: 60 },
    ]
  if (kind === 'commercial')
    return [
      { n: 1, label: 'Entrance plaza', x: 500, y: 582 },
      { n: 2, label: 'Drop-off & porte-cochère', x: 340, y: 470 },
      { n: 3, label: `${t(0, 'Main tower')} & lobby`, x: 500, y: 240 },
      { n: 4, label: 'Fountain court', x: 500, y: 392 },
      { n: 5, label: 'Central green', x: 170, y: 250 },
      { n: 6, label: 'Food court', x: 835, y: 210 },
      { n: 7, label: 'Basement parking ramp', x: 835, y: 360 },
      { n: 8, label: 'EV charging bay', x: 835, y: 455 },
    ]
  return [
    { n: 1, label: 'Entrance gate & security', x: 500, y: 582 },
    { n: 2, label: t(0, 'Tower A'), x: 250, y: 215 },
    { n: 3, label: t(1, 'Tower B'), x: 750, y: 215 },
    { n: 4, label: 'Central garden', x: 500, y: 230 },
    { n: 5, label: 'Jogging track', x: 500, y: 130 },
    { n: 6, label: 'Clubhouse & gym', x: 245, y: 420 },
    { n: 7, label: 'Swimming pool', x: 470, y: 420 },
    { n: 8, label: "Kids' play area", x: 660, y: 420 },
    { n: 9, label: 'Amphitheatre', x: 800, y: 418 },
    { n: 10, label: 'Visitor parking', x: 620, y: 491 },
    { n: 11, label: 'Internal loop road', x: 90, y: 310 },
  ]
}

/** Four flats per typical floor, placed around the central core. */
export const FLOOR_UNITS = [
  { x: 60, y: 40, w: 350, h: 210, lx: 235, ly: 145 },
  { x: 590, y: 40, w: 350, h: 210, lx: 765, ly: 145 },
  { x: 60, y: 310, w: 350, h: 210, lx: 235, ly: 415 },
  { x: 590, y: 310, w: 350, h: 210, lx: 765, ly: 415 },
]
