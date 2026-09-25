import type { ReactNode } from 'react'
import { FLOOR_UNITS, LAYOUT_VIEWBOX } from '../data/plans'
import type { FloorPlan, LayoutKind, PlanTemplate } from '../data/projects'

/*
 * Vector drawings used as placeholders for architectural drawings.
 * Stroked shapes carry the `pd` class so GSAP DrawSVG can "draw" them in.
 * Give a project `masterLayoutImage` / `image` values to show real drawings instead.
 */

const Defs = () => (
  <defs>
    <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="8" stroke="#b8915c" strokeWidth="1.2" />
    </pattern>
    <pattern id="grass" width="10" height="10" patternUnits="userSpaceOnUse">
      <rect width="10" height="10" fill="#d5dcc4" />
      <circle cx="3" cy="3" r="1" fill="#b9c6a0" />
    </pattern>
  </defs>
)

const Trees = ({ pts }: { pts: [number, number][] }) => (
  <g>
    {pts.map(([x, y], i) => (
      <circle key={i} className="pd p-tree" cx={x} cy={y} r={11} />
    ))}
  </g>
)

const Label = ({ x, y, children, small }: { x: number; y: number; children: ReactNode; small?: boolean }) => (
  <text className={small ? 'p-dim' : 'p-label'} x={x} y={y} textAnchor="middle">
    {children}
  </text>
)

const boundaryTrees: [number, number][] = [
  ...Array.from({ length: 17 }, (_, i) => [80 + i * 53, 62] as [number, number]),
  ...Array.from({ length: 8 }, (_, i) => [62, 110 + i * 55] as [number, number]),
  ...Array.from({ length: 8 }, (_, i) => [938, 110 + i * 55] as [number, number]),
]

function Site({ children }: { children: ReactNode }) {
  return (
    <>
      <Defs />
      <rect className="pd p-site" x="40" y="40" width="920" height="540" rx="18" />
      <Trees pts={boundaryTrees} />
      {/* entrance */}
      <rect className="pd p-road-fill" x="483" y="520" width="34" height="62" />
      <rect className="pd p-gate" x="462" y="566" width="76" height="22" rx="3" />
      {children}
    </>
  )
}

const LoopRoad = () => (
  <>
    <rect className="pd p-road" x="90" y="90" width="820" height="440" rx="44" />
    <rect className="p-roadline" x="90" y="90" width="820" height="440" rx="44" />
  </>
)

