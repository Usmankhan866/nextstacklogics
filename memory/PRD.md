# NexStack Logics — Coming Soon Page (PRD)

## Original Problem Statement
User started a new full-service tech company named "NexStack Logics" (primary name "NexStack") offering web & app dev, security, e-commerce (Shopify, WordPress, Wix, Squarespace CMS), Meta ads, cloud, and every tech service. They requested a coming soon page built from a provided cinematic GSAP scroll-pinned React hero component, rebranded for NexStack. Logo: bold rounded "//"-style N mark (black & white versions provided).

## User Choices (confirmed via ask_human)
- Headline: "Empower Today." / "Own Tomorrow."
- Email "Notify Me" capture wired to backend (collect early leads)
- Phone mockup shows a NexStack project dashboard (projects delivered, clients, services)
- No exact launch date — show "Launching Soon"

## Iteration 2 (user feedback)
- Overall page background switched to WHITE (light theme): dark ink text outside the deep-blue card, light header/marquee/footer, dark "Notify Me" button
- Phone mockup screen now shows a MOCK OF THE NEXSTACK WEBSITE (mini nav, hero headline, Get Started button, stats, service grid) on a white screen instead of the dashboard

## Architecture
- Frontend: React 19 (CRA + craco, `@/` alias) + Tailwind + shadcn conventions
  - `src/components/ui/cinematic-landing-hero.jsx` — GSAP ScrollTrigger pinned scroll experience (7000px scrub), mouse-tracked 3D phone, card expand/pullback, CTA with subscribe form
  - `src/components/NexMark.jsx` — original SVG N mark (also used as favicon.svg)
  - `src/components/LaunchMarquee.jsx` — slow editorial services marquee + footer (framer-motion reveal)
  - Lenis smooth scroll wired to ScrollTrigger in `App.js`; sonner toasts
  - Fonts: Outfit (display), Plus Jakarta Sans (body), JetBrains Mono (eyebrows/metrics); dark cinematic theme (#030712, electric cyan #00F0FF accent)
- Backend: FastAPI + MongoDB (motor)
  - POST /api/subscribe — validates email (EmailStr), dedupes, stores in `waitlist` collection, returns position
- data-testids on all interactive/critical elements (subscribe-*, brand-logo, nav-launch-badge, service-marquee, phone widgets)

## Implemented (2026-01)
- Cinematic pinned hero rebranded for NexStack (headlines, card copy, dashboard, badges, header, favicon, SEO meta)
- Waitlist backend + email capture UI with success/error feedback (toast + inline)
- Services marquee + footer
- Verified: curl subscribe (new #1 / dupe / invalid 422), desktop + mobile screenshots across all scroll phases, form submit e2e

## Notes
- Phone dashboard stats ("140+ Projects Delivered", "98.8% Client Retention") are SAMPLE/MOCKED preview numbers inside the mockup UI — replace with real figures before launch if desired.

## Backlog
- P1: Admin view of waitlist emails (or CSV export endpoint)
- P2: Social links (Instagram/LinkedIn/WhatsApp) once user provides handles
- P2: Contact/WhatsApp deep link in CTA section
- P3: Full marketing site after launch (services pages, portfolio, blog)
