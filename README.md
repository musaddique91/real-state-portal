# Aurum Estates — premium real-estate website

A premium, animation-heavy real-estate website in the style of high-end Indian developer sites
(e.g. kumarcorp.co.in): cinematic hero slider, smooth scrolling, masked text reveals, pinned
horizontal galleries, parallax imagery and page-transition curtains.

## Stack & what each library does

| Library | Used for |
| --- | --- |
| **React 19 + Vite + TypeScript** | App framework / build |
| **GSAP 3** (`gsap`, `@gsap/react`) | All timeline animation — preloader, menu, modal, curtain |
| **GSAP ScrollTrigger** | Scroll-driven effects: pinned horizontal gallery, parallax, stacking cards, timeline line draw, counters |
| **GSAP SplitText** | Line / word / character masked headline reveals, word-by-word "fill" statement |
| **GSAP Flip** | Smooth re-layout of the property grid when filters change |
| **Lenis** | Buttery smooth (inertia) scrolling, synced to ScrollTrigger |
| **Swiper** | Hero cross-fade slider (Ken Burns zoom + autoplay progress), testimonials, project gallery |
| **React Router** | Pages + URL-synced property filters |

All GSAP plugins (including SplitText) are free since GSAP 3.13.

## Pages

- `/` Home — preloader, hero slider, legacy intro, stats counters, pinned horizontal projects, marquee, Residential/Commercial split panels, parallax quote, sticky stacking "promise" cards, testimonials, CTA
- `/legacy` Our Legacy — story, stats, animated timeline, values, leadership
- `/properties` All properties — filter by type / status / city (Flip animated, URL synced)
- `/properties/:slug` Project detail — sticky section nav, facts, highlights, gallery, amenities, floor plans, map, enquiry form, similar projects
- `/contact` Contact — form, offices, map

Global: custom cursor with labels, magnetic buttons, full-screen menu with image previews,
curtain page transitions, slide-in enquiry modal, WhatsApp + "Enquire now" floating buttons.
All motion is disabled for users with `prefers-reduced-motion`.

## Make it yours

- **Brand, contact, stats, testimonials, timeline, team:** `src/data/site.ts`
- **Projects (text, images, amenities, floor plans):** `src/data/projects.ts`
- **Colours & fonts:** CSS variables at the top of `src/styles/global.css`
- **Images:** currently Unsplash placeholders — replace URLs with your own (put files in `public/images/` and use `/images/xyz.jpg`)
- **Enquiry form:** hook your CRM/email API in `submit()` in `src/components/EnquiryForm.tsx`

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run lint
```

Deploys as a static SPA (Vercel `vercel.json` and Netlify `public/_redirects` rewrites included).