export function MasterLayoutDrawing({ kind, towers }: { kind: LayoutKind; towers: string[] }) {
  const { w, h } = LAYOUT_VIEWBOX
  return (
    <svg className="plan-svg" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Master layout">
      <Site>
        {kind === 'residential' && (
          <>
            <LoopRoad />
            <ellipse className="pd p-green" cx="500" cy="230" rx="112" ry="80" />
            <ellipse className="p-track" cx="500" cy="230" rx="140" ry="100" />
            <Trees pts={[[450, 210], [540, 250], [505, 195], [470, 262]]} />
            <rect className="pd p-bldg" x="150" y="140" width="200" height="150" rx="6" />
            <rect className="pd p-core" x="225" y="190" width="50" height="50" />
            <Label x={250} y={278}>{(towers[0] ?? 'Tower A').toUpperCase()}</Label>
            <rect className="pd p-bldg" x="650" y="140" width="200" height="150" rx="6" />
            <rect className="pd p-core" x="725" y="190" width="50" height="50" />
            <Label x={750} y={278}>{(towers[1] ?? 'Tower B').toUpperCase()}</Label>
            <rect className="pd p-bldg" x="160" y="360" width="170" height="120" rx="6" />
            <Label x={245} y={468}>CLUBHOUSE</Label>
            <rect className="pd p-water" x="380" y="380" width="180" height="80" rx="34" />
            <Label x={470} y={478} small>POOL</Label>
            <circle className="pd p-green" cx="660" cy="420" r="40" />
            <path className="pd p-amphi" d="M750 440 A50 50 0 0 1 850 440 Z M765 440 A35 35 0 0 1 835 440 M780 440 A20 20 0 0 1 820 440" />
            <rect className="pd p-parking" x="560" y="472" width="120" height="38" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={i} className="p-stripe" x1={580 + i * 17} y1="472" x2={580 + i * 17} y2="510" />
            ))}
          </>
        )}

        {kind === 'villas' && (
          <>
            <LoopRoad />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <g key={i}>
                <rect className="pd p-plot" x={140 + i * 90} y="128" width="80" height="74" />
                <rect className="pd p-bldg" x={150 + i * 90} y="138" width="60" height="40" />
                <rect className="pd p-plot" x={140 + i * 90} y="418" width="80" height="74" />
                <rect className="pd p-bldg" x={150 + i * 90} y="442" width="60" height="40" />
                <text className="p-dim" x={180 + i * 90} y="196" textAnchor="middle">
                  V{i + 1}
                </text>
                <text className="p-dim" x={180 + i * 90} y="436" textAnchor="middle">
                  V{i + 9}
                </text>
              </g>
            ))}
            <rect className="pd p-bldg" x="170" y="260" width="160" height="110" rx="6" />
            <Label x={250} y={360}>COUNTRY CLUB</Label>
            <rect className="pd p-water" x="370" y="285" width="150" height="60" rx="26" />
            <ellipse className="pd p-green" cx="660" cy="315" rx="170" ry="62" />
            <ellipse className="p-track" cx="660" cy="315" rx="190" ry="78" />
            <Trees pts={[[580, 300], [640, 330], [700, 295], [760, 325], [620, 290]]} />
          </>
        )}

        {kind === 'commercial' && (
          <>
            <rect className="pd p-road" x="90" y="535" width="820" height="10" />
            <ellipse className="pd p-road" cx="500" cy="470" rx="160" ry="44" />
            <ellipse className="pd p-green" cx="500" cy="470" rx="130" ry="22" />
            <rect className="pd p-bldg" x="300" y="110" width="400" height="260" rx="8" />
            <rect className="pd p-core" x="455" y="190" width="90" height="100" />
            <Label x={500} y={352}>{(towers[0] ?? 'Main tower').toUpperCase()}</Label>
            <circle className="pd p-water" cx="500" cy="395" r="18" />
            <ellipse className="pd p-green" cx="170" cy="250" rx="95" ry="130" />
            <Trees pts={[[140, 190], [200, 230], [150, 300], [195, 330], [165, 150]]} />
            <rect className="pd p-bldg" x="760" y="150" width="150" height="120" rx="6" />
            <Label x={835} y={258}>FOOD COURT</Label>
            <rect className="pd p-parking" x="760" y="330" width="150" height="60" />
            <path className="pd p-arrow" d="M780 360 H880 M865 348 L880 360 L865 372" />
            <rect className="pd p-parking" x="760" y="425" width="150" height="55" />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <line key={i} className="p-stripe" x1={780 + i * 18} y1="425" x2={780 + i * 18} y2="480" />
            ))}
          </>
        )}
      </Site>
      <text className="p-north" x="982" y="26" textAnchor="middle">
        N
      </text>
      <path className="pd p-north-arrow" d="M982 32 L974 58 L982 51 L990 58 Z" />
    </svg>
  )
}

/* ---------------------------------------------------------------------------
   Unit plans
--------------------------------------------------------------------------- */
type Room = [x: number, y: number, w: number, h: number, label: string, dim?: string, kind?: 'balcony' | 'garden' | 'wet']

const TEMPLATES: Record<PlanTemplate, { w: number; h: number; rooms: Room[]; desks?: boolean }> = {
  '2bhk': {
    w: 560,
    h: 380,
    rooms: [
      [0, -50, 260, 50, 'BALCONY', `5'0" × 11'0"`, 'balcony'],
      [0, 0, 260, 220, 'LIVING / DINING', `11'0" × 18'0"`],
      [0, 220, 150, 160, 'KITCHEN', `8'0" × 10'6"`],
      [150, 220, 110, 100, 'TOILET', `5'0" × 7'6"`, 'wet'],
      [150, 320, 110, 60, 'UTILITY', '', 'wet'],
      [260, 0, 300, 200, 'MASTER BEDROOM', `11'0" × 13'0"`],
      [260, 200, 110, 110, 'M. TOILET', `5'0" × 8'0"`, 'wet'],
      [260, 310, 110, 70, 'PASSAGE'],
      [370, 200, 190, 180, 'BEDROOM 2', `10'0" × 11'0"`],
    ],
  },
  '3bhk': {
    w: 720,
    h: 380,
    rooms: [
      [0, -50, 300, 50, 'BALCONY', `5'6" × 13'0"`, 'balcony'],
      [520, -50, 200, 50, 'DECK', `5'0" × 9'0"`, 'balcony'],
      [0, 0, 300, 220, 'LIVING / DINING', `12'0" × 20'0"`],
      [0, 220, 160, 160, 'KITCHEN', `8'6" × 11'0"`],
      [160, 220, 140, 90, 'TOILET', `5'0" × 8'0"`, 'wet'],
      [160, 310, 140, 70, 'UTILITY', '', 'wet'],
      [300, 0, 220, 200, 'MASTER BEDROOM', `11'6" × 14'0"`],
      [520, 0, 200, 190, 'BEDROOM 2', `10'6" × 11'6"`],
      [300, 200, 110, 90, 'M. TOILET', `5'0" × 8'6"`, 'wet'],
      [410, 200, 110, 90, 'TOILET 2', `5'0" × 7'6"`, 'wet'],
      [300, 290, 220, 90, 'PASSAGE'],
      [520, 190, 200, 190, 'BEDROOM 3', `10'0" × 11'0"`],
    ],
  },
  '4bhk': {
    w: 860,
    h: 380,
    rooms: [
      [0, -50, 300, 50, 'SUNDECK', `6'0" × 14'0"`, 'balcony'],
      [520, -50, 340, 50, 'BALCONY', `5'0" × 16'0"`, 'balcony'],
      [0, 0, 300, 220, 'LIVING / DINING', `13'0" × 22'0"`],
      [0, 220, 160, 160, 'KITCHEN', `9'0" × 12'0"`],
      [160, 220, 140, 90, 'POWDER', '', 'wet'],
      [160, 310, 140, 70, 'UTILITY', '', 'wet'],
      [300, 0, 220, 200, 'MASTER BEDROOM', `12'0" × 16'0"`],
      [520, 0, 200, 190, 'BEDROOM 2', `11'0" × 12'0"`],
      [720, 0, 140, 190, 'BEDROOM 4', `10'0" × 11'0"`],
      [300, 200, 110, 90, 'M. TOILET', `6'0" × 9'0"`, 'wet'],
      [410, 200, 110, 90, 'TOILET 2', `5'0" × 8'0"`, 'wet'],
      [300, 290, 220, 90, 'FAMILY LOUNGE'],
      [520, 190, 200, 190, 'BEDROOM 3', `10'6" × 11'6"`],
      [720, 190, 140, 190, 'TOILET 3', `5'0" × 8'0"`, 'wet'],
    ],
  },
  villa: {
    w: 720,
    h: 430,
    rooms: [
      [0, 0, 320, 240, 'LIVING', `16'0" × 20'0"`],
      [320, 0, 200, 160, 'DINING', `12'0" × 14'0"`],
      [520, 0, 200, 160, 'KITCHEN', `10'0" × 14'0"`],
      [320, 160, 200, 170, 'GUEST BEDROOM', `12'0" × 13'0"`],
      [520, 160, 100, 90, 'TOILET', '', 'wet'],
      [620, 160, 100, 90, 'UTILITY', '', 'wet'],
      [520, 250, 200, 80, 'STAIRCASE'],
      [0, 240, 320, 90, 'FAMILY LOUNGE', `10'0" × 20'0"`],
      [0, 330, 720, 100, 'PRIVATE GARDEN', `20'0" × 45'0"`, 'garden'],
    ],
  },
  office: {
    w: 720,
    h: 380,
    desks: true,
    rooms: [
      [0, 0, 180, 120, 'RECEPTION'],
      [0, 120, 180, 130, 'CABIN 1', `10'0" × 12'0"`],
      [0, 250, 180, 130, 'CABIN 2', `10'0" × 12'0"`],
      [180, 0, 360, 380, 'OPEN WORKSTATIONS'],
      [540, 0, 180, 160, 'CONFERENCE', `12'0" × 15'0"`],
      [540, 160, 180, 110, 'PANTRY', '', 'wet'],
      [540, 270, 180, 110, 'TOILETS', '', 'wet'],
    ],
  },
  retail: {
    w: 720,
    h: 380,
    rooms: [
      [0, 0, 520, 380, 'SHOP FLOOR', `28'0" × 21'0"`],
      [520, 0, 200, 200, 'STORAGE', `11'0" × 11'0"`],
      [520, 200, 200, 180, 'CASH / TRIAL', `11'0" × 10'0"`],
    ],
  },
}

export function UnitPlanDrawing({ plan }: { plan: FloorPlan }) {
  const t = TEMPLATES[plan.template]
  const pad = 30
  const top = 60
  return (
    <svg className="plan-svg" viewBox={`0 0 ${t.w + pad * 2} ${t.h + top + pad}`} role="img" aria-label={`${plan.name} floor plan`}>
      <Defs />
      <g transform={`translate(${pad} ${top})`}>
        {t.rooms.map(([x, y, w, h, label, dim, kind], i) => (
          <g key={i}>
            <rect
              className={`pd ${kind === 'balcony' ? 'p-balcony' : kind === 'garden' ? 'p-garden' : kind === 'wet' ? 'p-wet' : 'p-room'}`}
              x={x}
              y={y}
              width={w}
              height={h}
            />
            <text className="p-room-label" x={x + w / 2} y={y + h / 2 - (dim ? 4 : -4)} textAnchor="middle">
              {label}
            </text>
            {dim && (
              <text className="p-dim" x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle">
                {dim}
              </text>
            )}
          </g>
        ))}
        {t.desks &&
          Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} className="pd p-desk" x={210 + (i % 4) * 80} y={70 + Math.floor(i / 4) * 100} width="50" height="30" rx="2" />
          ))}
        <rect className="pd p-outer" x="0" y="0" width={t.w} height={t.h} />
        {/* main door */}
        <path className="pd p-door" d={`M${t.w - 60} ${t.h} v-40 a40 40 0 0 1 40 40`} />
      </g>
    </svg>
  )
}

/* ---------------------------------------------------------------------------
   Master floor plan — typical floor with 4 units around a core
--------------------------------------------------------------------------- */
export function TypicalFloorDrawing({
  units,
  active,
  onHover,
  onPick,
}: {
  units: { no: string; plan: FloorPlan }[]
  active: number | null
  onHover: (i: number | null) => void
  onPick: (i: number) => void
}) {
  return (
    <svg className="plan-svg" viewBox="0 0 1000 560" role="img" aria-label="Typical floor plan">
      <Defs />
      <rect className="pd p-corridor" x="60" y="40" width="880" height="480" />
      {FLOOR_UNITS.map((u, i) => {
        const unit = units[i]
        return (
          <g
            key={i}
            className={`p-unit ${active === i ? 'is-active' : ''}`}
            onMouseEnter={() => onHover(i)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onPick(i)}
            role="button"
            tabIndex={0}
            aria-label={`Flat ${unit.no}, ${unit.plan.name}, ${unit.plan.area}`}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPick(i)}
            onFocus={() => onHover(i)}
            onBlur={() => onHover(null)}
          >
            <rect className="pd p-unit-shape" x={u.x} y={u.y} width={u.w} height={u.h} />
            <text className="p-unit-no" x={u.lx} y={u.ly - 18} textAnchor="middle">
              {unit.no}
            </text>
            <text className="p-room-label" x={u.lx} y={u.ly + 6} textAnchor="middle">
              {unit.plan.name.toUpperCase()}
            </text>
            <text className="p-dim" x={u.lx} y={u.ly + 26} textAnchor="middle">
              {unit.plan.area}
            </text>
          </g>
        )
      })}
      {/* core */}
      <rect className="pd p-core" x="440" y="110" width="120" height="340" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect className="pd p-lift" x="452" y={124 + i * 46} width="40" height="38" />
          <path className="pd p-lift-x" d={`M452 ${124 + i * 46} l40 38 M492 ${124 + i * 46} l-40 38`} />
        </g>
      ))}
      <rect className="pd p-stairs" x="500" y="124" width="48" height="130" />
      <rect className="pd p-stairs" x="452" y="330" width="96" height="108" />
      <Label x={500} y={296}>LOBBY</Label>
      <text className="p-dim" x="500" y="394" textAnchor="middle">
        STAIRS
      </text>
      <text className="p-dim" x="472" y="276" textAnchor="middle">
        LIFTS
      </text>
      <text className="p-north" x="970" y="60" textAnchor="middle">
        N
      </text>
      <path className="pd p-north-arrow" d="M970 68 L961 98 L970 90 L979 98 Z" />
    </svg>
  )
}
